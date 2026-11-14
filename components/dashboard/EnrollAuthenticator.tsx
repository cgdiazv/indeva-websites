'use client';

import { useEffect, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { QRCodeSVG } from 'qrcode.react';
import {
  multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator,
  RecaptchaVerifier, TotpMultiFactorGenerator,
  type Auth, type MultiFactorResolver, type TotpSecret,
} from 'firebase/auth';
import { authorizeTotpEnrollment } from '@/app/actions/auth';

export default function EnrollAuthenticator({ auth, resolver, onCancel }: {
  auth: Auth;
  resolver: MultiFactorResolver;
  onCancel: () => void;
}) {
  const [verificationId, setVerificationId] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [secret, setSecret] = useState<TotpSecret | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const captchaContainer = useRef<HTMLDivElement>(null);
  const captcha = useRef<RecaptchaVerifier | null>(null);
  const phoneHint = resolver.hints.find(hint => hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID);

  useEffect(() => {
    if (verificationId || !captchaContainer.current) return;
    let active = true;
    const container = captchaContainer.current;
    let verifier: RecaptchaVerifier | null = null;
    Promise.resolve().then(async () => {
      if (!active) return;
      verifier = new RecaptchaVerifier(auth, container, {
        callback: () => { if (active) setCaptchaSolved(true); },
        'expired-callback': () => { if (active) setCaptchaSolved(false); },
      });
      captcha.current = verifier;
      await verifier.render();
      if (active) setCaptchaReady(true);
    }).catch(renderError => {
      if (!active) return;
      console.error('Unable to render reCAPTCHA:', renderError);
      setError('No se pudo cargar reCAPTCHA. Comprueba que tu navegador permita los servicios de Google y vuelve a intentar.');
    });
    return () => {
      active = false;
      if (verifier && captcha.current === verifier) {
        verifier.clear();
        captcha.current = null;
      }
    };
  }, [auth, captchaAttempt, verificationId]);

  const sendCode = async () => {
    setBusy(true);
    setError('');
    try {
      if (!phoneHint || !captcha.current || !captchaSolved) throw new Error('Complete reCAPTCHA first.');
      setVerificationId(await new PhoneAuthProvider(auth).verifyPhoneNumber({
        multiFactorHint: phoneHint,
        session: resolver.session,
      }, captcha.current));
    } catch (sendError) {
      console.error('Phone verification request failed:', sendError);
      setCaptchaReady(false);
      setCaptchaSolved(false);
      setCaptchaAttempt(attempt => attempt + 1);
      setError(sendError instanceof FirebaseError && sendError.code === 'auth/invalid-app-credential'
        ? 'Firebase rechazó la verificación de reCAPTCHA. Completa el nuevo desafío e inténtalo otra vez.'
        : 'No se pudo enviar el código. Completa el nuevo desafío e inténtalo de nuevo. Revisa la consola para el error de Firebase.');
    } finally {
      setBusy(false);
    }
  };

  const verifyPhone = async () => {
    setBusy(true);
    setError('');
    try {
      const credential = PhoneAuthProvider.credential(verificationId, phoneCode.trim());
      const userCredential = await resolver.resolveSignIn(PhoneMultiFactorGenerator.assertion(credential));
      const authorization = await authorizeTotpEnrollment(await userCredential.user.getIdToken());
      if (!authorization.success) {
        await auth.signOut();
        throw new Error(authorization.error);
      }
      const account = multiFactor(userCredential.user);
      if (account.enrolledFactors.some(factor => factor.factorId === TotpMultiFactorGenerator.FACTOR_ID)) {
        await auth.signOut();
        throw new Error('An authenticator is already enrolled.');
      }
      setSecret(await TotpMultiFactorGenerator.generateSecret(await account.getSession()));
    } catch (verifyError) {
      console.error('Phone verification or authenticator setup failed:', verifyError);
      setError('No se pudo preparar la autenticación. Comprueba el código SMS y que TOTP esté habilitado en Firebase. Si el código ya se usó, vuelve a iniciar sesión.');
    } finally {
      setBusy(false);
    }
  };

  const enroll = async () => {
    setBusy(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user || !secret || !/^\d{6}$/.test(totpCode.trim())) throw new Error('A valid authenticator code is required.');
      await multiFactor(user).enroll(TotpMultiFactorGenerator.assertionForEnrollment(secret, totpCode.trim()), 'Authenticator');
      setSecret(null);
      setDone(true);
      await auth.signOut();
    } catch (enrollError) {
      console.error('Authenticator enrollment failed:', enrollError);
      setError('No se pudo completar el registro. Comprueba el código e inténtalo de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    try {
      await auth.signOut();
      onCancel();
    } catch (signOutError) {
      console.error('Unable to clear enrollment sign-in:', signOutError);
      setError('No se pudo cerrar la sesión de registro. Recarga la página e inténtalo de nuevo.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900">Configurar aplicación de autenticación</h3>
      {done ? <p className="text-sm text-emerald-700">Autenticador registrado. Vuelve a iniciar sesión con tu correo, contraseña y el código de la aplicación.</p> : secret ? <>
        <p className="text-sm text-gray-700">Escanea este código QR con tu aplicación de autenticación. No compartas el código QR ni la clave.</p>
        <QRCodeSVG value={secret.generateQrCodeUrl(undefined, 'Indeva')} size={216} marginSize={4} title="Código QR de configuración del autenticador" />
        <p className="text-sm text-gray-700">Si no puedes escanearlo, agrega esta clave manualmente:</p>
        <div className="font-mono break-all bg-gray-100 p-3 rounded" aria-label="Clave del autenticador">{secret.secretKey}</div>
        <label className="block text-sm text-gray-700">Código del autenticador
          <input value={totpCode} onChange={event => setTotpCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
        </label>
        <button type="button" disabled={busy} onClick={enroll} className="w-full py-2 rounded-md text-white bg-[#FA8F27] disabled:opacity-70">Registrar autenticador</button>
      </> : verificationId ? <>
        <p className="text-sm text-gray-700">Introduce el código enviado a tu teléfono registrado.</p>
        <label className="block text-sm text-gray-700">Código SMS
          <input value={phoneCode} onChange={event => setPhoneCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" />
        </label>
        <button type="button" disabled={busy || !phoneCode.trim()} onClick={verifyPhone} className="w-full py-2 rounded-md text-white bg-[#FA8F27] disabled:opacity-70">Verificar teléfono</button>
      </> : <>
        <p className="text-sm text-gray-700">Primero verifica el teléfono que ya está registrado en Firebase.</p>
        <p className="text-sm text-gray-700">Completa la verificación antes de solicitar el código SMS.</p>
        <div ref={captchaContainer} />
        <button type="button" disabled={busy || !captchaReady || !captchaSolved} onClick={sendCode} className="w-full py-2 rounded-md text-white bg-[#FA8F27] disabled:opacity-70">Enviar código SMS</button>
        {error && !captchaReady && <button type="button" disabled={busy} onClick={() => setCaptchaAttempt(attempt => attempt + 1)} className="w-full text-sm text-gray-600">Reintentar reCAPTCHA</button>}
      </>}
      {error && <p role="alert" className="text-red-600 text-sm bg-red-50 p-2 rounded-md">{error}</p>}
      <button type="button" disabled={busy} onClick={cancel} className="w-full text-sm text-gray-600">{done ? 'Volver a iniciar sesión' : 'Cancelar y volver'}</button>
    </div>
  );
}
