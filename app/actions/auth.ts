'use server';

import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, SESSION_DURATION_MS, assertAdminClaims, checkSessionExchangeLimit } from '@/lib/adminSession';

export async function authorizeTotpEnrollment(idToken: string) {
  try {
    if (typeof idToken !== 'string' || idToken.length > 10_000) throw new Error('Invalid sign-in token.');
    const uid = process.env.ADMIN_FIREBASE_UID;
    if (!uid) throw new Error('ADMIN_FIREBASE_UID is not configured.');
    const token = await getAuth().verifyIdToken(idToken, true);
    const age = Date.now() / 1000 - token.auth_time;
    if (token.uid !== uid || token.email_verified !== true ||
        token.firebase.sign_in_second_factor !== 'phone' ||
        !Number.isFinite(age) || age < 0 || age > 5 * 60) {
      throw new Error('Recent phone-verified administrator sign-in required.');
    }
    return { success: true };
  } catch (error) {
    console.error('Authenticator enrollment authorization failed:', error);
    return { success: false, error: 'Unable to authorize authenticator enrollment.' };
  }
}

export async function createAdminSession(idToken: string) {
  try {
    if (typeof idToken !== 'string' || idToken.length > 10_000) throw new Error('Invalid sign-in token.');
    const auth = getAuth();
    const decoded = await auth.verifyIdToken(idToken, true);
    assertAdminClaims(decoded);
    const age = Date.now() / 1000 - decoded.auth_time;
    if (!Number.isFinite(age) || age < 0 || age > 5 * 60) throw new Error('Please sign in again.');
    await checkSessionExchangeLimit();
    const session = await auth.createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
    (await cookies()).set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_MS / 1000,
      path: '/',
    });
    return { success: true };
  } catch (error) {
    console.error('Admin session creation failed:', error);
    return { success: false, error: 'Unable to sign in. Check your credentials, MFA, and server configuration.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookie) {
    try {
      const decoded = await getAuth().verifySessionCookie(cookie, true);
      assertAdminClaims(decoded);
      await getAuth().revokeRefreshTokens(decoded.uid);
    } catch (error) {
      console.error('Unable to revoke admin sessions:', error);
      throw new Error('Unable to securely sign out. Please try again.');
    }
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect('/acceder');
}
