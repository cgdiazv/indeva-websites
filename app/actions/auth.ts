'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  
  // Use environment variable for the admin password, or a strong default fallback if not set.
  const adminPassword = process.env.ADMIN_PASSWORD || 'indevasa-admin-2026';
  
  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return { success: true, error: '' };
  }
  
  return { success: false, error: 'Contraseña incorrecta' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/acceder');
}
