'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const CITIES = ['San Antonio', 'Austin', 'Dallas', 'Houston'];

const INDUSTRIES = [
  'Real Estate',
  'Insurance',
  'Financial Advisory / Wealth Management',
  'HR / Staffing / Executive Recruiting',
  'Technology / IT Services',
  'Mortgage / Lending',
  'CPA / Accounting',
  'Legal',
  'Other',
];

const PILLARS = [
  {
    label: 'People',
    title: 'Know exactly who belongs in your network — before you walk into any room.',
    body: 'We profile your ideal prospects, referral partners, connectors, and existing customers. Then we map the organizations and events in your city where those people already gather. You stop wasting evenings in the wrong rooms.',
  },
  {
    label: 'Content',
    title: "Turn the events you're already attending into content that keeps you visible.",
    body: "You don't need to create content from scratch. Every event you attend is content waiting to be shared — a photo, a takeaway, a quick recap. We show you the simplest possible process so the people who couldn't be there remember who was.",
  },
  {
    label: 'Participation',
    title: 'Work the right organizations and events with depth — not just attendance.',
    body: 'We tell you which chamber, which networking group, which industry association is worth your time and money. Then we guide you on how to show up: when to join, when to lead, and how to become a recognized presence people trust.',
  },
  {
    label: 'Relationships',
    title: 'Stay top of mind after every room empties — until contacts become clients.',
    body: 'Most networking dies in the follow-up. We give you a simple maintenance system — email, social, and the AI assistant checking in weekly — so the relationships you build keep compounding long after the event ends.',
  },
];

export default function TexasBusinessNetworkPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/tbn-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city, industry }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Navigation />
      <main>

        {/* ── Hero ── */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem 3.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              Texas Business Network
            </p>
            <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.15, marginBottom: '1.25rem', color: '#0a1628', maxWidth: 800 }}>
              We do the research. You build the relationships.
            </h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.75, color: '#1f2a3d', marginBottom: '2rem', maxWidth: 680 }}>
              An exclusive membership for established business professionals in Texas who are serious about growing through the right relationships — not random networking. A proven framework, an AI assistant, and expert guidance, all pointed at one goal: 100 people in your network who know you, trust you, and send you business.
            </p>
            <a href="#waitlist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#c2410c', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
              Join the waitlist →
            </a>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div style={{ background: '#0a1628', padding: '0.85rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>25 MEMBERS PER CITY</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>4 TEXAS CITIES</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>APPLICATION REQUIRED</span>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>$100 / MONTH</span>
          </div>
        </div>

        {/* ── Problem ── */}
        <section style={{ background: '#f7f7f5', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              The problem
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: 1.2, color: '#0a1628', marginBottom: '1.25rem', maxWidth: 720 }}>
              Most professionals know they should be networking. Very few do it strategically.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {[
                'They go to random events and hope the right person shows up.',
                'They collect cards but never build a real follow-up system.',
                'They join organizations without knowing which ones are worth their time.',
                'They don\'t know what to do at events beyond showing up.',
                'They want to stay top of mind but don\'t produce any content.',
                'They network in one city but do business across Texas.',
              ].map(problem => (
                <div key={problem} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#c2410c', fontWeight: 700, flexShrink: 0, marginTop: '2px', fontSize: '1.1rem' }}>✕</span>
                  <p style={{ color: '#1f2a3d', fontSize: '0.975rem', lineHeight: 1.65, margin: 0 }}>{problem}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: '#0a1628', borderRadius: 10 }}>
              <p style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                TBN solves all of this — not with a course to watch, but with personalized, ongoing guidance delivered on a consistent cadence.
              </p>
            </div>
          </div>
        </section>

        {/* ── What you get ── */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              What you get
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: 1.2, color: '#0a1628', marginBottom: '0.5rem' }}>
              A system, an assistant, and an expert — all pointed at the same goal.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#1f2a3d', lineHeight: 1.7, marginBottom: '3rem', maxWidth: 680 }}>
              TBN is built on the Local Business Networking Method — a four-pillar framework for turning your local network into customers. Members get hands-on guidance through all four pillars, not just event recommendations.
            </p>

            {/* Four pillars */}
            {PILLARS.map((pillar, i) => (
              <div key={pillar.label} style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '1.5rem',
                padding: '2rem 0',
                borderTop: '1px solid #e8e8e4',
                alignItems: 'start',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 12,
                  background: i % 2 === 0 ? '#0a1628' : '#c2410c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{pillar.label}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', lineHeight: 1.25, color: '#0a1628', marginBottom: '0.6rem' }}>
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: '0.975rem', lineHeight: 1.75, color: '#1f2a3d', margin: 0 }}>
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}

            {/* AI assistant + Louis */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
              <div style={{ background: '#eef3fe', border: '1px solid #c7d7fc', borderRadius: 10, padding: '1.5rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1652f0', marginBottom: '0.5rem' }}>AI-Powered Assistant</p>
                <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.2rem', color: '#0a1628', marginBottom: '0.5rem' }}>Your personal networking assistant — always on.</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#1f2a3d', margin: 0 }}>
                  Knows your goals, tracks your progress, surfaces events matched to your profile, and checks in weekly: <em>"You set a goal to attend one event. Did you go? Who'd you meet?"</em> The AI handles the cadence so you don't have to.
                </p>
              </div>
              <div style={{ background: '#f7f7f5', border: '1px solid #e8e8e4', borderRadius: 10, padding: '1.5rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.5rem' }}>Direct Access to Louis</p>
                <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.2rem', color: '#0a1628', marginBottom: '0.5rem' }}>Strategy, judgment, and the human moments the AI cannot replace.</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#1f2a3d', margin: 0 }}>
                  Periodic group touchpoints and direct access for guidance, questions, and accountability. Louis knows the local networking landscape in Texas — the right chambers, the right mixers, the right industry groups — better than any individual member does.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Goal ── */}
        <section style={{ background: '#0a1628', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5b82f7', marginBottom: '0.75rem' }}>
              The 12-month goal
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#fff', marginBottom: '1rem', maxWidth: 720 }}>
              100 people in your network who know you, trust you, and send you business.
            </h2>
            <p style={{ color: '#c7d0dd', lineHeight: 1.75, marginBottom: '2.5rem', fontSize: '1.05rem', maxWidth: 680 }}>
              The pace is simple and sustainable: one event a week, two new people per event. That's it. The program is built around making that happen consistently — so you're always the first person someone thinks of when they're ready to buy or refer.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { stat: '52', label: 'Events per year' },
                { stat: '2', label: 'New people per event' },
                { stat: '100+', label: 'Network goal at 12 months' },
                { stat: '2–3%', label: 'Ready to buy at any moment' },
              ].map(({ stat, label }) => (
                <div key={label} style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '2.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>{stat}</p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '1.25rem 1.5rem' }}>
              <p style={{ color: '#e2e8f0', fontSize: '0.975rem', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#fff' }}>The 2–3% reality — and why the math still works.</strong> At any moment, only 2–3% of the people in your network are ready to buy. A real estate agent with 100 warm relationships has 2–3 home sales in the pipeline at all times. An insurance broker with 100 contacts has consistent book-of-business growth. The goal of staying top of mind is simple: when someone enters that window, you are the first person they call.
              </p>
            </div>
          </div>
        </section>

        {/* ── Who it's for ── */}
        <section style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              Who this is for
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: 1.2, color: '#0a1628', marginBottom: '2rem', maxWidth: 680 }}>
              Established professionals where one new relationship can justify months of membership fees.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0a1628', marginBottom: '1rem' }}>TBN is built for</p>
                {[
                  'Real Estate — residential agents, commercial brokers, investors',
                  'Insurance — life, health, commercial, P&C',
                  'Financial Advisory — wealth management, retirement planning',
                  'HR / Staffing / Executive Recruiting',
                  'Technology / IT Services / SaaS',
                  'Mortgage brokers, CPAs, attorneys, and other high-value advisors',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <span style={{ color: '#c2410c', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✓</span>
                    <p style={{ color: '#1f2a3d', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0a1628', marginBottom: '1rem' }}>TBN is not for</p>
                {[
                  'Someone brand new to their industry with no client base yet',
                  'Someone unwilling to attend events or join organizations',
                  'Someone looking for a passive membership to read content',
                  'Someone who sees $100/month as a significant budget question',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✕</span>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item}</p>
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: '#f7f7f5', borderRadius: 8, border: '1px solid #e8e8e4' }}>
                  <p style={{ color: '#1f2a3d', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                    TBN is not open enrollment. Every prospective member goes through a qualifying conversation. Members feel they earned their spot — not that they bought their way in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── A typical month ── */}
        <section style={{ background: '#f7f7f5', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              What membership looks like
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: 1.2, color: '#0a1628', marginBottom: '2rem' }}>
              A typical week as a TBN member.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { day: 'Monday', label: 'Weekly check-in', detail: "Your AI assistant asks: \"You set a goal to attend one event this week. What's on your calendar?\" It surfaces 2–3 events matched to your profile and reminds you who you still owe a follow-up." },
                { day: 'Mid-week', label: 'Event guidance', detail: "You get a short note on what to look for at Thursday's mixer — which industries are likely in the room, a conversation opener worth trying, and a reminder to grab a photo you can post afterward." },
                { day: 'Event night', label: 'You show up — we told you exactly why this room matters', detail: "You already know why this event is worth your time, who you're looking for, and what to do when you find them. You're not just attending. You're working the room." },
                { day: 'Next morning', label: 'Follow-up nudge', detail: "Your assistant checks in: \"You went to the Chamber mixer last night — who'd you meet?\" You log two names. It schedules their follow-up reminder for 48 hours from now and prompts you to post a quick recap." },
                { day: 'End of month', label: 'Progress milestone', detail: "You're at 34 contacts in your network. The system marks the milestone and shows you the pace to 50. Louis sends a short note on what to focus on next." },
              ].map(({ day, label, detail }, i) => (
                <div key={day} style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  background: '#fff',
                  borderRadius: 10,
                  border: '1px solid #e8e8e4',
                  alignItems: 'start',
                }}>
                  <div style={{ textAlign: 'center', paddingTop: '0.15rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c2410c' }}>{day}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: '#0a1628', fontSize: '0.975rem', marginBottom: '0.3rem' }}>{label}</p>
                    <p style={{ color: '#1f2a3d', fontSize: '0.93rem', lineHeight: 1.7, margin: 0 }}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Waitlist form ── */}
        <section id="waitlist" style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '4rem 2rem', scrollMarginTop: '80px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c2410c', marginBottom: '0.75rem' }}>
              Join the waitlist
            </p>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: 1.2, color: '#0a1628', marginBottom: '0.75rem' }}>
              Request a spot in your city.
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#1f2a3d', marginBottom: '2rem' }}>
              Cohorts are capped at 25 members per city. When a spot opens that matches your industry, Louis will reach out directly to schedule a qualifying conversation.
            </p>

            {status === 'success' ? (
              <div style={{ padding: '2rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, textAlign: 'center' }}>
                <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '1.25rem', color: '#166534', marginBottom: '0.5rem' }}>You're on the list.</p>
                <p style={{ color: '#166534', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>
                  Check your inbox for a confirmation. When a spot opens in your city, Louis will reach out directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0a1628', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.975rem', color: '#0a1628', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0a1628', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@yourcompany.com"
                      style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.975rem', color: '#0a1628', boxSizing: 'border-box', outline: 'none' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0a1628', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your City</label>
                  <select
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.975rem', color: city ? '#0a1628' : '#9ca3af', boxSizing: 'border-box', background: '#fff', outline: 'none' }}
                  >
                    <option value="">Select your city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0a1628', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Industry</label>
                  <select
                    required
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.975rem', color: industry ? '#0a1628' : '#9ca3af', boxSizing: 'border-box', background: '#fff', outline: 'none' }}
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                {status === 'error' && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', margin: 0 }}>Something went wrong. Email Louis directly at <a href="mailto:themobilecoach@gmail.com" style={{ color: '#c2410c' }}>themobilecoach@gmail.com</a>.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{ background: status === 'loading' ? '#94a3b8' : '#c2410c', color: '#fff', padding: '0.85rem 1.75rem', borderRadius: 8, fontWeight: 600, fontSize: '0.975rem', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', textAlign: 'center' }}
                >
                  {status === 'loading' ? 'Submitting…' : 'Request my spot →'}
                </button>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                  This is not a purchase. Joining the waitlist starts a conversation. Louis will follow up personally when a spot opens that matches your profile.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section style={{ background: '#0a1628', padding: '3.5rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', color: '#fff', margin: 0 }}>
              Not ready for TBN? Start with the free calendar.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.975rem', lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
              The Local Business Calendars are free for every professional in Texas — 700+ networking events across San Antonio, Austin, Dallas, and Houston, updated every week.
            </p>
            <Link href="/texas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
              Browse events in your city →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
