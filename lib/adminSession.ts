import 'server-only';

import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { db } from '@/lib/firebaseAdmin';

export const ADMIN_SESSION_COOKIE = '__session';
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export function assertAdminClaims(token: DecodedIdToken) {
  const uid = process.env.ADMIN_FIREBASE_UID;
  if (!uid) throw new Error('ADMIN_FIREBASE_UID is not configured.');
  if (token.uid !== uid || token.email_verified !== true ||
      token.firebase.sign_in_second_factor !== 'totp') {
    throw new Error('Administrator access with authenticator MFA is required.');
  }
}

export async function requireAdminSession(): Promise<DecodedIdToken> {
  const cookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) throw new Error('Administrator authentication required.');
  const decoded = await getAuth().verifySessionCookie(cookie, true);
  assertAdminClaims(decoded);
  return decoded;
}

export async function checkSessionExchangeLimit(): Promise<void> {
  const ref = db.collection('_admin_security').doc('session_exchange_limit');
  await db.runTransaction(async transaction => {
    const now = Date.now();
    const snapshot = await transaction.get(ref);
    const data = snapshot.data();
    const start = typeof data?.start === 'number' ? data.start : now;
    const count = typeof data?.count === 'number' ? data.count : 0;
    if (now - start < 60_000 && count >= 30) {
      throw new Error('Too many sign-in requests. Please try again later.');
    }
    transaction.set(ref, now - start >= 60_000 || now < start
      ? { start: now, count: 1 }
      : { start, count: count + 1 });
  });
}
