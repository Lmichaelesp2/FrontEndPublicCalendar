'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SEOHead } from './SEOHead';
import { FileText, AlertCircle, Globe, Ban, RefreshCw, ArrowRight } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="about-page">
      <SEOHead
        title="Terms & Conditions — Local Business Calendars"
        description="Review the terms and conditions for using Local Business Calendars. Learn about acceptable use, disclaimer of warranties, and your rights as a user."
      />
      <Navigation />

      <div className="about-hero">
        <div className="about-hero-inner">
          <h1>Terms &amp; Conditions</h1>
          <p>
            Please read these terms carefully before using Local Business Calendars.
          </p>
        </div>
      </div>

      <div className="about-body">
        <section className="about-section about-section-1">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <FileText size={28} className="about-section-icon" />
              <h2>Use of the Service</h2>
            </div>
            <p>
              Local Business Calendars provides a free directory of business events across Texas cities. By accessing or using this website, you agree to these terms. You may use the site for personal or professional purposes to discover and attend local business events. You may not use the site to scrape data at scale, submit false or misleading event information, impersonate another person or organization, or engage in any activity that disrupts or harms the service.
            </p>
          </div>
        </section>

        <section className="about-section about-section-2">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <AlertCircle size={28} className="about-section-icon" />
              <h2>Disclaimer of Warranties</h2>
            </div>
            <p>
              Event information on this site is aggregated from public sources and submitted by third parties. We make no guarantees regarding the accuracy, completeness, or timeliness of event listings. <strong>Always verify event details directly with the organizer before attending.</strong> Local Business Calendars is not affiliated with meetup.com, Eventbrite, Facebook, LinkedIn, or any organizations whose events are listed. We are an independent platform providing event information only.
            </p>
            <p style={{ marginTop: '1rem' }}>
              The service is provided "as is" without warranties of any kind, express or implied. We do not warrant that the site will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </div>
        </section>

        <section className="about-section about-section-3">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Globe size={28} className="about-section-icon" />
              <h2>Event Submissions</h2>
            </div>
            <p>
              By submitting an event to Local Business Calendars, you represent that you have the right to share the event information and that it is accurate to the best of your knowledge. Submitted events are reviewed before publication. We reserve the right to reject, edit, or remove any event listing at our sole discretion. Submitting an event does not guarantee publication.
            </p>
            <p style={{ marginTop: '1rem' }}>
              We do not charge fees for standard event listings. Sponsored placements, if offered, are clearly identified.
            </p>
          </div>
        </section>

        <section className="about-section about-section-4">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <Ban size={28} className="about-section-icon" />
              <h2>Limitation of Liability</h2>
            </div>
            <p>
              To the fullest extent permitted by law, Local Business Calendars and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the site or reliance on any event information listed. This includes but is not limited to missed events, travel expenses, or any loss arising from inaccurate event details.
            </p>
            <p style={{ marginTop: '1rem' }}>
              In no event shall our total liability to you exceed the amount you paid us in the twelve months prior to the claim, which in most cases will be zero as the service is free.
            </p>
          </div>
        </section>

        <section className="about-section about-section-5">
          <div className="about-section-inner">
            <div className="about-section-heading">
              <RefreshCw size={28} className="about-section-icon" />
              <h2>Changes to These Terms</h2>
            </div>
            <p>
              We may update these Terms &amp; Conditions from time to time. When we do, we will update the date at the bottom of this page. Continued use of the site after changes are posted constitutes your acceptance of the revised terms. If you have questions about any change, contact us before continuing to use the service.
            </p>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary, #6b7280)', fontSize: '0.9rem' }}>
              Last updated: April 2026
            </p>
          </div>
        </section>

        <section className="about-cta-section">
          <div className="about-cta-inner">
            <h2>Questions About These Terms?</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-secondary, #6b7280)' }}>
              If you have any questions, reach us at{' '}
              <a href="mailto:events@localbusinesscalendars.com" className="contact-link">
                events@localbusinesscalendars.com
              </a>
              .
            </p>
            <div className="about-cta-buttons">
              <Link href="/privacy" className="about-cta-btn about-cta-btn-secondary">
                Privacy Policy
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
