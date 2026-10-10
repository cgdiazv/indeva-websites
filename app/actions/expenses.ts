'use server';

import { db } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import type { ExpenseRecord } from '@/lib/expenseUtils';

export interface CreateExpenseInput {
  title: string;
  category: string;
  amount: number;
  date: string;
  vendor?: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

/**
 * Fetch all expenses from Firestore ordered by date descending
 */
export async function getExpenses(): Promise<ExpenseRecord[]> {
  try {
    const snapshot = await db.collection('expenses').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ExpenseRecord[];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

/**
 * Create a new expense record in Firestore
 */
export async function createExpense(input: CreateExpenseInput) {
  try {
    const title = input.title?.trim();
    if (!title) {
      return { success: false, error: 'Expense description / title is required.' };
    }

    const amount = Number(input.amount);
    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: 'Please enter a valid amount greater than $0.00.' };
    }

    // Standardize date
    let dateStr = input.date?.trim() || new Date().toISOString().split('T')[0];
    if (dateStr.length === 10) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString();
        }
      }
    }

    const payload = {
      title,
      category: input.category?.trim() || 'Other',
      amount,
      date: dateStr,
      vendor: input.vendor?.trim() || '',
      paymentMethod: input.paymentMethod?.trim() || 'Credit Card',
      reference: input.reference?.trim() || '',
      notes: input.notes?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('expenses').add(payload);

    revalidatePath('/dashboard');
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return { success: false, error: error?.message || 'Failed to record expense.' };
  }
}

/**
 * Update an existing expense in Firestore
 */
export async function updateExpense(id: string, input: Partial<CreateExpenseInput>) {
  try {
    if (!id) {
      return { success: false, error: 'Expense ID is required.' };
    }

    const payload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (input.title !== undefined) {
      const title = input.title.trim();
      if (!title) return { success: false, error: 'Title cannot be empty.' };
      payload.title = title;
    }

    if (input.amount !== undefined) {
      const amount = Number(input.amount);
      if (isNaN(amount) || amount <= 0) return { success: false, error: 'Invalid amount.' };
      payload.amount = amount;
    }

    if (input.category !== undefined) payload.category = input.category.trim();
    if (input.vendor !== undefined) payload.vendor = input.vendor.trim();
    if (input.paymentMethod !== undefined) payload.paymentMethod = input.paymentMethod.trim();
    if (input.reference !== undefined) payload.reference = input.reference.trim();
    if (input.notes !== undefined) payload.notes = input.notes.trim();

    if (input.date) {
      let dateStr = input.date.trim();
      if (dateStr.length === 10) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
          if (!isNaN(d.getTime())) {
            dateStr = d.toISOString();
          }
        }
      }
      payload.date = dateStr;
    }

    await db.collection('expenses').doc(id).update(payload);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating expense:', error);
    return { success: false, error: error?.message || 'Failed to update expense.' };
  }
}

/**
 * Delete an expense from Firestore
 */
export async function deleteExpense(id: string) {
  try {
    if (!id) {
      return { success: false, error: 'Expense ID is required.' };
    }

    await db.collection('expenses').doc(id).delete();

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return { success: false, error: error?.message || 'Failed to delete expense.' };
  }
}
