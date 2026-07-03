'use client';

import { useEffect } from 'react';

export default function SecureChatInitializer() {
  useEffect(() => {
    async function initializeSecureChat() {
      try {
        const res = await fetch('/api/chatbase-token');
        const data = await res.json();

        if (data.token) {
          (window as any).chatbaseConfig = {
            token: data.token
          };
        }
      } catch (err) {
        console.error('Could not load secure chat session:', err);
      }
    }

    initializeSecureChat();
  }, []);

  return null; // No renderiza nada visual, solo ejecuta la lógica en el navegador
}