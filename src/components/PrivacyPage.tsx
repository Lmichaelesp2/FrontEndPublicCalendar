'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { Database, Mail, Shield, UserX, Eye, ArrowRight } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="about-page">
      <SEOHead
        title="Privacy Policy — Local Business Calendars"
        description="Learn how Local Business Calendars collects, uses, and protects your personal information. We do not sell or share your data with third parties."
      />
      <Navigation />

      <div className="about-hero">
        <div className="about-hero-inner">
          <h1>Privacy Policy</h1>
          <p>
            How we collect, use, and protect your information — in plain language.
          </p>
        </div>
      </div>

      <div className="about-body">
        <section className="about-section about-section-1">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Eye size={28} className="about-section-icon" />
              <h2>What Data We Collect</h2>
            </div>
            <p>
              We collect only the information necessary to provide our service. Specifically, we collect your <strong>email address</strong> when you subscribe to a city calendar newsletter. We also collect basic <strong>usage data</strong> — such as pages visited and general browsing behavior — through standard analytics tools. We do not collect payment information, government IDs, or any sensitive personal data.
            </p>
          </div>
        </section>

        <section className="about-section about-section-2">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Mail size={28} className="about-section-icon" />
              <h2>How We Use Your Information</h2>
            </div>
            <p>
              Your email address is used solely to deliver the <strong>weekly Monday business events newsletter</strong> for the city or cities you subscribed to. Basic usage data helps us understand which pages and features are most useful so we can improve the site. We do not use your data for advertising, profiling, or any purpose beyond operating and improving the service you signed up for.
            </p>
          </div>
        </section>

        <section className="about-section about-section-3">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Database size={28} className="about-section-icon" />
              <h2>Third-Party Services</h2>
            </div>
            <p>
              We use a small number of trusted third-party services to operate Local Business Calendars:
            </p>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li><strong>Supabase</strong> — our database provider. Your email address and account data are stored securely in Supabase's infrastructure. Supabase processes data in accordance with its own privacy policy and industry-standard security practices.</li>
              <li><strong>Email delivery provider</strong> — we use a third-party email platform solely to send the weekly newsletter. Your email address is shared with this provider only for the purpose of delivering emails you requested.</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              We do not use advertising networks, social media trackers, or data brokers.
            </p>
          </div>
        </section>

        <section className="about-section about-section-4">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <UserX size={28} className="about-section-icon" />
              <h2>How to Unsubscribe</h2>
            </div>
            <p>
              You can unsubscribe from the newsletter at any time by clicking the <strong>unsubscribe link</strong> included at the bottom of every email we send. Your address will be removed from the mailing list immediately. If you have any trouble unsubscribing, you can also contact us directly at <a href="mailto:events@localbusinesscalendars.com" className="contact-link">events@localbusinesscalendars.com</a> and we will remove you manually within one business day.
            </p>
          </div>
        </section>

        <section className="about-section about-section-5">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Shield size={28} className="about-section-icon" />
              <h2>We Do Not Sell Your Data</h2>
            </div>
            <p>
              We do not sell, rent, trade, or otherwise share your personal information with any third parties for their own marketing or commercial purposes — period. The only time your data is shared with an outside party is when it is strictly necessary to deliver the service you requested (for example, passing your email to our newsletter provider so they can send you the weekly digest). We have no advertising partnerships, data monetization arrangements, or data sharing agreements of any kind.
            </p>
          </div>
        </section>

        <section className="about-cta-section">
          <div className="about-cta-inner">
            <h2>Privacy Questions?</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--fg-3)' }}>
              If you have any questions about this policy or how your data is handled, contact us at{' '}
              <a href="mailto:events@localbusinesscalendars.com" className="contact-link">
                events@localbusinesscalendars.com
              </a>
              .
            </p>
            <div className="about-cta-buttons">
              <Link href="/contact" className="about-cta-btn about-cta-btn-secondary">
                Contact Us
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
