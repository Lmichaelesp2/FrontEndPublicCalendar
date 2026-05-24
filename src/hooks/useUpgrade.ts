'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useUpgrade() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function startCheckout(returnUrl?: string) {
    if (!user) {
      // Not logged in — send to sign-up first
      window.location.href = '/upgrade';
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          returnUrl: returnUrl ?? '/',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setLoading(false);
    }
  }

  return { startCheckout, loading };
}
