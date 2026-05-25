'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'ai' | 'contact'>('ai');

  // AI chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || 'Sorry, something went wrong.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError('Failed to send. Please email michael@localbusinesscalendars.com directly.');
      }
    } catch {
      setError('Failed to send. Please email michael@localbusinesscalendars.com directly.');
    } finally {
      setSending(false);
    }
  }

  const btnStyle: React.CSSProperties = {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
    width: '52px', height: '52px', borderRadius: '50%',
    background: '#c2410c', color: '#fff', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(194,65,12,0.35)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed', bottom: '88px', right: '24px', zIndex: 9998,
    width: '340px', maxWidth: 'calc(100vw - 32px)',
    background: '#fff', borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
    border: '1px solid #e5e5e5',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    maxHeight: '480px',
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={panelStyle}>
          {/* Header */}
          <div style={{ background: '#c2410c', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Help</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '0' }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            {(['ai', 'contact'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px', border: 'none', background: 'none',
                fontSize: '13px', fontWeight: tab === t ? 700 : 500,
                color: tab === t ? '#c2410c' : '#888',
                borderBottom: tab === t ? '2px solid #c2410c' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {t === 'ai' ? '✦ Ask AI' : '✉ Contact Us'}
              </button>
            ))}
          </div>

          {/* AI tab */}
          {tab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.length === 0 && (
                  <div style={{ color: '#888', fontSize: '13px', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
                    Ask me anything about the calendar — how it works, pricing, events, or how to subscribe.
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    background: m.role === 'user' ? '#c2410c' : '#f3f4f6',
                    color: m.role === 'user' ? '#fff' : '#111',
                    padding: '9px 13px', borderRadius: '12px',
                    fontSize: '13px', maxWidth: '85%', lineHeight: 1.5,
                  }}>
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div style={{ alignSelf: 'flex-start', background: '#f3f4f6', padding: '9px 13px', borderRadius: '12px', fontSize: '13px', color: '#888' }}>
                    Thinking…
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ padding: '10px 12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask a question…"
                  style={{
                    flex: 1, border: '1px solid #ddd', borderRadius: '8px',
                    padding: '9px 12px', fontSize: '13px', outline: 'none',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{
                    background: loading || !input.trim() ? '#e5a07a' : '#c2410c',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '9px 14px', fontSize: '13px', fontWeight: 700,
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Contact tab */}
          {tab === 'contact' && (
            <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>✓</div>
                  <p style={{ fontWeight: 700, color: '#111', margin: '0 0 6px' }}>Message sent!</p>
                  <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>We'll get back to you at {email}.</p>
                </div>
              ) : (
                <form onSubmit={submitContact} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', outline: 'none' }}
                  />
                  <input
                    required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                    style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', outline: 'none' }}
                  />
                  <textarea
                    required value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    rows={4}
                    style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                  />
                  {error && <p style={{ color: '#c2410c', fontSize: '12px', margin: 0 }}>{error}</p>}
                  <button
                    type="submit" disabled={sending}
                    style={{
                      background: sending ? '#e5a07a' : '#c2410c', color: '#fff',
                      border: 'none', borderRadius: '8px', padding: '11px',
                      fontSize: '14px', fontWeight: 700,
                      cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={btnStyle}
        aria-label="Open help chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>
    </>
  );
}
