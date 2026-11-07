import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const filename = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'app', 'thank-you', 'page.tsx');
const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function loadPage(retrieve) {
  class MockStripe {
    checkout = { sessions: { retrieve } };
  }
  const loadedModule = new Module(filename);
  loadedModule.filename = filename;
  loadedModule.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = loadedModule.require.bind(loadedModule);
  loadedModule.require = name => {
    if (name === 'stripe') return { default: MockStripe };
    if (name === 'next/link') return { default: ({ children, ...props }) => React.createElement('a', props, children) };
    return originalRequire(name);
  };
  loadedModule._compile(source, filename);
  return loadedModule.exports.default;
}

async function render(page, params) {
  return renderToStaticMarkup(await page({ searchParams: Promise.resolve(params) }));
}

test('paid renewal checkout displays a payment confirmation', async () => {
  const page = loadPage(async id => {
    assert.equal(id, 'cs_test_123');
    return { payment_status: 'paid', metadata: { type: 'hosting_renewal' } };
  });
  const html = await render(page, { renewal: 'true', session_id: 'cs_test_123' });
  assert.match(html, /Thank You for Your Payment/);
  assert.match(html, /hosting renewal payment has been received/);
  assert.doesNotMatch(html, /Strategy Call|Book another audit/);
});

test('unpaid, malformed, and unrelated sessions do not claim payment was received', async () => {
  const page = loadPage(async () => ({ payment_status: 'unpaid', metadata: { type: 'hosting_renewal' } }));
  const pending = await render(page, { renewal: 'true', session_id: 'cs_test_123' });
  assert.match(pending, /not yet been confirmed/);
  assert.match(pending, /Do not pay again/);
  const invalid = await render(page, { renewal: 'true', session_id: 'invalid' });
  assert.match(invalid, /could not verify/);
  const otherPage = loadPage(async () => ({ payment_status: 'paid', metadata: { type: 'other' } }));
  const other = await render(otherPage, { renewal: 'true', session_id: 'cs_test_123' });
  assert.match(other, /could not verify/);
  assert.doesNotMatch(other, /payment has been received/);
});

test('Stripe lookup failures provide safe guidance', async () => {
  const page = loadPage(async () => { throw new Error('Stripe unavailable'); });
  const html = await render(page, { renewal: 'true', session_id: 'cs_test_123' });
  assert.match(html, /could not verify/);
  assert.match(html, /Do not pay again/);
});

test('audit confirmation remains unchanged without renewal parameter', async () => {
  const page = loadPage(async () => { throw new Error('Unexpected Stripe lookup'); });
  const html = await render(page, {});
  assert.match(html, /Your Strategy Call Is Being Prepared/);
  assert.match(html, /Book another audit/);
});
