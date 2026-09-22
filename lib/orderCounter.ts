import { db } from '@/lib/firebaseAdmin';

/**
 * Retrieves the next sequential order number using an atomic transaction.
 * If the counter does not exist yet in Firestore, it initializes starting at 4642.
 * Subsequent calls increment sequentially (4643, 4644, ...).
 */
export async function getNextOrderNumber(): Promise<number> {
  const counterRef = db.collection('counters').doc('orders');

  return await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let nextOrderNumber = 4642;

    if (counterDoc.exists) {
      const data = counterDoc.data();
      if (typeof data?.lastOrderNumber === 'number') {
        nextOrderNumber = data.lastOrderNumber + 1;
      }
    }

    transaction.set(
      counterRef,
      {
        lastOrderNumber: nextOrderNumber,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return nextOrderNumber;
  });
}
