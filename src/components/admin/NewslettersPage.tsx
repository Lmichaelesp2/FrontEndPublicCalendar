'use client';

import { useState, useEffect } from 'react';
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

function buildHtmlEmail(label: string, weekLabel: string, events: Event[]): string {
  const eventRows = events.map(e => {
    const dateStr = formatEventDate(e.start_date, e.start_time);
    const location = e.address ? `<br><span style="color:#888;font-size:13px;">📍 ${e.address}</span>` : '';
    const cost = e.paid ? `<span style="color:#888;font-size:12px;">${e.paid === 'Free' ? '🎟 Free' : `💵 ${e.paid}`}</span>` : '';
    const format = e.participation ? `<span style="color:#888;font-size:12px;"> · ${e.participation}</span>` : '';
    const link = e.website
      ? `<br><a href="${e.website}" style="color:#B8860B;font-size:13px;">Register / Learn More →</a>`
      : '';
    return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #f0f0f0;">
          <strong style="font-size:16px;color:#1a1a1a;">${e.name}</strong><br>
          <span style="color:#555;font-size:14px;">📅 ${dateStr}</span>
          ${location}
          ${link}
          <br>${cost}${format}
        </td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a1a;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;color:#B8860B;font-size:22px;letter-spacing:1px;">LOCAL BUSINESS CALENDARS</h1>
            <p style="margin:6px 0 0;color:#cccccc;font-size:14px;">${label} · Weekly Digest</p>
          </td>
        </tr>

        <!-- Week label -->
        <tr>
          <td style="background:#B8860B;padding:10px 32px;text-align:center;">
            <span style="color:#ffffff;font-size:13px;font-weight:bold;letter-spacing:0.5px;">${weekLabel}</span>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:24px 32px 8px;">
            <p style="margin:0;color:#444;font-size:15px;line-height:1.6;">
              Here's what's happening in <strong>${label}</strong> this week.
              Mark your calendar, register early, and we'll see you out there.
            </p>
          </td>
        </tr>

        <!-- Events -->
        <tr>
          <td style="padding:8px 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${eventRows}
            </table>
          </td>
        </tr>

        ${events.length === 0 ? `
        <tr>
          <td style="padding:24px 32px;text-align:center;color:#888;">
            No events found for this week.
          </td>
        </tr>` : ''}

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;color:#888;font-size:12px;">
              You're receiving this because you subscribed to the ${label} newsletter.<br>
              <a href="https://localbusinesscalendars.com" style="color:#B8860B;">localbusinesscalendars.com</a>
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
    `${label} — Weekly Digest`,
    `${weekLabel}`,
    ``,
    `Here's what's happening in ${label} this week:`,
    ``,
  ];

  if (events.length === 0) {
    lines.push('No events found for this week.');
  } else {
    events.forEach(e => {
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`${e.name}`);
      lines.push(`📅 ${formatEventDate(e.start_date, e.start_time)}`);
      if (e.address) lines.push(`📍 ${e.address}`);
      if (e.paid) lines.push(`${e.paid === 'Free' ? '🎟 Free' : `💵 ${e.paid}`}`);
      if (e.participation) lines.push(`${e.participation}`);
      if (e.website) lines.push(`🔗 ${e.website}`);
      lines.push('');
    });
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(``);
  lines.push(`You're receiving this because you subscribed to the ${label} newsletter.`);
  lines.push(`Unsubscribe: https://localbusinesscalendars.com`);

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

// ─── NewsletterCard ────────────────────────────────────────────────────────────

function NewsletterCard({ newsletter, weekLabel }: { newsletter: Newsletter; weekLabel: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'html' | 'text'>('html');

  const html = buildHtmlEmail(newsletter.label, weekLabel, newsletter.events);
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
              HTML (SendGrid / paste into email)
            </button>
            <button className={`nl-tab ${tab === 'text' ? 'active' : ''}`} onClick={() => setTab('text')}>
              Plain text (Gmail / personal email)
            </button>
          </div>

          {/* Copy button */}
          <div className="nl-copy-row">
            <CopyButton text={tab === 'html' ? html : plain} label={`Copy ${tab === 'html' ? 'HTML' : 'plain text'}`} />
          </div>

          {/* Preview / raw */}
          {tab === 'html' ? (
            <div className="nl-preview-wrap">
              <iframe
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
