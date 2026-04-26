'use client';

import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Mail, ChevronDown, ChevronUp, LogOut, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminLogin } from './AdminLogin';
import type { Event } from '../../lib/supabase';

// ─── Config ───────────────────────────────────────────────────────────────────

const CITIES = ['Austin', 'Dallas', 'Houston', 'San Antonio'] as const;
const SUB_CALENDARS = ['Networking', 'Technology', 'Real Estate', 'Chamber', 'Small Business'] as const;

type NewsletterKey = { city: string; subCal: string | null };

interface Newsletter {
  key: string;
  city: string;
  subCal: string | null;
  label: string;
  events: Event[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMondayThisSunday(): { monday: string; sunday: string } {
  const today = new Date();
  const day = today.getDay(); // 0=Sun,1=Mon,...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { monday: fmt(monday), sunday: fmt(sunday) };
}

function formatEventDate(dateStr: string, timeStr: string | null): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = d.toLocaleDateString('en-US', { month: 'long' });
  const time = timeStr ? ` at ${timeStr}` : '';
  return `${weekday}, ${monthName} ${day}${time}`;
}

function eventCategoryMatchesSubCal(event: Event, subCal: string): boolean {
  if (!event.event_category) return false;
  const cat = event.event_category.toLowerCase();
  const sub = subCal.toLowerCase().replace(' ', '-');
  // Map sub-cal slugs to event_category values
  const map: Record<string, string[]> = {
    'networking':     ['networking'],
    'technology':     ['technology', 'tech'],
    'real-estate':    ['real estate', 'real-estate', 'realestate'],
    'chamber':        ['chamber'],
    'small-business': ['small business', 'small-business', 'smallbusiness'],
  };
  return (map[sub] || [sub]).some(v => cat.includes(v));
}

// ─── HTML email template ───────────────────────────────────────────────────────

function shortDayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const mon = d.toLocaleDateString('en-US', { month: 'numeric' });
  return `${weekday} ${mon}/${day}`;
}

function buildHtmlEmail(label: string, weekLabel: string, events: Event[], isSubCal: boolean): string {
  const badgeText = isSubCal
    ? `${label.split('—')[1]?.trim() ?? label} Calendar`
    : 'Weekly Edition';

  const eventsHeading = isSubCal
    ? `${label.split('—')[1]?.trim() ?? label} Events This Week`
    : "This Week's Events";

  // Sponsor block — open slot state (no active sponsor yet)
  const sponsorBlock = isSubCal ? `
    <!-- E2 Sponsor block — open slot -->
    <tr>
      <td style="background:#fafafa;border-bottom:1px solid #e8e8e8;padding:18px 24px 16px;border-left:3px dashed #ccc;">
        <p style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#bbb;margin:0 0 6px 0;">Sponsorship Opportunity</p>
        <p style="font-size:13px;color:#aaa;margin:0;line-height:1.6;">
          The <strong style="color:#999;">${label}</strong> newsletter has an open sponsorship slot.
          Your brand reaches active local professionals every week —
          people who show up to events, make buying decisions, and support local businesses.
          <a href="https://localbusinesscalendars.com/sponsor" style="color:#1a3a5c;text-decoration:none;font-weight:600;">Become a founding sponsor →</a>
        </p>
        <p style="font-size:11px;color:#bbb;margin:8px 0 0;font-style:italic;">
          Sponsors also get placement on the ${label} calendar page at localbusinesscalendars.com.
        </p>
      </td>
    </tr>` : `
    <!-- E1 Sponsor block — open slot -->
    <tr>
      <td style="background:#fafafa;border-bottom:1px solid #e8e8e8;padding:16px 24px;border-left:3px dashed #ccc;">
        <p style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#bbb;margin:0 0 5px 0;">Sponsorship Opportunity</p>
        <p style="font-size:13px;color:#aaa;margin:0;line-height:1.6;">
          This calendar has an open sponsorship slot. Reach thousands of ${label.split('(')[0].trim()} professionals every week —
          decision-makers who attend local events and support local businesses.
          <a href="https://localbusinesscalendars.com/sponsor" style="color:#1a3a5c;text-decoration:none;font-weight:600;">Learn about founding sponsorship →</a>
        </p>
      </td>
    </tr>`;

  // Event rows — clean table layout matching the design: DAY DATE | Event Name / Venue · Time
  const eventRows = events.length === 0
    ? `<tr><td style="padding:16px 0;color:#aaa;font-size:13px;font-style:italic;">No events found for this week.</td></tr>`
    : events.map(e => {
        const dayLabel = shortDayLabel(e.start_date);
        const venue = e.org_name || e.address || '';
        const time = e.start_time || '';
        const meta = [venue, time].filter(Boolean).join(' · ');
        const link = e.website ? e.website : null;
        return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="60" style="vertical-align:top;padding-top:1px;">
                  <span style="font-size:11px;font-weight:700;color:#1a3a5c;letter-spacing:0.04em;text-transform:uppercase;">${dayLabel}</span>
                </td>
                <td style="vertical-align:top;">
                  ${link
                    ? `<a href="${link}" style="font-size:13px;font-weight:600;color:#1a1a1a;text-decoration:none;">${e.name}</a>`
                    : `<span style="font-size:13px;font-weight:600;color:#1a1a1a;">${e.name}</span>`
                  }
                  ${meta ? `<br><span style="font-size:11px;color:#888;">${meta}</span>` : ''}
                  ${e.paid && e.paid !== 'Free' ? `<br><span style="font-size:11px;color:#b45309;">${e.paid}</span>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
      }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e0e0e0;max-width:600px;width:100%;">

    <!-- ── HEADER ── -->
    <tr>
      <td style="padding:16px 24px;border-bottom:1px solid #e8e8e8;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#888;display:block;margin-bottom:3px;">Local Business Calendars</span>
              <span style="font-size:18px;font-weight:700;color:#1a1a1a;">${label} — This Week</span>
            </td>
            <td align="right" style="vertical-align:middle;">
              <span style="font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#1a3a5c;font-weight:700;">${badgeText}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── WEEK LABEL ── -->
    <tr>
      <td style="background:#1a3a5c;padding:7px 24px;">
        <span style="font-size:11px;color:#ffffff;letter-spacing:0.04em;">${weekLabel}</span>
      </td>
    </tr>

    ${sponsorBlock}

    <!-- ── EVENTS SECTION ── -->
    <tr>
      <td style="padding:20px 24px 4px;">
        <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#888;margin:0 0 14px 0;padding-bottom:6px;border-bottom:1px solid #e8e8e8;">${eventsHeading}</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${eventRows}
        </table>
      </td>
    </tr>

    <!-- ── INTRO NOTE ── -->
    <tr>
      <td style="padding:16px 24px 20px;">
        <p style="font-size:13px;color:#555;line-height:1.6;margin:0;">
          See something missing? <a href="https://localbusinesscalendars.com/submit" style="color:#1a3a5c;text-decoration:none;">Submit an event →</a>
        </p>
      </td>
    </tr>

    <!-- ── FOOTER ── -->
    <tr>
      <td style="padding:14px 24px;border-top:1px solid #e8e8e8;text-align:center;">
        <p style="font-size:11px;color:#aaa;margin:0;line-height:1.8;">
          You're receiving this because you subscribed to the free ${label} newsletter.<br>
          <a href="https://localbusinesscalendars.com/sponsor" style="color:#1a3a5c;text-decoration:none;">Interested in sponsoring this calendar?</a>
          &nbsp;·&nbsp;
          <a href="https://localbusinesscalendars.com" style="color:#1a3a5c;text-decoration:none;">Visit the calendar</a>
          &nbsp;·&nbsp;
          <a href="https://localbusinesscalendars.com/unsubscribe" style="color:#1a3a5c;text-decoration:none;">Unsubscribe</a>
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Plain text template ───────────────────────────────────────────────────────

function buildPlainText(label: string, weekLabel: string, events: Event[]): string {
  const lines = [
    `LOCAL BUSINESS CALENDARS`,
    `${label} — This Week`,
    `${weekLabel}`,
    ``,
    `────────────────────────────────────`,
    `SPONSORSHIP OPPORTUNITY`,
    `This newsletter has an open sponsorship slot. Reach local professionals every week.`,
    `Interested? Email louis@localbusinesscalendars.com`,
    `────────────────────────────────────`,
    ``,
    `THIS WEEK'S EVENTS`,
    ``,
  ];

  if (events.length === 0) {
    lines.push('No events found for this week.');
  } else {
    events.forEach(e => {
      const dayLabel = shortDayLabel(e.start_date);
      const venue = e.org_name || e.address || '';
      const time = e.start_time || '';
      const meta = [venue, time].filter(Boolean).join(' · ');
      lines.push(`${dayLabel}  ${e.name}`);
      if (meta) lines.push(`        ${meta}`);
      if (e.website) lines.push(`        ${e.website}`);
      lines.push('');
    });
  }

  lines.push(`────────────────────────────────────`);
  lines.push(``);
  lines.push(`See something missing? Submit an event at localbusinesscalendars.com/submit`);
  lines.push(``);
  lines.push(`You're receiving this because you subscribed to the free ${label} newsletter.`);
  lines.push(`Interested in sponsoring? Email louis@localbusinesscalendars.com`);
  lines.push(`Visit the calendar: https://localbusinesscalendars.com`);
  lines.push(`Unsubscribe: https://localbusinesscalendars.com/unsubscribe`);

  return lines.join('\n');
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handleCopy} className="nl-copy-btn">
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

// ─── GmailCopyButton ──────────────────────────────────────────────────────────

function GmailCopyButton({ html }: { html: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  async function handleCopy() {
    try {
      // Use ClipboardItem with both HTML and plain-text MIME types so Gmail
      // accepts it as rich content when you paste into the compose window.
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([html.replace(/<[^>]+>/g, '')], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob }),
      ]);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      // Fallback: focus the iframe body and let the browser copy selection
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <button onClick={handleCopy} className="nl-gmail-btn">
      {status === 'copied' ? <Check size={14} /> : <Mail size={14} />}
      {status === 'copied' ? 'Copied! Paste into Gmail' : status === 'error' ? 'Try selecting inside preview' : 'Copy for Gmail (keeps formatting)'}
    </button>
  );
}

// ─── NewsletterCard ────────────────────────────────────────────────────────────

function NewsletterCard({ newsletter, weekLabel }: { newsletter: Newsletter; weekLabel: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'html' | 'text'>('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const html = buildHtmlEmail(newsletter.label, weekLabel, newsletter.events, newsletter.subCal !== null);
  const plain = buildPlainText(newsletter.label, weekLabel, newsletter.events);

  return (
    <div className="nl-card">
      <button className="nl-card-header" onClick={() => setOpen(o => !o)}>
        <div className="nl-card-title">
          <Mail size={16} />
          <span>{newsletter.label}</span>
          <span className="nl-event-count">{newsletter.events.length} event{newsletter.events.length !== 1 ? 's' : ''}</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="nl-card-body">
          {/* Tab switcher */}
          <div className="nl-tabs">
            <button className={`nl-tab ${tab === 'html' ? 'active' : ''}`} onClick={() => setTab('html')}>
              HTML (SendGrid)
            </button>
            <button className={`nl-tab ${tab === 'text' ? 'active' : ''}`} onClick={() => setTab('text')}>
              Plain text
            </button>
          </div>

          {/* Copy buttons */}
          <div className="nl-copy-row">
            {tab === 'html' ? (
              <>
                <GmailCopyButton html={html} />
                <CopyButton text={html} label="Copy raw HTML (SendGrid)" />
              </>
            ) : (
              <CopyButton text={plain} label="Copy plain text" />
            )}
          </div>

          {/* Preview / raw */}
          {tab === 'html' ? (
            <div className="nl-preview-wrap">
              <iframe
                ref={iframeRef}
                srcDoc={html}
                title={`${newsletter.label} preview`}
                className="nl-iframe"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <pre className="nl-plain-text">{plain}</pre>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function NewslettersPage() {
  const { isAuthenticated, logout } = useAdmin();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekLabel, setWeekLabel] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    async function load() {
      setLoading(true);
      const { monday, sunday } = getMondayThisSunday();

      // Format week label
      const fmt = (s: string) => {
        const [y, m, d] = s.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };
      setWeekLabel(`Week of ${fmt(monday)} – ${fmt(sunday)}`);

      // Fetch all events for this week
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', monday)
        .lte('start_date', sunday)
        .order('start_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error || !data) {
        setLoading(false);
        return;
      }

      const events = data as Event[];

      // Build a newsletter for each city (city-wide) + each city×sub-cal
      const result: Newsletter[] = [];

      for (const city of CITIES) {
        const cityEvents = events.filter(e => e.city_calendar === city);

        // City-wide newsletter
        result.push({
          key: `${city}|all`,
          city,
          subCal: null,
          label: `${city} (all events)`,
          events: cityEvents,
        });

        // Sub-cal newsletters
        for (const subCal of SUB_CALENDARS) {
          const subEvents = cityEvents.filter(e => eventCategoryMatchesSubCal(e, subCal));
          result.push({
            key: `${city}|${subCal}`,
            city,
            subCal,
            label: `${city} — ${subCal}`,
            events: subEvents,
          });
        }
      }

      setNewsletters(result);
      setLoading(false);
    }
    load();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <AdminLogin />;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Newsletter Generator</h1>
          <div className="flex gap-2">
            <Link href="/" className="btn-secondary flex items-center gap-2">
              <Home size={16} /> Back to Home
            </Link>
            <Link href="/admin" className="btn-secondary flex items-center gap-2">
              Admin Panel
            </Link>
            <Link href="/admin/subscribers" className="btn-secondary flex items-center gap-2">
              <Users size={16} /> Subscribers
            </Link>
            <button onClick={logout} className="btn-logout">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="nl-page">
          <div className="nl-header">
            <h2>Weekly Newsletter Drafts</h2>
            <p className="nl-week-label">{weekLabel}</p>
            <p className="nl-hint">
              Click any newsletter to expand it. Copy the HTML to paste into SendGrid, or copy the plain text to paste into Gmail or any personal email account.
            </p>
          </div>

          {loading ? (
            <div className="nl-loading">Loading events...</div>
          ) : (
            <div className="nl-list">
              {newsletters.map(nl => (
                <NewsletterCard key={nl.key} newsletter={nl} weekLabel={weekLabel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
