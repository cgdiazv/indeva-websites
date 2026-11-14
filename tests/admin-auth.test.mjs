import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QRCodeSVG } from 'qrcode.react';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function load(file, dependencies = {}) {
  const filename = path.join(root, file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = new Module(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = name => Object.hasOwn(dependencies, name) ? dependencies[name] : originalRequire(name);
  loaded._compile(source, filename);
  return loaded.exports;
}

const claims = { uid: 'admin-uid', email_verified: true, auth_time: Math.floor(Date.now() / 1000), firebase: { sign_in_second_factor: 'totp' } };

test('authenticator enrollment renders the Firebase TOTP URI as a local QR code and retains the manual key', () => {
  const uri = 'otpauth://totp/Indeva:test?secret=TESTSECRET&issuer=Indeva';
  const secret = {
    secretKey: 'TESTSECRET',
    generateQrCodeUrl(account, issuer) {
      assert.equal(account, undefined);
      assert.equal(issuer, 'Indeva');
      return uri;
    },
  };
  let stateIndex = 0;
  let qrValue;
  const component = load('components/dashboard/EnrollAuthenticator.tsx', {
    react: {
      useState(initial) { return [stateIndex++ === 3 ? secret : initial, () => {}]; },
      useEffect() {},
      useRef(initial) { return { current: initial }; },
    },
    'firebase/app': { FirebaseError: class FirebaseError extends Error {} },
    'firebase/auth': { PhoneMultiFactorGenerator: { FACTOR_ID: 'phone' } },
    'qrcode.react': { QRCodeSVG(props) { qrValue = props.value; return React.createElement(QRCodeSVG, props); } },
    '@/app/actions/auth': {},
  });
  const html = renderToStaticMarkup(component.default({ auth: {}, resolver: { hints: [] }, onCancel() {} }));
  assert.equal(qrValue, uri);
  assert.match(html, /<svg/);
  assert.match(html, /<path/);
  assert.match(html, /TESTSECRET/);
  assert.match(html, /Código del autenticador/);
});

function fixture() {
  let cookie;
  let currentClaims = claims;
  let revoked = false;
  let count = 0;
  let start = Date.now();
  const jar = {
    get: name => name === '__session' && cookie ? { value: cookie } : undefined,
    set: (name, value, options) => { cookie = value; jar.lastSet = { name, options }; },
    delete: () => { cookie = undefined; },
  };
  const firebaseAuth = {
    async verifySessionCookie(value, checkRevoked) {
      assert.equal(checkRevoked, true);
      if (value !== 'signed-session' || revoked) throw new Error('Invalid or revoked session');
      return currentClaims;
    },
    async verifyIdToken(value, checkRevoked) {
      assert.equal(checkRevoked, true);
      if (value !== 'valid-id-token') throw new Error('Invalid token');
      return currentClaims;
    },
    async createSessionCookie() { return 'signed-session'; },
    async revokeRefreshTokens(uid) { assert.equal(uid, 'admin-uid'); revoked = true; },
  };
  const db = {
    collection() { return { doc() { return {}; } }; },
    async runTransaction(fn) {
      return fn({
        async get() { return { data: () => ({ count, start }) }; },
        set(ref, value) { count = value.count; start = value.start; },
      });
    },
  };
  const authModule = { getAuth: () => firebaseAuth };
  const headers = { cookies: async () => jar };
  const session = load('lib/adminSession.ts', {
    'server-only': {}, 'firebase-admin/auth': authModule, 'next/headers': headers,
    '@/lib/firebaseAdmin': { db },
  });
  const actions = load('app/actions/auth.ts', {
    'firebase-admin/auth': authModule, 'next/headers': headers,
    'next/navigation': { redirect() { throw new Error('redirect'); } },
    '@/lib/adminSession': session,
  });
  return { jar, session, actions, setCookie(value) { cookie = value; }, setClaims(value) { currentClaims = value; } };
}

test('session requires a signed, non-revoked cookie for the authorized MFA account', async () => {
  const previous = process.env.ADMIN_FIREBASE_UID;
  process.env.ADMIN_FIREBASE_UID = 'admin-uid';
  try {
    const f = fixture();
    await assert.rejects(f.session.requireAdminSession(), /authentication required/);
    f.setCookie('true');
    await assert.rejects(f.session.requireAdminSession(), /Invalid or revoked/);
    f.setCookie('signed-session');
    assert.equal((await f.session.requireAdminSession()).uid, 'admin-uid');
    for (const bad of [
      { ...claims, uid: 'someone-else' },
      { ...claims, email_verified: false },
      { ...claims, firebase: {} },
      { ...claims, firebase: { sign_in_second_factor: 'phone' } },
    ]) {
      f.setClaims(bad);
      await assert.rejects(f.session.requireAdminSession(), /authenticator MFA/);
    }
    delete process.env.ADMIN_FIREBASE_UID;
    f.setClaims(claims);
    await assert.rejects(f.session.requireAdminSession(), /not configured/);
  } finally {
    if (previous === undefined) delete process.env.ADMIN_FIREBASE_UID;
    else process.env.ADMIN_FIREBASE_UID = previous;
  }
});

test('session exchange requires recent TOTP login, sets secure cookie, and logout revokes', async () => {
  const previous = process.env.ADMIN_FIREBASE_UID;
  const oldError = console.error;
  process.env.ADMIN_FIREBASE_UID = 'admin-uid';
  console.error = () => {};
  try {
    const f = fixture();
    assert.equal((await f.actions.createAdminSession('fake')).success, false);
    f.setClaims({ ...claims, firebase: {} });
    assert.equal((await f.actions.createAdminSession('valid-id-token')).success, false);
    f.setClaims({ ...claims, auth_time: Math.floor(Date.now() / 1000) - 301 });
    assert.equal((await f.actions.createAdminSession('valid-id-token')).success, false);
    f.setClaims(claims);
    assert.equal((await f.actions.createAdminSession('valid-id-token')).success, true);
    assert.equal(f.jar.lastSet.name, '__session');
    assert.equal(f.jar.lastSet.options.httpOnly, true);
    assert.equal(f.jar.lastSet.options.sameSite, 'lax');
    assert.equal(f.jar.lastSet.options.maxAge, 8 * 60 * 60);
    await assert.rejects(f.actions.logout(), /redirect/);
    f.setCookie('signed-session');
    await assert.rejects(f.session.requireAdminSession(), /revoked/);
  } finally {
    console.error = oldError;
    if (previous === undefined) delete process.env.ADMIN_FIREBASE_UID;
    else process.env.ADMIN_FIREBASE_UID = previous;
  }
});

test('authenticator enrollment requires recent phone MFA for the authorized verified account', async () => {
  const previous = process.env.ADMIN_FIREBASE_UID;
  const oldError = console.error;
  process.env.ADMIN_FIREBASE_UID = 'admin-uid';
  console.error = () => {};
  try {
    const f = fixture();
    const phoneClaims = { ...claims, firebase: { sign_in_second_factor: 'phone' } };
    f.setClaims(phoneClaims);
    assert.equal((await f.actions.authorizeTotpEnrollment('valid-id-token')).success, true);
    assert.equal((await f.actions.createAdminSession('valid-id-token')).success, false);
    for (const bad of [
      { ...phoneClaims, uid: 'other' },
      { ...phoneClaims, email_verified: false },
      { ...phoneClaims, firebase: {} },
      { ...phoneClaims, auth_time: Math.floor(Date.now() / 1000) - 301 },
      { ...phoneClaims, auth_time: undefined },
    ]) {
      f.setClaims(bad);
      assert.equal((await f.actions.authorizeTotpEnrollment('valid-id-token')).success, false);
    }
    assert.equal((await f.actions.authorizeTotpEnrollment('bad')).success, false);
    delete process.env.ADMIN_FIREBASE_UID;
    f.setClaims(phoneClaims);
    assert.equal((await f.actions.authorizeTotpEnrollment('valid-id-token')).success, false);
  } finally {
    console.error = oldError;
    if (previous === undefined) delete process.env.ADMIN_FIREBASE_UID;
    else process.env.ADMIN_FIREBASE_UID = previous;
  }
});

test('session exchange enforces a global limit', async () => {
  const f = fixture();
  for (let i = 0; i < 30; i++) await f.session.checkSessionExchangeLimit();
  await assert.rejects(f.session.checkSessionExchangeLimit(), /Too many/);
});

test('every dashboard action checks authorization before accessing data', async () => {
  const neverAccess = { collection() { throw new Error('Database accessed without authorization'); } };
  const dependencies = {
    '@/lib/adminSession': { requireAdminSession: async () => { throw new Error('denied'); } },
    '@/lib/firebaseAdmin': { db: neverAccess },
    '@/lib/orderCounter': {},
    '@/lib/hostingUtils': {},
    '@/lib/stripeRenewal': {},
    'next/cache': { revalidatePath() {} },
  };
  for (const [file, names] of [
    ['app/actions/expenses.ts', ['getExpenses', 'createExpense', 'updateExpense', 'deleteExpense']],
    ['app/actions/sales.ts', ['createManualSale', 'deleteManualSale']],
    ['app/actions/hostings.ts', ['getHostingAccounts', 'createHostingAccount', 'updateHostingAccount', 'quickRenewHosting', 'deleteHostingAccount', 'generateRenewalPaymentLink', 'sendRenewalReminderEmail', 'sendWelcomeEmail', 'runAutomatedRenewalScan']],
  ]) {
    const actions = load(file, dependencies);
    for (const name of names) await assert.rejects(actions[name](), /denied/, `${name} must reject unauthorized callers`);
  }
});

test('scheduled renewal route requires a configured secret and passes it to the scanner', async () => {
  const previous = process.env.CRON_SECRET;
  let scanned = 0;
  const route = load('app/api/cron/send-renewals/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options.status }) } },
    '@/app/actions/hostings': { runAutomatedRenewalScan: async secret => {
      assert.equal(secret, 'cron-test-secret');
      scanned++;
      return { success: true };
    } },
  });
  try {
    delete process.env.CRON_SECRET;
    assert.equal((await route.GET(new Request('https://example.test/'))).status, 401);
    process.env.CRON_SECRET = 'cron-test-secret';
    assert.equal((await route.GET(new Request('https://example.test/', { headers: { authorization: 'Bearer wrong' } }))).status, 401);
    assert.equal(scanned, 0);
    assert.equal((await route.GET(new Request('https://example.test/', { headers: { authorization: 'Bearer cron-test-secret' } }))).status, 200);
    assert.equal(scanned, 1);
  } finally {
    if (previous === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previous;
  }
});
