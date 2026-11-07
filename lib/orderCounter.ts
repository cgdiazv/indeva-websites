import { db } from '@/lib/firebaseAdmin';

export function nextOrderNumber(lastOrderNumber: unknown): number {
  return typeof lastOrderNumber === 'number' ? lastOrderNumber + 1 : 4642;
}

/**
 * Retrieves the next sequential order number using an atomic transaction.
 * If the counter does not exist yet in Firestore, it initializes starting at 4642.
 * Subsequent calls increment sequentially (4643, 4644, ...).
 */
export async function getNextOrderNumber(): Promise<number> {
  const counterRef = db.collection('counters').doc('orders');

  return await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    const orderNumber = nextOrderNumber(counterDoc.data()?.lastOrderNumber);

    transaction.set(
      counterRef,
      {
        lastOrderNumber: orderNumber,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return orderNumber;
  });
}
