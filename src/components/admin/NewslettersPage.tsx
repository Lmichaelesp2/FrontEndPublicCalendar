'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatTime } from '../../lib/utils';
import { Copy, Check, Mail, ChevronDown, ChevronUp, LogOut, Home, Users, Send, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminLogin } from './AdminLogin';
import type { Event } from '../../lib/supabase';

// ─── Config ───────────────────────────────────────────────────────────────────

// Send endpoints require the admin password (server-verified) — never callable
// without it. Wraps fetch and attaches the x-admin-password header.
function authFetch(url: string, init?: RequestInit): Promise<Response> {
  const adminPassword = typeof window !== 'undefined' ? localStorage.getItem('adminPassword') : null;
  return fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(adminPassword ? { 'x-admin-password': adminPassword } : {}),
    },
  });
}

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
  const day = today.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

  // Fri/Sat/Sun → look ahead to next Monday's week so preview matches the send
  let diffToMonday: number;
  if (day === 0) {
    diffToMonday = 1;        // Sun → next Mon
  } else if (day >= 5) {
    diffToMonday = 8 - day;  // Fri → +3, Sat → +2
  } else {
    diffToMonday = 1 - day;  // Mon → 0, Tue → -1, etc.
  }

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
  const time = timeStr ? ` at ${formatTime(timeStr)}` : '';
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

// ─── SendButton ───────────────────────────────────────────────────────────────

interface SendStats {
  sentToday: number;
  totalSubscribers: number;
  dailyCap: number | null;
  remaining: number | null;
}

type SendStatus = 'idle' | 'checking' | 'confirm' | 'sending' | 'done' | 'error';

interface SendResult {
  sentCount: number;
  eventsCount: number;
  totalSubscribers: number;
  skippedByRamp: number;
  errors?: { email: string; error: string }[];
}

function SendButton({ city, subCalendar }: { city: string; subCalendar: string | null }) {
  const [status, setStatus] = useState<SendStatus>('idle');
  const [stats, setStats] = useState<SendStats | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const isSA = city === 'San Antonio';
  const listLabel = subCalendar ? `${city} — ${subCalendar}` : city;

  const fetchStats = useCallback(async () => {
    setStatus('checking');
    try {
      const params = new URLSearchParams({ city });
      if (subCalendar) params.set('subCalendar', subCalendar);
      const res = await authFetch(`/api/send-newsletter?${params}`);
      const data = await res.json();
      setStats(data);
      setStatus('confirm');
    } catch {
      setErrMsg('Could not load send stats.');
      setStatus('error');
    }
  }, [city, subCalendar]);

  async function handleSend() {
    setStatus('sending');
    try {
      const res = await authFetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, subCalendar }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error ?? 'Send failed');
        setStatus('error');
        return;
      }
      setResult(data);
      setStatus('done');
    } catch (e: any) {
      setErrMsg(e?.message ?? 'Send failed');
      setStatus('error');
    }
  }

  if (status === 'idle') {
    return (
      <button onClick={fetchStats} className="nl-send-btn">
        <Send size={14} /> Send to {listLabel} subscribers
      </button>
    );
  }

  if (status === 'checking') {
    return (
      <div className="nl-send-status nl-send-checking">
        <Loader2 size={14} className="nl-spin" /> Checking send stats…
      </div>
    );
  }

  if (status === 'confirm' && stats) {
    const willSend = isSA
      ? Math.min(stats.remaining ?? stats.totalSubscribers, stats.totalSubscribers - stats.sentToday)
      : stats.totalSubscribers - stats.sentToday;

    return (
      <div className="nl-send-confirm">
        <div className="nl-send-confirm-info">
          <strong>{listLabel} — Ready to send</strong>
          {isSA && (
            <div className="nl-ramp-info">
              <AlertTriangle size={13} />
              <span>SA ramp mode: {stats.sentToday} sent today · {stats.remaining} remaining of {stats.dailyCap}/day cap</span>
            </div>
          )}
          <div className="nl-send-confirm-detail">
            {stats.totalSubscribers} active subscribers
            {isSA && stats.sentToday > 0 ? ` · ${stats.sentToday} already sent today` : ''}
            {' → '}<strong>will send to {willSend > 0 ? willSend : stats.totalSubscribers}</strong>
          </div>
        </div>
        <div className="nl-send-confirm-btns">
          <button onClick={handleSend} className="nl-send-btn nl-send-confirm-go">
            <Send size={14} /> Confirm Send
          </button>
          <button onClick={() => setStatus('idle')} className="nl-send-cancel">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (status === 'sending') {
    return (
      <div className="nl-send-status nl-send-checking">
        <Loader2 size={14} className="nl-spin" /> Sending emails… do not close this tab
      </div>
    );
  }

  if (status === 'done' && result) {
    return (
      <div className="nl-send-status nl-send-done">
        <CheckCircle size={14} />
        <span>
          ✓ Sent to <strong>{result.sentCount}</strong> subscribers
          {result.skippedByRamp > 0 && <> · <span className="nl-ramp-badge">{result.skippedByRamp} held for ramp</span></>}
          {result.errors && result.errors.length > 0 && <> · {result.errors.length} failed</>}
        </span>
        <button onClick={() => { setStatus('idle'); setResult(null); }} className="nl-send-reset">Send again</button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="nl-send-status nl-send-error">
        <AlertTriangle size={14} />
        <span>{errMsg}</span>
        <button onClick={() => setStatus('idle')} className="nl-send-reset">Retry</button>
      </div>
    );
  }

  return null;
}

// ─── TestSendButton ───────────────────────────────────────────────────────────

const DEFAULT_TEST_EMAILS = [
  'themobilecoach@gmail.com',
  'michael@localbusinesscalendars.com',
  'michael@technologycoaching.com',
  'michael@sabusinesscalendar.com',
];

type TestSendStatus = 'idle' | 'open' | 'sending' | 'done' | 'error';

interface TestSendResult {
  sentCount: number;
  eventsCount: number;
  sentTo: string[];
  errors?: { email: string; error: string }[];
}

function TestSendButton({ city, subCalendar }: { city: string; subCalendar: string | null }) {
  const [status, setStatus] = useState<TestSendStatus>('idle');
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_TEST_EMAILS));
  const [customEmail, setCustomEmail] = useState('');
  const [testList, setTestList] = useState<string[]>(DEFAULT_TEST_EMAILS);
  const [result, setResult] = useState<TestSendResult | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const listLabel = subCalendar ? `${city} — ${subCalendar}` : city;

  function toggleEmail(email: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  function addCustomEmail() {
    const email = customEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (!testList.includes(email)) setTestList(prev => [...prev, email]);
    setSelected(prev => new Set([...prev, email]));
    setCustomEmail('');
  }

  async function handleTestSend() {
    const emails = testList.filter(e => selected.has(e));
    if (emails.length === 0) return;
    setStatus('sending');
    try {
      const res = await authFetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, subCalendar, testEmails: emails }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error ?? 'Test send failed');
        setStatus('error');
        return;
      }
      setResult(data);
      setStatus('done');
    } catch (e: any) {
      setErrMsg(e?.message ?? 'Test send failed');
      setStatus('error');
    }
  }

  if (status === 'idle') {
    return (
      <button onClick={() => setStatus('open')} className="nl-test-btn">
        <Mail size={13} /> Test Send
      </button>
    );
  }

  if (status === 'open') {
    const selectedEmails = testList.filter(e => selected.has(e));
    return (
      <div className="nl-test-panel">
        <div className="nl-test-panel-header">
          <span className="nl-test-label">Test Send — {listLabel}</span>
          <button onClick={() => setStatus('idle')} className="nl-test-close">✕</button>
        </div>
        <p className="nl-test-hint">Sends the real email HTML to these addresses only. Does not count against the SA ramp cap.</p>
        <div className="nl-test-list">
          {testList.map(email => (
            <label key={email} className="nl-test-email-row">
              <input
                type="checkbox"
                checked={selected.has(email)}
                onChange={() => toggleEmail(email)}
              />
              <span>{email}</span>
            </label>
          ))}
        </div>
        <div className="nl-test-add-row">
          <input
            type="email"
            value={customEmail}
            onChange={e => setCustomEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomEmail()}
            placeholder="Add another email…"
            className="nl-test-input"
          />
          <button onClick={addCustomEmail} className="nl-test-add-btn">Add</button>
        </div>
        <div className="nl-test-send-row">
          <button
            onClick={handleTestSend}
            disabled={selectedEmails.length === 0}
            className="nl-test-send-go"
          >
            <Send size={13} /> Send to {selectedEmails.length} address{selectedEmails.length !== 1 ? 'es' : ''}
          </button>
          <button onClick={() => setStatus('idle')} className="nl-send-cancel">Cancel</button>
        </div>
      </div>
    );
  }

  if (status === 'sending') {
    return (
      <div className="nl-send-status nl-send-checking">
        <Loader2 size={14} className="nl-spin" /> Sending test emails…
      </div>
    );
  }

  if (status === 'done' && result) {
    return (
      <div className="nl-send-status nl-send-done">
        <CheckCircle size={14} />
        <span>Test sent to <strong>{result.sentCount}</strong> address{result.sentCount !== 1 ? 'es' : ''} · {result.eventsCount} events</span>
        <button onClick={() => { setStatus('idle'); setResult(null); }} className="nl-send-reset">Done</button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="nl-send-status nl-send-error">
        <AlertTriangle size={14} />
        <span>{errMsg}</span>
        <button onClick={() => setStatus('open')} className="nl-send-reset">Retry</button>
      </div>
    );
  }

  return null;
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

  // Local builder is a fallback only. The real preview is fetched from the
  // send-newsletter API in preview mode so what you see === what actually sends
  // (real sponsors, weekly rotation, NPR layout).
  const fallbackHtml = buildHtmlEmail(newsletter.label, weekLabel, newsletter.events, newsletter.subCal !== null);
  const plain = buildPlainText(newsletter.label, weekLabel, newsletter.events);

  const [html, setHtml] = useState(fallbackHtml);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setPreviewLoading(true);
    (async () => {
      try {
        const res = await authFetch('/api/send-newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: newsletter.city, subCalendar: newsletter.subCal, preview: true }),
        });
        if (res.ok) {
          const real = await res.text();
          if (!cancelled && real) setHtml(real);
        }
      } catch {
        /* keep fallback */
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, newsletter.city, newsletter.subCal]);

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

          {/* Send + Test Send buttons — all newsletters */}
          <div className="nl-send-row">
            <div className="nl-send-row-btns">
              <SendButton city={newsletter.city} subCalendar={newsletter.subCal} />
              <TestSendButton city={newsletter.city} subCalendar={newsletter.subCal} />
            </div>
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

// ─── SendCityButton — sends city-wide + all sub-cals for one city ─────────────

type BulkStatus = 'idle' | 'confirm' | 'sending' | 'done' | 'error';

interface BulkResult {
  label: string;
  sentCount: number;
  eventsCount: number;
  skippedByRamp: number;
  error?: string;
}

function SendCityButton({ city, newsletters }: { city: string; newsletters: Newsletter[] }) {
  const [status, setStatus] = useState<BulkStatus>('idle');
  const [results, setResults] = useState<BulkResult[]>([]);
  const [errMsg, setErrMsg] = useState('');

  const cityNewsletters = newsletters.filter(nl => nl.city === city);
  const totalLists = cityNewsletters.length;

  async function handleSendAll() {
    setStatus('sending');
    const out: BulkResult[] = [];

    for (const nl of cityNewsletters) {
      try {
        const res = await authFetch('/api/send-newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: nl.city, subCalendar: nl.subCal }),
        });
        const data = await res.json();
        out.push({
          label: nl.label,
          sentCount: data.sentCount ?? 0,
          eventsCount: data.eventsCount ?? 0,
          skippedByRamp: data.skippedByRamp ?? 0,
          error: !res.ok ? (data.error ?? 'Failed') : undefined,
        });
      } catch (e: any) {
        out.push({ label: nl.label, sentCount: 0, eventsCount: 0, skippedByRamp: 0, error: e?.message ?? 'Failed' });
      }
    }

    setResults(out);
    setStatus('done');
  }

  if (status === 'idle') {
    return (
      <button onClick={() => setStatus('confirm')} className="nl-bulk-city-btn">
        <Send size={13} /> Send All {city}
      </button>
    );
  }

  if (status === 'confirm') {
    return (
      <div className="nl-bulk-confirm">
        <span>Send all <strong>{totalLists}</strong> {city} newsletters at once?</span>
        <button onClick={handleSendAll} className="nl-bulk-go"><Send size={13} /> Confirm</button>
        <button onClick={() => setStatus('idle')} className="nl-send-cancel">Cancel</button>
      </div>
    );
  }

  if (status === 'sending') {
    return (
      <div className="nl-send-status nl-send-checking">
        <Loader2 size={13} className="nl-spin" /> Sending {city} newsletters…
      </div>
    );
  }

  if (status === 'done') {
    const totalSent = results.reduce((s, r) => s + r.sentCount, 0);
    const errors = results.filter(r => r.error);
    return (
      <div className="nl-send-status nl-send-done" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '.35rem' }}>
        <span><CheckCircle size={13} /> {city} done — <strong>{totalSent}</strong> emails sent across {totalLists} lists</span>
        {errors.length > 0 && <span style={{ color: '#b45309', fontSize: '.78rem' }}>{errors.length} list(s) had errors</span>}
        <button onClick={() => { setStatus('idle'); setResults([]); }} className="nl-send-reset">Reset</button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="nl-send-status nl-send-error">
        <AlertTriangle size={13} /> {errMsg}
        <button onClick={() => setStatus('idle')} className="nl-send-reset">Retry</button>
      </div>
    );
  }

  return null;
}

// ─── PremiumDigestSection ─────────────────────────────────────────────────────

interface PremiumStats {
  premiumCount: number;
  withProfile: number;
  withoutProfile: number;
}

interface PremiumSendResult {
  sentCount: number;
  premiumCount: number;
  skippedNoProfile: number;
  errors?: { email: string; error: string }[];
}

type PremiumStatus = 'idle' | 'checking' | 'confirm' | 'sending' | 'done' | 'error';
type PremiumTestStatus = 'idle' | 'open' | 'sending' | 'done' | 'error';

function PremiumDigestSection() {
  const [open, setOpen]             = useState(false);
  const [stats, setStats]           = useState<PremiumStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError]     = useState('');
  const [sendStatus, setSendStatus] = useState<PremiumStatus>('idle');
  const [sendResult, setSendResult] = useState<PremiumSendResult | null>(null);
  const [sendErr, setSendErr]       = useState('');

  // Test send state
  const [testStatus, setTestStatus] = useState<PremiumTestStatus>('idle');
  const [selected, setSelected]     = useState<Set<string>>(
    new Set(['themobilecoach@gmail.com', 'michael@localbusinesscalendars.com']),
  );
  const [customEmail, setCustomEmail] = useState('');
  const [testList, setTestList]     = useState([
    'themobilecoach@gmail.com',
    'michael@localbusinesscalendars.com',
  ]);
  const [testResult, setTestResult] = useState<{ sentCount: number; picksCount: number; totalEvents: number; city: string; categories: string[] } | null>(null);
  const [testErr, setTestErr]       = useState('');

  async function loadStats() {
    setStatsLoading(true);
    setStatsError('');
    try {
      const res  = await authFetch('/api/send-premium-digest');
      const data = await res.json();
      if (!res.ok) {
        setStatsError(data.error ?? `HTTP ${res.status}`);
      } else {
        setStats(data);
      }
    } catch (e: any) {
      setStatsError(e?.message ?? 'Failed to load stats');
    } finally {
      setStatsLoading(false);
    }
  }

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next && !stats) loadStats();
  }

  // ── Test send ──────────────────────────────────────────────────────────────
  function toggleTestEmail(email: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  function addCustomTestEmail() {
    const email = customEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (!testList.includes(email)) setTestList(prev => [...prev, email]);
    setSelected(prev => new Set([...prev, email]));
    setCustomEmail('');
  }

  async function handleTestSend() {
    const emails = testList.filter(e => selected.has(e));
    if (emails.length === 0) return;
    setTestStatus('sending');
    try {
      const res  = await authFetch('/api/send-premium-digest', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ testEmails: emails }),
      });
      const data = await res.json();
      if (!res.ok) { setTestErr((data.error ?? 'Test send failed') + (data.detail ? ` — ${data.detail}` : '')); setTestStatus('error'); return; }
      setTestResult(data);
      setTestStatus('done');
    } catch (e: any) {
      setTestErr(e?.message ?? 'Test send failed');
      setTestStatus('error');
    }
  }

  // ── Real send ──────────────────────────────────────────────────────────────
  async function handleConfirmSend() {
    setSendStatus('sending');
    try {
      const res  = await authFetch('/api/send-premium-digest', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) { setSendErr(data.error ?? 'Send failed'); setSendStatus('error'); return; }
      setSendResult(data);
      setSendStatus('done');
    } catch (e: any) {
      setSendErr(e?.message ?? 'Send failed');
      setSendStatus('error');
    }
  }

  return (
    <div className="nl-premium-section">
      <button className="nl-premium-header" onClick={handleToggle}>
        <div className="nl-premium-title">
          <span className="nl-premium-badge">★ Premium</span>
          <span>Personalized Member Digest</span>
          {stats && (
            <span className="nl-event-count">
              {stats.premiumCount} member{stats.premiumCount !== 1 ? 's' : ''}
              {' · '}{stats.withProfile} with preferences set
            </span>
          )}
          {statsLoading && <span className="nl-event-count">Loading…</span>}
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="nl-premium-body">
          <p className="nl-hint" style={{ marginBottom: '1rem' }}>
            Sends each premium member a personalized digest based on their city and category preferences.
            Members without preferences set are skipped.
          </p>

          {/* Stats */}
          {statsError && (
            <div className="nl-send-status nl-send-error" style={{ marginBottom: '.75rem' }}>
              <AlertTriangle size={13} /> Stats error: {statsError}
              <button onClick={loadStats} className="nl-send-reset">Retry</button>
            </div>
          )}
          {stats && (
            <div className="nl-premium-stats">
              <span><strong>{stats.premiumCount}</strong> premium members</span>
              <span><strong>{stats.withProfile}</strong> with preferences → will receive digest</span>
              {stats.withoutProfile > 0 && (
                <span style={{ color: '#b45309' }}><strong>{stats.withoutProfile}</strong> skipped (no preferences set)</span>
              )}
            </div>
          )}

          {/* Test send */}
          <div className="nl-send-row" style={{ marginTop: '1rem' }}>
            <div className="nl-send-row-btns">

              {/* Real send button */}
              {sendStatus === 'idle' && (
                <button onClick={() => setSendStatus('confirm')} className="nl-send-btn">
                  <Send size={14} /> Send Premium Digest
                </button>
              )}
              {sendStatus === 'confirm' && (
                <div className="nl-send-confirm">
                  <div className="nl-send-confirm-info">
                    <strong>Send personalized digest to {stats?.withProfile ?? '?'} premium members?</strong>
                  </div>
                  <div className="nl-send-confirm-btns">
                    <button onClick={handleConfirmSend} className="nl-send-btn nl-send-confirm-go">
                      <Send size={14} /> Confirm Send
                    </button>
                    <button onClick={() => setSendStatus('idle')} className="nl-send-cancel">Cancel</button>
                  </div>
                </div>
              )}
              {sendStatus === 'checking' && (
                <div className="nl-send-status nl-send-checking">
                  <Loader2 size={14} className="nl-spin" /> Checking…
                </div>
              )}
              {sendStatus === 'sending' && (
                <div className="nl-send-status nl-send-checking">
                  <Loader2 size={14} className="nl-spin" /> Sending premium digests… do not close this tab
                </div>
              )}
              {sendStatus === 'done' && sendResult && (
                <div className="nl-send-status nl-send-done">
                  <CheckCircle size={14} />
                  <span>
                    ✓ Sent to <strong>{sendResult.sentCount}</strong> premium members
                    {sendResult.skippedNoProfile > 0 && <> · {sendResult.skippedNoProfile} skipped (no preferences)</>}
                    {sendResult.errors && sendResult.errors.length > 0 && <> · {sendResult.errors.length} failed</>}
                  </span>
                  <button onClick={() => { setSendStatus('idle'); setSendResult(null); loadStats(); }} className="nl-send-reset">
                    Reset
                  </button>
                </div>
              )}
              {sendStatus === 'error' && (
                <div className="nl-send-status nl-send-error">
                  <AlertTriangle size={14} /> {sendErr}
                  <button onClick={() => setSendStatus('idle')} className="nl-send-reset">Retry</button>
                </div>
              )}

              {/* Test send button */}
              {testStatus === 'idle' && (
                <button onClick={() => setTestStatus('open')} className="nl-test-btn">
                  <Mail size={13} /> Test Send
                </button>
              )}
              {testStatus === 'open' && (
                <div className="nl-test-panel">
                  <div className="nl-test-panel-header">
                    <span className="nl-test-label">Test Send — Premium Digest</span>
                    <button onClick={() => setTestStatus('idle')} className="nl-test-close">✕</button>
                  </div>
                  <p className="nl-test-hint">
                    Sends using the first premium member's preferences as a sample. Does not send to real subscribers.
                  </p>
                  <div className="nl-test-list">
                    {testList.map(email => (
                      <label key={email} className="nl-test-email-row">
                        <input type="checkbox" checked={selected.has(email)} onChange={() => toggleTestEmail(email)} />
                        <span>{email}</span>
                      </label>
                    ))}
                  </div>
                  <div className="nl-test-add-row">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomTestEmail()}
                      placeholder="Add another email…"
                      className="nl-test-input"
                    />
                    <button onClick={addCustomTestEmail} className="nl-test-add-btn">Add</button>
                  </div>
                  <div className="nl-test-send-row">
                    <button
                      onClick={handleTestSend}
                      disabled={testList.filter(e => selected.has(e)).length === 0}
                      className="nl-test-send-go"
                    >
                      <Send size={13} /> Send to {testList.filter(e => selected.has(e)).length} address{testList.filter(e => selected.has(e)).length !== 1 ? 'es' : ''}
                    </button>
                    <button onClick={() => setTestStatus('idle')} className="nl-send-cancel">Cancel</button>
                  </div>
                </div>
              )}
              {testStatus === 'sending' && (
                <div className="nl-send-status nl-send-checking">
                  <Loader2 size={14} className="nl-spin" /> Sending test…
                </div>
              )}
              {testStatus === 'done' && testResult && (
                <div className="nl-send-status nl-send-done">
                  <CheckCircle size={14} />
                  <span>
                    Test sent · {testResult.picksCount} picks + {testResult.totalEvents - testResult.picksCount} other · {testResult.city}
                    {testResult.categories.length > 0 && ` · ${testResult.categories.join(', ')}`}
                  </span>
                  <button onClick={() => { setTestStatus('idle'); setTestResult(null); }} className="nl-send-reset">Done</button>
                </div>
              )}
              {testStatus === 'error' && (
                <div className="nl-send-status nl-send-error">
                  <AlertTriangle size={14} /> {testErr}
                  <button onClick={() => setTestStatus('open')} className="nl-send-reset">Retry</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ReengagementSection — legacy free_subscribers re-engagement campaign ─────

type ReengageStatus = 'idle' | 'open' | 'sending' | 'done' | 'error';

interface ReengageDryRunResult {
  group: string;
  city: string;
  totalCandidates: number;
  sentToday: number;
  dailyCap: number;
  wouldSendTo: number;
}

interface ReengageSendResult {
  sentCount: number;
  sentTo?: string[];
  totalCandidates?: number;
  sentToday?: number;
  dailyCap?: number;
  errors?: { email: string; error: string }[];
}

function ReengagementSection() {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<'warm' | 'cold'>('warm');

  // Dry-run / stats
  const [dryRun, setDryRun] = useState<ReengageDryRunResult | null>(null);
  const [dryRunLoading, setDryRunLoading] = useState(false);
  const [dryRunErr, setDryRunErr] = useState('');

  // Test send
  const [testStatus, setTestStatus] = useState<ReengageStatus>('idle');
  const [selected, setSelected] = useState<Set<string>>(new Set(['themobilecoach@gmail.com']));
  const [customEmail, setCustomEmail] = useState('');
  const [testList, setTestList] = useState<string[]>(['themobilecoach@gmail.com']);
  const [testResult, setTestResult] = useState<ReengageSendResult | null>(null);
  const [testErr, setTestErr] = useState('');

  // Real send
  const [sendStatus, setSendStatus] = useState<ReengageStatus | 'confirm'>('idle');
  const [sendResult, setSendResult] = useState<ReengageSendResult | null>(null);
  const [sendErr, setSendErr] = useState('');

  async function loadDryRun(g: 'warm' | 'cold') {
    setDryRunLoading(true);
    setDryRunErr('');
    try {
      const res = await authFetch('/api/send-reengagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: g, dryRun: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDryRunErr(data.error ?? `HTTP ${res.status}`);
      } else {
        setDryRun(data);
      }
    } catch (e: any) {
      setDryRunErr(e?.message ?? 'Failed to load dry run');
    } finally {
      setDryRunLoading(false);
    }
  }

  function handleToggle() {
    const next = !open;
    setOpen(next);
    if (next) loadDryRun(group);
  }

  function handleGroupChange(g: 'warm' | 'cold') {
    setGroup(g);
    setDryRun(null);
    loadDryRun(g);
  }

  // ── Test send ──────────────────────────────────────────────────────────────
  function toggleTestEmail(email: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  function addCustomTestEmail() {
    const email = customEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (!testList.includes(email)) setTestList(prev => [...prev, email]);
    setSelected(prev => new Set([...prev, email]));
    setCustomEmail('');
  }

  async function handleTestSend() {
    const emails = testList.filter(e => selected.has(e));
    if (emails.length === 0) return;
    setTestStatus('sending');
    try {
      const res = await authFetch('/api/send-reengagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmails: emails, city: 'San Antonio' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTestErr((data.error ?? 'Test send failed') + (data.detail ? ` — ${data.detail}` : ''));
        setTestStatus('error');
        return;
      }
      setTestResult(data);
      setTestStatus('done');
    } catch (e: any) {
      setTestErr(e?.message ?? 'Test send failed');
      setTestStatus('error');
    }
  }

  // ── Real send ──────────────────────────────────────────────────────────────
  async function handleConfirmSend() {
    setSendStatus('sending');
    try {
      const res = await authFetch('/api/send-reengagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group }),
      });
      const data = await res.json();
      if (!res.ok) { setSendErr(data.error ?? 'Send failed'); setSendStatus('error'); return; }
      setSendResult(data);
      setSendStatus('done');
    } catch (e: any) {
      setSendErr(e?.message ?? 'Send failed');
      setSendStatus('error');
    }
  }

  return (
    <div className="nl-premium-section">
      <button className="nl-premium-header" onClick={handleToggle}>
        <div className="nl-premium-title">
          <span className="nl-premium-badge" style={{ background: '#7c3aed' }}>↻ Re-engagement</span>
          <span>Legacy Subscriber Re-engagement</span>
          {dryRun && (
            <span className="nl-event-count">
              {dryRun.totalCandidates} candidates · {dryRun.sentToday}/{dryRun.dailyCap} sent today
            </span>
          )}
          {dryRunLoading && <span className="nl-event-count">Loading…</span>}
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="nl-premium-body">
          <p className="nl-hint" style={{ marginBottom: '1rem' }}>
            One-time "we rebuilt the calendar, it's free now" note to people in free_subscribers.
            Never sends to the same person twice (tracked in reengagement_sends) and excludes premium members.
          </p>

          {/* Group toggle */}
          <div className="nl-test-list" style={{ marginBottom: '.75rem' }}>
            <label className="nl-test-email-row">
              <input type="radio" name="reengage-group" checked={group === 'warm'} onChange={() => handleGroupChange('warm')} />
              <span><strong>Warm</strong> — already getting the weekly newsletter (low risk, ~485 people)</span>
            </label>
            <label className="nl-test-email-row">
              <input type="radio" name="reengage-group" checked={group === 'cold'} onChange={() => handleGroupChange('cold')} />
              <span><strong>Cold</strong> — no recent send history (higher deliverability risk, ramp slowly)</span>
            </label>
          </div>

          {dryRunErr && (
            <div className="nl-send-status nl-send-error" style={{ marginBottom: '.75rem' }}>
              <AlertTriangle size={13} /> {dryRunErr}
              <button onClick={() => loadDryRun(group)} className="nl-send-reset">Retry</button>
            </div>
          )}
          {dryRun && (
            <div className="nl-premium-stats">
              <span><strong>{dryRun.totalCandidates}</strong> eligible in "{dryRun.group}" group</span>
              <span><strong>{dryRun.sentToday}</strong> / {dryRun.dailyCap} sent today (daily cap)</span>
              <span><strong>{dryRun.wouldSendTo}</strong> would be sent to right now</span>
            </div>
          )}

          <div className="nl-send-row" style={{ marginTop: '1rem' }}>
            <div className="nl-send-row-btns">

              {/* Real send button */}
              {sendStatus === 'idle' && (
                <button onClick={() => setSendStatus('confirm')} className="nl-send-btn">
                  <Send size={14} /> Send to {group === 'warm' ? 'Warm' : 'Cold'} Group
                </button>
              )}
              {sendStatus === 'confirm' && (
                <div className="nl-send-confirm">
                  <div className="nl-send-confirm-info">
                    <strong>Send to up to {dryRun?.wouldSendTo ?? '?'} people in the {group} group?</strong>
                  </div>
                  <div className="nl-send-confirm-btns">
                    <button onClick={handleConfirmSend} className="nl-send-btn nl-send-confirm-go">
                      <Send size={14} /> Confirm Send
                    </button>
                    <button onClick={() => setSendStatus('idle')} className="nl-send-cancel">Cancel</button>
                  </div>
                </div>
              )}
              {sendStatus === 'sending' && (
                <div className="nl-send-status nl-send-checking">
                  <Loader2 size={14} className="nl-spin" /> Sending…
                </div>
              )}
              {sendStatus === 'done' && sendResult && (
                <div className="nl-send-status nl-send-done">
                  <CheckCircle size={14} />
                  <span>
                    ✓ Sent to <strong>{sendResult.sentCount}</strong> people
                    {sendResult.errors && sendResult.errors.length > 0 && <> · {sendResult.errors.length} failed</>}
                  </span>
                  <button onClick={() => { setSendStatus('idle'); setSendResult(null); loadDryRun(group); }} className="nl-send-reset">
                    Reset
                  </button>
                </div>
              )}
              {sendStatus === 'error' && (
                <div className="nl-send-status nl-send-error">
                  <AlertTriangle size={14} /> {sendErr}
                  <button onClick={() => setSendStatus('idle')} className="nl-send-reset">Retry</button>
                </div>
              )}

              {/* Test send button */}
              {testStatus === 'idle' && (
                <button onClick={() => setTestStatus('open')} className="nl-test-btn">
                  <Mail size={13} /> Test Send
                </button>
              )}
              {testStatus === 'open' && (
                <div className="nl-test-panel">
                  <div className="nl-test-panel-header">
                    <span className="nl-test-label">Test Send — Re-engagement</span>
                    <button onClick={() => setTestStatus('idle')} className="nl-test-close">✕</button>
                  </div>
                  <p className="nl-test-hint">
                    Sends the real email HTML (with a TEST banner) to these addresses only. Does not touch the candidate list or count against the daily cap.
                  </p>
                  <div className="nl-test-list">
                    {testList.map(email => (
                      <label key={email} className="nl-test-email-row">
                        <input type="checkbox" checked={selected.has(email)} onChange={() => toggleTestEmail(email)} />
                        <span>{email}</span>
                      </label>
                    ))}
                  </div>
                  <div className="nl-test-add-row">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={e => setCustomEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomTestEmail()}
                      placeholder="Add another email…"
                      className="nl-test-input"
                    />
                    <button onClick={addCustomTestEmail} className="nl-test-add-btn">Add</button>
                  </div>
                  <div className="nl-test-send-row">
                    <button
                      onClick={handleTestSend}
                      disabled={testList.filter(e => selected.has(e)).length === 0}
                      className="nl-test-send-go"
                    >
                      <Send size={13} /> Send to {testList.filter(e => selected.has(e)).length} address{testList.filter(e => selected.has(e)).length !== 1 ? 'es' : ''}
                    </button>
                    <button onClick={() => setTestStatus('idle')} className="nl-send-cancel">Cancel</button>
                  </div>
                </div>
              )}
              {testStatus === 'sending' && (
                <div className="nl-send-status nl-send-checking">
                  <Loader2 size={14} className="nl-spin" /> Sending test…
                </div>
              )}
              {testStatus === 'done' && testResult && (
                <div className="nl-send-status nl-send-done">
                  <CheckCircle size={14} />
                  <span>Test sent to <strong>{testResult.sentCount}</strong> address{testResult.sentCount !== 1 ? 'es' : ''}</span>
                  <button onClick={() => { setTestStatus('idle'); setTestResult(null); }} className="nl-send-reset">Done</button>
                </div>
              )}
              {testStatus === 'error' && (
                <div className="nl-send-status nl-send-error">
                  <AlertTriangle size={14} /> {testErr}
                  <button onClick={() => setTestStatus('open')} className="nl-send-reset">Retry</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SendAllCitiesButton — sends every city, every list ───────────────────────

function SendAllCitiesButton({ newsletters }: { newsletters: Newsletter[] }) {
  const [status, setStatus] = useState<BulkStatus>('idle');
  const [progress, setProgress] = useState('');
  const [totalSent, setTotalSent] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  const total = newsletters.length;

  async function handleSendAll() {
    setStatus('sending');
    let sent = 0;
    let done = 0;

    for (const nl of newsletters) {
      setProgress(`Sending ${nl.label}…`);
      try {
        const res = await authFetch('/api/send-newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: nl.city, subCalendar: nl.subCal }),
        });
        const data = await res.json();
        sent += data.sentCount ?? 0;
      } catch {}
      done++;
      setDoneCount(done);
      setTotalSent(sent);
    }

    setStatus('done');
  }

  if (status === 'idle') {
    return (
      <button onClick={() => setStatus('confirm')} className="nl-send-all-btn">
        <Send size={14} /> Send All Cities
      </button>
    );
  }

  if (status === 'confirm') {
    return (
      <div className="nl-bulk-confirm nl-bulk-confirm--all">
        <span>Send all <strong>{total}</strong> newsletters across all cities?</span>
        <button onClick={handleSendAll} className="nl-bulk-go"><Send size={13} /> Yes, send all</button>
        <button onClick={() => setStatus('idle')} className="nl-send-cancel">Cancel</button>
      </div>
    );
  }

  if (status === 'sending') {
    return (
      <div className="nl-send-status nl-send-checking">
        <Loader2 size={14} className="nl-spin" />
        <span>{progress} ({doneCount}/{total})</span>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="nl-send-status nl-send-done">
        <CheckCircle size={14} />
        <span>All done — <strong>{totalSent}</strong> emails sent across {total} lists</span>
        <button onClick={() => { setStatus('idle'); setTotalSent(0); setDoneCount(0); }} className="nl-send-reset">Reset</button>
      </div>
    );
  }

  return null;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function NewslettersPage() {
  const { isAuthenticated, logout } = useAdmin();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekLabel, setWeekLabel] = useState('');
  // Sub-calendar (per-category) newsletters are hidden by default — only the 4
  // city newsletters show, since those are the weekly sends. Toggle to reveal.
  const [showSubCals, setShowSubCals] = useState(false);

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
        .from('events_approved')
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
              Test Send first to preview, then send to each city individually or all at once.
            </p>
            {!loading && newsletters.length > 0 && (
              <div className="nl-send-all-row">
                <SendAllCitiesButton newsletters={showSubCals ? newsletters : newsletters.filter(nl => nl.subCal === null)} />
              </div>
            )}
          </div>

          {/* Premium digest — always visible, loads its own data */}
          <PremiumDigestSection />

          {/* Re-engagement campaign — always visible, loads its own data */}
          <ReengagementSection />

          {loading ? (
            <div className="nl-loading">Loading events...</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 0 12px' }}>
                <button
                  onClick={() => setShowSubCals(v => !v)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'transparent', border: '1px solid #d0d7de', borderRadius: 8,
                    padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#475569', cursor: 'pointer',
                  }}>
                  {showSubCals ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showSubCals ? 'Hide sub-calendars' : 'Show sub-calendars'}
                </button>
              </div>
              <div className="nl-list">
                {CITIES.map(city => {
                  const cityNls = newsletters.filter(nl =>
                    nl.city === city && (showSubCals || nl.subCal === null)
                  );
                  return (
                    <div key={city} className="nl-city-group">
                      <div className="nl-city-group-header">
                        <span className="nl-city-group-label">{city}</span>
                        <SendCityButton city={city} newsletters={showSubCals ? newsletters : newsletters.filter(nl => nl.subCal === null)} />
                      </div>
                      {cityNls.map(nl => (
                        <NewsletterCard key={nl.key} newsletter={nl} weekLabel={weekLabel} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
