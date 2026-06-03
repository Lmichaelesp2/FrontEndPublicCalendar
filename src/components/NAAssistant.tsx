'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface NAContext {
  followUps: any[];
  persons: any[];
  events: any[];
}

const SUGGESTIONS = [
  'Who should I follow up with today?',
  'Draft a LinkedIn message to my last contact',
  'What events should I go to this week?',
  'Help me prepare for my next event',
];

export function NAAssistant({ context, onHelpRef }: { context: NAContext; onHelpRef?: (fn: () => void) => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (onHelpRef) onHelpRef(() => setShowHelp(true));
  }, [onHelpRef]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userTurns = messages.filter(m => m.role === 'user').length;
  const sessionLocked = userTurns >= 15;

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading || sessionLocked) return;
    setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/na-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply ?? 'Sorry, something went wrong.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Help modal */}
      {showHelp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowHelp(false)}>
          <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: '24px 20px 40px', maxWidth: 600, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#042C53' }}>How to use the Networking Assistant</div>
              <button onClick={() => setShowHelp(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#9ca3af', cursor: 'pointer' }}>✕</button>
            </div>
            {[
              { icon: '📅', title: 'My Events', desc: 'Add events from the LBC calendar or create your own. Tap Capture on an event to start capturing contacts.' },
              { icon: '🎤', title: 'Voice Capture', desc: 'Tap Start and speak naturally — name, company, title, email, what you talked about, and how to follow up. Claude fills in the fields.' },
              { icon: '📷', title: 'Photo Capture', desc: 'Take a photo of a business card or upload a LinkedIn screenshot. Claude reads it and fills in the contact fields.' },
              { icon: '✅', title: 'Follow-Up Queue', desc: 'Every contact you capture gets follow-up actions queued automatically. Check your queue daily and mark items done as you complete them.' },
              { icon: '👤', title: 'Contacts', desc: 'All your captured contacts in one place. Tap any contact to view their full record, edit details, or see your interaction history.' },
              { icon: '🤖', title: 'AI Assistant', desc: 'Tap the purple button below to ask your AI assistant anything — who to follow up with, help drafting messages, event prep, and more.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{ fontSize: 24, flexShrink: 0, width: 32, textAlign: 'center' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 80, right: 16, width: 340, maxHeight: '70vh',
          background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          zIndex: 9997, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}>
          {/* Header */}
          <div style={{ background: '#042C53', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>🤖 AI Networking Assistant</div>
              <div style={{ fontSize: 11, color: '#93b4d4' }}>Premium · Knows your contacts & events</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#93b4d4', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12, lineHeight: 1.5 }}>
                  Hi! I know your contacts, queue, and events. Ask me anything:
                </div>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    width: '100%', textAlign: 'left' as const, background: '#f8faff', border: '1px solid #e0e7ff',
                    borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#4338ca', cursor: 'pointer',
                    marginBottom: 6, fontWeight: 500,
                  }}>{s}</button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '9px 13px', borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? '#042C53' : '#f3f4f6',
                  color: m.role === 'user' ? '#fff' : '#111827',
                  fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' as const,
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f3f4f6', borderRadius: '12px 12px 12px 2px', padding: '9px 13px', fontSize: 13, color: '#9ca3af' }}>
                  Thinking…
                </div>
              </div>
            )}

            {sessionLocked && (
              <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
                Session limit reached. Refresh to start a new conversation.
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything…"
              disabled={loading || sessionLocked}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb',
                fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim() || sessionLocked} style={{
              height: 36, width: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: input.trim() && !loading ? '#042C53' : '#e5e7eb',
              color: input.trim() && !loading ? '#fff' : '#9ca3af',
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>→</button>
          </div>
        </div>
      )}

      {/* AI assistant floating button only */}
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9996 }}>
        <button onClick={() => setOpen(o => !o)} style={{
          width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: open ? '#042C53' : '#7c3aed', color: '#fff', fontSize: 22,
          boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} title="AI Assistant">
          {open ? '✕' : '🤖'}
        </button>
      </div>
    </>
  );
}
