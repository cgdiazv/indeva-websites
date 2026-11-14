'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth, getMultiFactorResolver, inMemoryPersistence, setPersistence,
  signInWithEmailAndPassword, signOut, TotpMultiFactorGenerator,
  PhoneMultiFactorGenerator,
  type Auth, type MultiFactorError, type MultiFactorResolver,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { createAdminSession } from '@/app/actions/auth';
import EnrollAuthenticator from '@/components/dashboard/EnrollAuthenticator';

function isMultiFactorError(error: unknown): error is MultiFactorError {
  if (!(error instanceof FirebaseError) || error.code !== 'auth/multi-factor-auth-required') return false;
  return typeof error.customData?.appName === 'string' && error.customData?.operationType === 'signIn';
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);
  const [enrollmentAuth, setEnrollmentAuth] = useState<Auth | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      };
      if (!config.apiKey || !config.authDomain || !config.projectId) throw new Error('Firebase is not configured.');
      const auth = getAuth(getApps()[0] || initializeApp(config));
      await setPersistence(auth, inMemoryPersistence);
      if (!resolver) {
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password);
          await signOut(auth);
          setPassword('');
          setError('Esta cuenta debe tener autenticación de dos factores habilitada.');
        } catch (signInError) {
          if (isMultiFactorError(signInError)) {
            const challenge = getMultiFactorResolver(auth, signInError);
            if (!challenge.hints.some(hint => hint.factorId === TotpMultiFactorGenerator.FACTOR_ID)) {
              if (!challenge.hints.some(hint => hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID)) {
                throw new Error('No supported MFA factor is enrolled.');
              }
              setEnrollmentAuth(auth);
              setEnrolling(true);
            }
            setResolver(challenge);
            setPassword('');
          } else {
            throw signInError;
          }
        }
      } else {
        const hint = resolver.hints.find(item => item.factorId === TotpMultiFactorGenerator.FACTOR_ID);
        if (!hint) throw new Error('Authenticator factor not found.');
        const credential = await resolver.resolveSignIn(TotpMultiFactorGenerator.assertionForSignIn(hint.uid, code.trim()));
        try {
          const result = await createAdminSession(await credential.user.getIdToken());
          if (!result.success) throw new Error(result.error);
        } finally {
          await signOut(auth);
        }
        router.replace('/dashboard');
        router.refresh();
      }
    } catch (signInError) {
      console.error('Admin sign-in failed:', signInError);
      setError('No se pudo iniciar sesión. Verifica tus credenciales y código, o contacta al administrador.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Acceso Privado</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Solo para administradores de Indeva</p>
        </div>
        {resolver && enrolling && enrollmentAuth ? <EnrollAuthenticator auth={enrollmentAuth} resolver={resolver} onCancel={() => { setResolver(null); setEnrollmentAuth(null); setEnrolling(false); setCode(''); setError(''); }} /> : <form className="space-y-5" onSubmit={submit}>
          {!resolver ? <>
            <label className="block text-sm font-medium text-gray-700">Correo electrónico
              <input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
            </label>
            <label className="block text-sm font-medium text-gray-700">Contraseña
              <input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
            </label>
          </> : <label className="block text-sm font-medium text-gray-700">Código de la aplicación de autenticación
            <input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={code} onChange={event => setCode(event.target.value)} className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
          </label>}
          {error && <p role="alert" className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">{error}</p>}
          <button type="submit" disabled={busy} className="w-full py-2 rounded-md text-white bg-[#FA8F27] hover:bg-[#e07d1f] disabled:opacity-70">
            {busy ? 'Autenticando...' : resolver ? 'Verificar código' : 'Continuar'}
          </button>
          {resolver && <button type="button" onClick={() => { setResolver(null); setCode(''); setError(''); }} className="w-full text-sm text-gray-600">Volver a iniciar sesión</button>}
          <div className="text-center"><Link href="/" className="text-sm text-gray-500">Volver al inicio</Link></div>
        </form>}
      </div>
    </div>
  );
}
