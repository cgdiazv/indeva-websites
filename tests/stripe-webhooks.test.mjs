import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const dirname = path.dirname(fileURLToPath(import.meta.url));

function loadTypeScript(file, dependencies = {}) {
  const filename = path.resolve(dirname, '..', file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = new Module(filename);
  loadedModule.filename = filename;
  loadedModule.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loadedModule.require.bind(loadedModule);
  loadedModule.require = name => dependencies[name] || originalRequire(name);
  loadedModule._compile(source, filename);
  return loadedModule.exports;
}

const { isHostingCheckoutInvoice } = loadTypeScript(path.join('lib', 'stripeInvoiceOrigin.ts'));
const { recordStripeSale } = loadTypeScript(path.join('lib', 'stripeSale.ts'), {
  '@/lib/orderCounter': {
    nextOrderNumber: last => typeof last === 'number' ? last + 1 : 4642,
  },
});

function asyncList(items) {
  return { async *[Symbol.asyncIterator]() { yield* items; } };
}

function stripeWithPayments(payments, sessions = []) {
  return {
    invoicePayments: { list: () => asyncList(payments) },
    checkout: { sessions: { list: () => asyncList(sessions) } },
  };
}

test('identifies marked renewal invoices without a Stripe lookup', async () => {
  assert.equal(await isHostingCheckoutInvoice({}, {
    id: 'in_1', metadata: { type: 'hosting_renewal_checkout' },
  }), true);
});

test('identifies older renewal invoices using their payment intent', async () => {
  const stripe = stripeWithPayments(
    [{ payment: { payment_intent: { id: 'pi_1' } } }],
    [{ metadata: { type: 'hosting_renewal' } }]
  );
  assert.equal(await isHostingCheckoutInvoice(stripe, {
    id: 'in_1', billing_reason: 'manual', metadata: {},
  }), true);
});

test('does not suppress standalone invoices or subscription renewals', async () => {
  const stripe = stripeWithPayments([{ payment: { payment_intent: 'pi_2' } }], [
    { metadata: { type: 'other' } },
  ]);
  assert.equal(await isHostingCheckoutInvoice(stripe, {
    id: 'in_2', billing_reason: 'manual', metadata: {},
  }), false);
  assert.equal(await isHostingCheckoutInvoice({}, {
    id: 'in_3', billing_reason: 'subscription_cycle', metadata: {},
  }), false);
});

test('propagates Stripe lookup errors so the webhook can be retried', async () => {
  const stripe = { invoicePayments: { list() { throw new Error('Stripe unavailable'); } } };
  await assert.rejects(isHostingCheckoutInvoice(stripe, {
    id: 'in_1', billing_reason: 'manual', metadata: {},
  }), /Stripe unavailable/);
});

function fakeFirestore(initial = {}) {
  const data = new Map(Object.entries(initial));
  let nextId = 0;
  let previous = Promise.resolve();
  const ref = key => ({ key });
  const snapshot = key => ({
    exists: data.has(key),
    data: () => data.get(key),
    get: field => data.get(key)?.[field],
  });
  return {
    data,
    collection(name) {
      return {
        doc(id) { return ref(`${name}/${id || `new-${++nextId}`}`); },
        where(field, operator, values) {
          assert.equal(operator, 'in');
          return { query: true, name, field, values, limit() { return this; } };
        },
      };
    },
    runTransaction(callback) {
      const work = previous.then(async () => {
        const writes = [];
        const transaction = {
          async get(target) {
            if (!target.query) return snapshot(target.key);
            const keys = [...data.keys()].filter(key =>
              key.startsWith(`${target.name}/`) && target.values.includes(data.get(key)[target.field])
            );
            return { empty: keys.length === 0, docs: keys.slice(0, 1).map(snapshot) };
          },
          set(target, value, options) {
            writes.push(() => data.set(target.key, options?.merge ? { ...data.get(target.key), ...value } : value));
          },
          update(target, value) {
            writes.push(() => data.set(target.key, { ...data.get(target.key), ...value }));
          },
        };
        const result = await callback(transaction);
        writes.forEach(write => write());
        return result;
      });
      previous = work.catch(() => {});
      return work;
    },
  };
}

test('retries and concurrent checkout events create one sale and advance hosting once', async () => {
  const db = fakeFirestore({ 'hosting_accounts/host_1': { renewalDate: '2099-01-01' } });
  const sale = { stripe_reference: 'cs_1', attribution: 'Hosting Renewal' };
  const results = await Promise.all([
    recordStripeSale(db, ['cs_1'], sale, 'host_1'),
    recordStripeSale(db, ['cs_1'], sale, 'host_1'),
  ]);
  assert.deepEqual(results.map(result => result.created), [true, false]);
  assert.equal(db.data.get('hosting_accounts/host_1').renewalDate, '2100-01-01');
  assert.equal(db.data.get('counters/orders').lastOrderNumber, 4642);
  assert.equal([...db.data.keys()].filter(key => key.startsWith('sales/')).length, 1);
});

test('both invoice events share a single sale, including legacy references', async () => {
  const db = fakeFirestore();
  const sale = { stripe_reference: 'INV-1' };
  const results = await Promise.all([
    recordStripeSale(db, ['in_1', 'INV-1'], sale),
    recordStripeSale(db, ['in_1', 'INV-1'], sale),
  ]);
  assert.deepEqual(results.map(result => result.created), [true, false]);
  const legacyDb = fakeFirestore({ 'sales/legacy': { stripe_reference: 'INV-2', order_number: 4000 } });
  assert.deepEqual(await recordStripeSale(legacyDb, ['in_2', 'INV-2'], sale), {
    orderNumber: 4000, created: false,
  });
});

test('a missing hosting account does not create a sale or consume an order', async () => {
  const db = fakeFirestore();
  await assert.rejects(recordStripeSale(db, ['cs_missing'], {}, 'missing'), /not found/);
  assert.equal(db.data.size, 0);
});

test('checkout and invoice webhook events produce one hosting renewal in either order', async () => {
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const previousResendKey = process.env.RESEND_API_KEY;
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  delete process.env.RESEND_API_KEY;
  try {
    for (const invoiceFirst of [true, false]) {
      const db = fakeFirestore({ 'hosting_accounts/host_1': { renewalDate: '2099-01-01' } });
      class MockStripe {
        constructor() {
          this.webhooks = { constructEvent: body => JSON.parse(body) };
          this.checkout = { sessions: { listLineItems: async () => ({ data: [] }) } };
        }
      }
      const { POST } = loadTypeScript(path.join('app', 'api', 'webhooks', 'stripe', 'route.ts'), {
        'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } },
        stripe: { default: MockStripe },
        '@/lib/firebaseAdmin': { db },
        '@/lib/stripeSale': { recordStripeSale },
        '@/lib/stripeInvoiceOrigin': { isHostingCheckoutInvoice },
        resend: { Resend: class {} },
      });
      const checkout = {
        type: 'checkout.session.completed',
        data: { object: {
          id: 'cs_1', invoice: null, payment_status: 'paid', amount_total: 13000,
          metadata: { type: 'hosting_renewal', hosting_id: 'host_1' },
        } },
      };
      const invoice = {
        type: 'invoice.paid',
        data: { object: {
          id: 'in_1', billing_reason: 'manual', metadata: { type: 'hosting_renewal_checkout' },
        } },
      };
      const events = invoiceFirst ? [invoice, checkout, invoice, checkout] : [checkout, invoice, checkout, invoice];
      for (const event of events) {
        const response = await POST({
          text: async () => JSON.stringify(event),
          headers: { get: () => 'signature' },
        });
        assert.equal(response.status, 200);
      }
      const sales = [...db.data.entries()].filter(([key]) => key.startsWith('sales/'));
      assert.equal(sales.length, 1);
      assert.equal(sales[0][1].products, 'Subscription Plan');
      assert.equal(sales[0][1].attribution, 'Hosting Renewal');
      assert.equal(db.data.get('hosting_accounts/host_1').renewalDate, '2100-01-01');
    }
  } finally {
    if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
    else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
    if (previousResendKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousResendKey;
  }
});
