import type { Firestore } from 'firebase-admin/firestore';
import { nextOrderNumber } from '@/lib/orderCounter';

export async function recordStripeSale(
  db: Firestore,
  references: string[],
  sale: Record<string, unknown>,
  hostingId?: string
): Promise<{ orderNumber: number; created: boolean }> {
  const uniqueReferences = [...new Set(references.filter(Boolean))];
  if (uniqueReferences.length === 0) throw new Error('Stripe sale has no payment reference');

  const sales = db.collection('sales');
  const locks = uniqueReferences.map(reference => db.collection('stripe_sale_references').doc(reference));
  const counter = db.collection('counters').doc('orders');
  const hosting = hostingId ? db.collection('hosting_accounts').doc(hostingId) : undefined;
  const saleRef = sales.doc();

  return db.runTransaction(async transaction => {
    const lockDocs = await Promise.all(locks.map(lock => transaction.get(lock)));
    const lockedSale = lockDocs.find(doc => doc.exists);
    if (lockedSale) {
      return { orderNumber: lockedSale.get('order_number') as number, created: false };
    }

    const existing = await transaction.get(
      sales.where('stripe_reference', 'in', uniqueReferences).limit(1)
    );
    if (!existing.empty) {
      const orderNumber = existing.docs[0].get('order_number') as number;
      for (const lock of locks) transaction.set(lock, { order_number: orderNumber });
      return { orderNumber, created: false };
    }

    const counterDoc = await transaction.get(counter);
    const hostingDoc = hosting ? await transaction.get(hosting) : undefined;
    if (hosting && !hostingDoc?.exists) {
      throw new Error(`Hosting account ${hostingId} not found for Stripe payment`);
    }

    const orderNumber = nextOrderNumber(counterDoc.data()?.lastOrderNumber);
    const now = new Date();
    transaction.set(counter, { lastOrderNumber: orderNumber, updatedAt: now.toISOString() }, { merge: true });
    transaction.set(saleRef, { ...sale, order_number: orderNumber });
    for (const lock of locks) transaction.set(lock, { order_number: orderNumber });

    if (hosting && hostingDoc) {
      const currentRenewal = new Date(hostingDoc.data()?.renewalDate || now);
      if (isNaN(currentRenewal.getTime())) {
        throw new Error(`Invalid renewal date for hosting account ${hostingId}`);
      }
      let nextRenewal = new Date(currentRenewal);
      nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
      if (nextRenewal < now) {
        nextRenewal = new Date(now);
        nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
      }
      transaction.update(hosting, {
        renewalDate: nextRenewal.toISOString().split('T')[0],
        status: 'active',
        lastPaidOrderNumber: orderNumber,
        updatedAt: now.toISOString(),
      });
    }

    return { orderNumber, created: true };
  });
}
