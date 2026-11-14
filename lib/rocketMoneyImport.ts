import { createHash } from 'node:crypto';
import Papa from 'papaparse';
import { EXPENSE_CATEGORIES, EXPENSE_PAYMENT_METHODS, type ExpenseRecord } from './expenseUtils';

export const MAX_IMPORT_ROWS = 400;
export const MAX_CSV_BYTES = 500_000;

export interface RocketMoneyRow {
  key: string;
  line: number;
  title: string;
  date: string;
  amount: number;
  paymentMethod: string;
  notes: string;
  warnings: string[];
  matches: { id: string; title: string; date: string; amount: number }[];
  alreadyImported: boolean;
}

export interface RocketMoneyPreview {
  rows: RocketMoneyRow[];
  skipped: { line: number; reason: string }[];
  otherCategories: number;
}

export interface RocketMoneySelection {
  row: RocketMoneyRow;
  category: string;
}

const requiredColumns = ['Date', 'Name', 'Amount', 'Category'];

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validAmount(amount: number) {
  const cents = Math.round(amount * 100);
  return Number.isFinite(amount) && amount > 0 && Number.isSafeInteger(cents) &&
    Math.abs(amount * 100 - cents) < 0.000001;
}

export function expenseMatches(row: Pick<RocketMoneyRow, 'date' | 'amount'>, expenses: ExpenseRecord[]) {
  return expenses.filter(expense =>
    typeof expense.date === 'string' &&
    expense.date.slice(0, 10) === row.date &&
    Number.isFinite(Number(expense.amount)) &&
    Math.round(Number(expense.amount) * 100) === Math.round(row.amount * 100)
  ).map(expense => ({
    id: expense.id,
    title: expense.title,
    date: expense.date,
    amount: expense.amount,
  }));
}

export function parseRocketMoneyCsv(csv: string, expenses: ExpenseRecord[]): RocketMoneyPreview {
  if (Buffer.byteLength(csv, 'utf8') > MAX_CSV_BYTES) throw new Error('CSV exceeds the 500 KB limit.');
  const parsed = Papa.parse<Record<string, string>>(csv.replace(/^\uFEFF/, ''), {
    header: true,
    skipEmptyLines: 'greedy',
  });
  if (parsed.errors.length) throw new Error(`Invalid CSV: ${parsed.errors[0].message}`);
  const fields = parsed.meta.fields || [];
  const missing = requiredColumns.filter(column => !fields.includes(column));
  if (missing.length) throw new Error(`Missing CSV columns: ${missing.join(', ')}.`);
  if (parsed.meta.renamedHeaders && Object.keys(parsed.meta.renamedHeaders).length) {
    throw new Error('CSV contains duplicate column names.');
  }
  if (parsed.data.length > 2000) throw new Error('CSV exceeds the limit of 2,000 rows.');

  const rows: RocketMoneyRow[] = [];
  const skipped: RocketMoneyPreview['skipped'] = [];
  const occurrences = new Map<string, number>();
  let otherCategories = 0;
  parsed.data.forEach((source, index) => {
    const line = index + 2;
    if ((source.Category || '').trim().toLowerCase() !== 'business') {
      otherCategories++;
      return;
    }
    const date = (source.Date || '').trim();
    const title = (source['Custom Name'] || source.Name || '').trim();
    const amountText = (source.Amount || '').trim();
    const amount = Number(amountText);
    if (!validDate(date) || !title || !/^\d+(?:\.\d{1,2})?$/.test(amountText) || !validAmount(amount)) {
      skipped.push({ line, reason: 'Invalid date, description, or positive amount.' });
      return;
    }
    const identity = [
      date, (source['Original Date'] || '').trim(), amount.toFixed(2),
      (source.Name || '').trim(), (source['Account Type'] || '').trim(),
      (source['Account Name'] || '').trim(), (source['Account Number'] || '').trim(),
      (source['Institution Name'] || '').trim(),
    ];
    const hash = createHash('sha256').update(JSON.stringify(identity)).digest('hex');
    const occurrence = (occurrences.get(hash) || 0) + 1;
    occurrences.set(hash, occurrence);
    const key = `rocket_${hash}_${occurrence}`;
    const matches = expenseMatches({ date, amount }, expenses);
    const account = `${source['Account Type'] || ''} ${source['Account Name'] || ''} ${source['Institution Name'] || ''}`.toLowerCase();
    const paymentMethod = account.includes('paypal') ? 'PayPal'
      : account.includes('credit card') ? 'Credit Card'
      : account.includes('debit') ? 'Debit Card'
      : 'Other';
    const warnings: string[] = [];
    if (/\b(atm|withdrawal|withdrawl|withdraw|transfer|xfer|zelle)\b/i.test(`${title} ${source.Description || ''}`)) {
      warnings.push('Possible withdrawal or transfer');
    }
    if ((source['Ignored From'] || '').trim()) warnings.push(`Ignored from: ${source['Ignored From'].trim()}`);
    const notes = (source.Note || '').trim();
    rows.push({
      key, line, title, date, amount, paymentMethod, notes, warnings, matches,
      alreadyImported: expenses.some(expense => expense.id === key),
    });
  });

  const counts = new Map<string, number>();
  rows.forEach(row => {
    const matchKey = `${row.date}|${row.amount.toFixed(2)}`;
    counts.set(matchKey, (counts.get(matchKey) || 0) + 1);
  });
  rows.forEach(row => {
    if ((counts.get(`${row.date}|${row.amount.toFixed(2)}`) || 0) > 1) {
      row.warnings.push('Same date and amount appear more than once in this CSV');
    }
  });
  return { rows, skipped, otherCategories };
}

export function validateSelection(selection: RocketMoneySelection) {
  const row = selection?.row;
  if (!row || !/^rocket_[a-f0-9]{64}_[1-9]\d*$/.test(row.key) ||
      typeof row.title !== 'string' || !row.title.trim() || row.title.length > 1000 ||
      typeof row.date !== 'string' || !validDate(row.date) ||
      typeof row.amount !== 'number' || !validAmount(row.amount) ||
      !EXPENSE_CATEGORIES.some(category => category === selection.category) ||
      !EXPENSE_PAYMENT_METHODS.some(method => method === row.paymentMethod) ||
      typeof row.notes !== 'string' || row.notes.length > 5000 ||
      !Array.isArray(row.matches) || row.matches.some(match => !match || typeof match.id !== 'string')) {
    throw new Error('Invalid import selection. Please review the file again.');
  }
}
