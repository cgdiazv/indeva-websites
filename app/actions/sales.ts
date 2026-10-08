'use server';

import { db } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { getNextOrderNumber } from '@/lib/orderCounter';

export interface ManualSaleInput {
  customerName: string;
  customerEmail?: string;
  customerType?: string;
  amount: number;
  paymentMethod: string; // 'Zelle' | 'Bank Transfer' | 'Cash' | 'Check' | 'Other'
  paymentDate: string; // YYYY-MM-DD
  products: string;
  itemsSold?: number;
  reference?: string;
  hostingId?: string;
  autoRenewHosting?: boolean;
}

/**
 * Creates a manual payment record (e.g. Zelle, Wire, Cash) in the Firestore sales collection.
 * Automatically increments the order counter, associates hosting account if selected,
 * and refreshes the dashboard view.
 */
export async function createManualSale(input: ManualSaleInput) {
  try {
    const customerName = input.customerName?.trim();
    if (!customerName) {
      return { success: false, error: 'Customer name is required.' };
    }

    const netSales = Number(input.amount);
    if (isNaN(netSales) || netSales <= 0) {
      return { success: false, error: 'Please enter a valid amount greater than $0.00.' };
    }

    const orderNumber = await getNextOrderNumber();
    const paymentMethod = input.paymentMethod?.trim() || 'Zelle';
    const products = input.products?.trim() || 'Website Service / Project';
    const itemsSold = Math.max(1, Number(input.itemsSold) || 1);
    const reference = input.reference?.trim() || `${paymentMethod} Manual Payment`;

    // Construct a valid ISO date string
    let dateStr = new Date().toISOString();
    if (input.paymentDate) {
      // Parse YYYY-MM-DD and set mid-day to avoid UTC day rollover
      const parts = input.paymentDate.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString();
        }
      }
    }

    const salePayload: Record<string, any> = {
      date: dateStr,
      order_number: orderNumber,
      status: 'Completed',
      customer: customerName,
      customer_type: input.customerType || 'Registered',
      products,
      items_sold: itemsSold,
      coupons: '-',
      net_sales: netSales,
      attribution: paymentMethod,
      stripe_reference: reference,
      manual_entry: true,
      notes: input.reference?.trim() || '',
    };

    if (input.customerEmail?.trim()) {
      salePayload.customer_email = input.customerEmail.trim();
    }

    if (input.hostingId?.trim()) {
      salePayload.hosting_id = input.hostingId.trim();
    }

    const docRef = await db.collection('sales').add(salePayload);

    // If linked to a hosting account and auto-renewal is toggled, advance renewal date
    if (input.hostingId && input.autoRenewHosting) {
      try {
        const hostingRef = db.collection('hosting_accounts').doc(input.hostingId);
        const hostingDoc = await hostingRef.get();
        if (hostingDoc.exists) {
          const hostingData = hostingDoc.data();
          const currentRenewal = new Date(hostingData?.renewalDate || new Date());
          let nextRenewal = new Date(currentRenewal);
          nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);

          const today = new Date();
          if (nextRenewal < today) {
            nextRenewal = new Date(today);
            nextRenewal.setFullYear(today.getFullYear() + 1);
          }

          const nextRenewalStr = nextRenewal.toISOString().split('T')[0];

          await hostingRef.update({
            renewalDate: nextRenewalStr,
            status: 'active',
            lastPaidOrderNumber: orderNumber,
            updatedAt: new Date().toISOString(),
          });
          console.log(`Hosting account #${input.hostingId} auto-renewed for +1 year via manual ${paymentMethod} payment.`);
        }
      } catch (hostingErr) {
        console.error('Error auto-advancing hosting renewal for manual sale:', hostingErr);
      }
    }

    revalidatePath('/dashboard');
    return { success: true, orderNumber, id: docRef.id };
  } catch (error: any) {
    console.error('Error creating manual sale:', error);
    return { success: false, error: error.message || 'Failed to post manual sale.' };
  }
}

/**
 * Deletes a manual sale entry from Firestore
 */
export async function deleteManualSale(saleId: string) {
  try {
    if (!saleId) return { success: false, error: 'Sale ID is required.' };
    const saleRef = db.collection('sales').doc(saleId);
    const doc = await saleRef.get();
    if (!doc.exists) {
      return { success: false, error: 'Sale record not found.' };
    }

    await saleRef.delete();
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting manual sale:', error);
    return { success: false, error: error.message || 'Failed to delete manual sale.' };
  }
}
