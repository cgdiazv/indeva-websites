'use client';

import { useState } from 'react';

export default function CopyLinkButton() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function copyLink() {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard access is unavailable in this browser.');
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Unable to copy blog post link.', error);
      setCopyStatus('error');
    }
  }

  return (
    <button
      onClick={copyLink}
      className="hover:text-[#F06A1A] transition-colors"
      aria-live="polite"
    >
      {copyStatus === 'copied'
        ? 'Copied!'
        : copyStatus === 'error'
          ? 'Unable to copy link'
          : 'Copy link'}
    </button>
  );
}
