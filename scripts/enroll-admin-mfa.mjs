import { createInterface, emitKeypressEvents } from 'node:readline';
import nextEnv from '@next/env';
import { initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, multiFactor, setPersistence, signInWithEmailAndPassword, signOut, TotpMultiFactorGenerator } from 'firebase/auth';

nextEnv.loadEnvConfig(process.cwd());
const { NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, ADMIN_FIREBASE_UID } = process.env;
if (!NEXT_PUBLIC_FIREBASE_API_KEY || !NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || !NEXT_PUBLIC_FIREBASE_PROJECT_ID || !ADMIN_FIREBASE_UID) {
  throw new Error('Configure Firebase client settings and ADMIN_FIREBASE_UID before enrollment.');
}
if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Run this enrollment script in an interactive terminal.');

function question(label) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => prompt.question(label, answer => { prompt.close(); resolve(answer.trim()); }));
}

function passwordPrompt() {
  return new Promise((resolve, reject) => {
    let value = '';
    process.stdout.write('Firebase password (not displayed): ');
    emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    const handler = (character, key) => {
      if (key?.ctrl && key.name === 'c') {
        finish();
        reject(new Error('Enrollment cancelled.'));
      } else if (key?.name === 'return') {
        finish();
        resolve(value);
      } else if (key?.name === 'backspace') {
        value = value.slice(0, -1);
      } else if (character && !key?.ctrl && !key?.meta) {
        value += character;
      }
    };
    function finish() {
      process.stdin.removeListener('keypress', handler);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
    }
    process.stdin.on('keypress', handler);
  });
}

const auth = getAuth(initializeApp({ apiKey: NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID }));
await setPersistence(auth, inMemoryPersistence);
try {
  const email = await question('Firebase administrator email: ');
  const password = await passwordPrompt();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (credential.user.uid !== ADMIN_FIREBASE_UID || !credential.user.emailVerified) {
    throw new Error('The account must have a verified email and match ADMIN_FIREBASE_UID.');
  }
  const mfa = multiFactor(credential.user);
  if (mfa.enrolledFactors.length) throw new Error('This account already has an MFA factor. Use a recovery process instead.');
  const secret = await TotpMultiFactorGenerator.generateSecret(await mfa.getSession());
  console.log('\nEnter this secret in your authenticator app. Keep it private and do not send it to anyone:');
  console.log(secret.secretKey);
  const code = await question('\nAuthenticator code: ');
  if (!/^\d{6}$/.test(code)) throw new Error('A six-digit authenticator code is required.');
  await mfa.enroll(TotpMultiFactorGenerator.assertionForEnrollment(secret, code), 'Authenticator');
  console.log('Authenticator enrolled. Sign in again through the dashboard using your email, password and code.');
} finally {
  await signOut(auth);
}
