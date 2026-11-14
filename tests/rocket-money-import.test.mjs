import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function load(file, dependencies = {}) {
  const filename = path.join(root, file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const loaded = new Module(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = name => dependencies[name] || originalRequire(name);
  loaded._compile(source, filename);
  return loaded.exports;
}

const utils = load('lib/expenseUtils.ts');
const importer = load('lib/rocketMoneyImport.ts', { './expenseUtils': utils });
const header = 'Date,Original Date,Account Type,Account Name,Account Number,Institution Name,Name,Custom Name,Amount,Description,Category,Note,Ignored From';
const csv = `${header}
2025-01-29,2025-01-29,Cash,Checking,,Bank,"Merchant, Inc",,29.99,"Merchant, Inc",Business,"Note, one",
2025-01-29,2025-01-29,Cash,Checking,,Bank,"Merchant, Inc",,29.99,"Merchant, Inc",Business,"Note, one",
2025-02-01,2025-02-01,Cash,Checking,,Bank,ATM withdrawal,,20,ATM withdrawal,Business,,budget
2025-02-02,2025-02-02,Cash,Checking,,Bank,Personal,,12,Personal,Groceries,,
2025-02-30,2025-02-30,Cash,Checking,,Bank,Invalid,,1,Invalid,Business,,
2025-02-03,2025-02-03,Cash,Checking,,Bank,Refund,,-20,Refund,Business,,
`;
const existing = [{ id: 'existing', title: 'Merchant', date: '2025-01-29T12:00:00.000Z', amount: 29.99 }];

test('parses only valid Business expenses and flags matches, repeated rows and withdrawals', () => {
  const result = importer.parseRocketMoneyCsv(csv, existing);
  assert.equal(result.rows.length, 3);
  assert.equal(result.otherCategories, 1);
  assert.equal(result.skipped.length, 2);
  assert.equal(result.rows[0].title, 'Merchant, Inc');
  assert.equal(result.rows[0].notes, 'Note, one');
  assert.equal(result.rows[0].matches[0].id, 'existing');
  assert.notEqual(result.rows[0].key, result.rows[1].key);
  assert.match(result.rows[0].warnings.join(' '), /more than once/);
  assert.match(result.rows[2].warnings.join(' '), /withdrawal.*Ignored from: budget/i);
  assert.equal(result.rows[2].paymentMethod, 'Other');
});

test('recognizes previously imported rows and rejects malformed CSV', () => {
  const row = importer.parseRocketMoneyCsv(csv, []).rows[0];
  assert.equal(importer.parseRocketMoneyCsv(csv, [{ ...row, id: row.key }]).rows[0].alreadyImported, true);
  assert.throws(() => importer.parseRocketMoneyCsv('Date,Name\n2025-01-01,test', []), /Missing CSV columns/);
  assert.throws(() => importer.parseRocketMoneyCsv(`${header}\n"unfinished`, []), /Invalid CSV/);
  assert.throws(() => importer.parseRocketMoneyCsv('Date,Date,Name,Amount,Category\n2025-01-01,2025-01-01,Test,1,Business', []), /duplicate column names/);
});

test('validates categories and monetary values before saving', () => {
  const row = importer.parseRocketMoneyCsv(csv, []).rows[0];
  assert.doesNotThrow(() => importer.validateSelection({ row, category: 'Other' }));
  assert.throws(() => importer.validateSelection({ row, category: 'Business' }), /Invalid import selection/);
  assert.throws(() => importer.validateSelection({ row: { ...row, amount: 1.234 }, category: 'Other' }), /Invalid import selection/);
});

function fakeDatabase(initial = []) {
  const entries = new Map(initial.map(item => [item.id, item]));
  const collection = {
    async get() { return snapshot(); },
    doc(id) { return { id }; },
  };
  function snapshot() {
    return { docs: [...entries].map(([id, value]) => ({ id, data: () => value })) };
  }
  return {
    entries,
    collection() { return collection; },
    async runTransaction(callback) {
      const writes = [];
      await callback({
        async get() { return snapshot(); },
        create(ref, value) { writes.push([ref.id, value]); },
      });
      for (const [id, value] of writes) {
        assert.equal(entries.has(id), false);
        entries.set(id, value);
      }
    },
  };
}

function actions(db, authorized = true) {
  return load('app/actions/rocketMoneyImport.ts', {
    '@/lib/firebaseAdmin': { db },
    '@/lib/rocketMoneyImport': importer,
    '@/lib/adminSession': { requireAdminSession: async () => {
      if (!authorized) throw new Error('Administrator authentication required.');
    } },
    'next/cache': { revalidatePath() {} },
  });
}

test('import requires admin session, checks new matches, and refuses repeated imports', async () => {
  const oldError = console.error;
  console.error = () => {};
  try {
    const db = fakeDatabase();
    const api = actions(db);
    assert.equal((await actions(db, false).previewRocketMoneyImport(csv)).success, false);
    assert.equal((await actions(db, false).importRocketMoneyExpenses([])).success, false);
    const preview = await api.previewRocketMoneyImport(csv);
    assert.equal(preview.success, true);
    const row = preview.preview.rows[2];
    db.entries.set('new-match', { date: row.date, amount: row.amount, title: 'New expense' });
    const selection = [{ row, category: 'Other' }];
    assert.match((await api.importRocketMoneyExpenses(selection)).error, /changed since the preview/);
    assert.equal(db.entries.size, 1);
    db.entries.delete('new-match');
    assert.deepEqual(await api.importRocketMoneyExpenses(selection), { success: true, count: 1 });
    assert.equal(db.entries.get(row.key).source, 'rocket-money-csv');
    assert.match((await api.importRocketMoneyExpenses(selection)).error, /already imported/);
  } finally {
    console.error = oldError;
  }
});
