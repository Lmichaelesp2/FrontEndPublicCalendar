'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function UnsubscribePage() {
  const params = useSearchParams();
  const success = params.get('success') === '1';
  const email   = params.get('email') ?? '';
  const error   = params.get('error');

  return (
    <div>
      <Navigation />

      <div className="unsub-page">
        <div className="unsub-card">

          {success && (
            <>
              <div className="unsub-icon unsub-icon--success">
                <CheckCircle size={44} strokeWidth={1.5} />
              </div>
              <h1>You've been unsubscribed</h1>
              <p className="unsub-desc">
                {email
                  ? <><strong>{email}</strong> has been removed from all Local Business Calendars newsletters.</>
                  : <>You've been removed from all Local Business Calendars newsletters.</>
                }
              </p>
              <p className="unsub-desc unsub-desc--small">
                You won't receive any more emails from us. If you unsubscribed by mistake, you can always re-subscribe from any calendar page.
              </p>
              <div className="unsub-actions">
                <Link href="/" className="unsub-btn-primary">
                  Browse calendars <ArrowRight size={15} />
                </Link>
              </div>
            </>
          )}

          {!success && error && (
            <>
              <div className="unsub-icon unsub-icon--error">
                <AlertTriangle size={44} strokeWidth={1.5} />
              </div>
              <h1>Something went wrong</h1>
              <p className="unsub-desc">
                {error === 'missing' && 'No unsubscribe token was found in the link.'}
                {error === 'invalid' && 'The unsubscribe link appears to be invalid or expired.'}
                {error === 'server'  && 'We had trouble processing your request. Please try again.'}
              </p>
              <p className="unsub-desc unsub-desc--small">
                If you keep having trouble, reply to any newsletter email and we'll remove you manually.
              </p>
              <div className="unsub-actions">
                <Link href="/" className="unsub-btn-secondary">
                  Go to homepage
                </Link>
              </div>
            </>
          )}

          {!success && !error && (
            <>
              <h1>Unsubscribe</h1>
              <p className="unsub-desc">
                Use the unsubscribe link in any newsletter email to be removed from our list.
              </p>
              <div className="unsub-actions">
                <Link href="/" className="unsub-btn-secondary">
                  Go to homepage
                </Link>
              </div>
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
