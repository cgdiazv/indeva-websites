'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebaseAdmin';
import type { ExpenseRecord } from '@/lib/expenseUtils';
import { requireAdminSession } from '@/lib/adminSession';
import {
  expenseMatches, MAX_IMPORT_ROWS, parseRocketMoneyCsv, validateSelection,
  type RocketMoneyPreview, type RocketMoneySelection,
} from '@/lib/rocketMoneyImport';

function records(snapshot: FirebaseFirestore.QuerySnapshot): ExpenseRecord[] {
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as ExpenseRecord);
}

export async function previewRocketMoneyImport(csv: string): Promise<
  { success: true; preview: RocketMoneyPreview } | { success: false; error: string }
> {
  try {
    await requireAdminSession();
    if (typeof csv !== 'string') throw new Error('Choose a valid CSV file.');
    const expenses = records(await db.collection('expenses').get());
    return { success: true, preview: parseRocketMoneyCsv(csv, expenses) };
  } catch (error) {
    console.error('Rocket Money preview failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Could not preview the import.' };
  }
}

export async function importRocketMoneyExpenses(selections: RocketMoneySelection[]): Promise<
  { success: true; count: number } | { success: false; error: string }
> {
  try {
    await requireAdminSession();
    if (!Array.isArray(selections) || selections.length === 0 || selections.length > MAX_IMPORT_ROWS) {
      throw new Error(`Select between 1 and ${MAX_IMPORT_ROWS} transactions.`);
    }
    selections.forEach(validateSelection);
    if (new Set(selections.map(selection => selection.row.key)).size !== selections.length) {
      throw new Error('The same transaction was selected more than once.');
    }

    await db.runTransaction(async transaction => {
      const collection = db.collection('expenses');
      const existing = records(await transaction.get(collection));
      const existingIds = new Set(existing.map(expense => expense.id));
      for (const { row } of selections) {
        if (existingIds.has(row.key)) throw new Error('A selected transaction was already imported. Review the file again.');
        const reviewedIds = new Set(row.matches.map(match => match.id));
        if (expenseMatches(row, existing).some(match => !reviewedIds.has(match.id))) {
          throw new Error('Expenses changed since the preview. Review the file again before importing.');
        }
      }
      const now = new Date().toISOString();
      for (const { row, category } of selections) {
        transaction.create(collection.doc(row.key), {
          title: row.title.trim(),
          category,
          amount: row.amount,
          date: `${row.date}T12:00:00.000Z`,
          vendor: '',
          paymentMethod: row.paymentMethod,
          reference: '',
          notes: row.notes,
          source: 'rocket-money-csv',
          createdAt: now,
          updatedAt: now,
        });
      }
    });
    revalidatePath('/dashboard');
    return { success: true, count: selections.length };
  } catch (error) {
    console.error('Rocket Money import failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Could not import expenses.' };
  }
}
