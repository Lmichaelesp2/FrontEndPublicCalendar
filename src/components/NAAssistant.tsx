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

const HELP_TABS = [
  {
    key: 'overview',
    label: '📋 Overview',
    content: [
      {
        icon: '🤝',
        title: 'What is this?',
        desc: 'Your personal networking CRM. You meet people at events and in organizations — this app helps you remember them and stay in touch. Open it when you arrive at an event, capture contacts while they\'re fresh, and check your follow-up queue the next day.',
      },
      {
        icon: '⚡',
        title: 'The core loop',
        desc: '1. Save an event or org you\'re attending → 2. Capture contacts while you\'re there → 3. Check your Queue the next day and complete your follow-ups.',
      },
      {
        icon: '💡',
        title: 'Tip for infrequent users',
        desc: 'Even if you only use this once a week, the Queue tab always tells you exactly what to do next. Start there every time you open the app.',
      },
    ],
  },
  {
    key: 'capture',
    label: '🎤 Capturing',
    content: [
      {
        icon: '🎤',
        title: 'Voice (fastest)',
        desc: 'Tap the big voice button and speak naturally: "Her name is Sarah Chen, she\'s a marketing director at HEB, we talked about a potential partnership, I should connect on LinkedIn and follow up next week." Claude fills in all the fields.',
      },
      {
        icon: '📷',
        title: 'Photo / Business Card',
        desc: 'Tap Photo and take a picture of their business card or a screenshot of their LinkedIn profile. Claude reads it and fills in contact details automatically.',
      },
      {
        icon: '✏️',
        title: 'Manual entry',
        desc: 'Fill in the form directly. First name and last name are the only required fields — add whatever else you know.',
      },
      {
        icon: '🏛',
        title: 'Met at an org?',
        desc: 'If you met someone at one of your organizations rather than a public event, tap "In one of my organizations instead →" at the top of the capture screen.',
      },
    ],
  },
  {
    key: 'queue',
    label: '✅ Queue',
    content: [
      {
        icon: '◎',
        title: 'Your daily action list',
        desc: 'Every contact you capture gets follow-up actions added automatically — LinkedIn connect, send email, schedule a call, etc. Your Queue shows what\'s due today and what\'s overdue.',
      },
      {
        icon: '✓',
        title: 'Completing items',
        desc: 'Tap Done when you\'ve completed the action. Tap Snooze to push it back 2 days if you\'re not ready. Tap Skip to remove it without completing.',
      },
      {
        icon: '🔴',
        title: 'Overdue items',
        desc: 'Items that missed their due date show in red at the top. These are the most important — the longer you wait after meeting someone, the colder the connection gets.',
      },
    ],
  },
  {
    key: 'contacts',
    label: '👤 Contacts',
    content: [
      {
        icon: '👤',
        title: 'People tab',
        desc: 'Every contact you\'ve captured. Tap anyone to see their full record — contact info, interaction history, follow-ups, and anyone else you know who\'s connected to them.',
      },
      {
        icon: '🏢',
        title: 'Companies toggle',
        desc: 'Inside My Contacts, switch between People and Companies views. Companies groups your contacts by their employer — useful for knowing how many people you know at a specific organization.',
      },
      {
        icon: '🏷',
        title: 'Contact types',
        desc: 'Tag contacts as Prospect (potential customer), Referral (will send you business), or Connector (well-connected, opens doors). Use these to filter your list.',
      },
      {
        icon: '🔗',
        title: 'Others You Know Here',
        desc: 'On any contact\'s record, scroll down to see other people you\'ve met who work at the same company or belong to the same organization. This helps you understand your relationship network.',
      },
    ],
  },
  {
    key: 'orgs',
    label: '🏛 Orgs & Events',
    content: [
      {
        icon: '🏛',
        title: 'My Organizations',
        desc: 'Add the chambers of commerce, networking groups, and associations you belong to. This lets you tag contacts as "met at [org]" and see all members you\'ve connected with per organization.',
      },
      {
        icon: '📅',
        title: 'My Events',
        desc: 'Save upcoming events you plan to attend. When you arrive, tap Capture on the event to automatically link new contacts to it.',
      },
      {
        icon: '➕',
        title: 'Adding events',
        desc: 'Browse the LBC calendar from the Events tab to find and save local business events. Or create a custom event manually if it\'s not in the calendar.',
      },
    ],
  },
  {
    key: 'ai',
    label: '🤖 AI Assistant',
    content: [
      {
        icon: '🤖',
        title: 'What it knows',
        desc: 'The purple 🤖 button opens your AI assistant. It knows your contacts, your follow-up queue, and your saved events — so you can ask specific questions about your network.',
      },
      {
        icon: '💬',
        title: 'Things to ask',
        desc: '"Who should I follow up with this week?" · "Draft a LinkedIn message to Sarah Chen about the partnership we discussed" · "Which contacts work in marketing?" · "Help me prepare talking points for tonight\'s chamber event"',
      },
      {
        icon: '⚠️',
        title: 'Session limit',
        desc: 'Each session allows up to 15 messages. Refresh the page to start a new session.',
      },
    ],
  },
];

export function NAAssistant({ context, onHelpRef }: { context: NAContext; onHelpRef?: (fn: () => void) => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState('overview');

  useEffect(() => {
    if (onHelpRef) onHelpRef(() => { setShowHelp(true); setHelpTab('overview'); });
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

  const activeTab = HELP_TABS.find(t => t.key === helpTab) ?? HELP_TABS[0];

  return (
    <>
      {/* ── Help modal ── */}
      {showHelp && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9998, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 600, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ background: '#042C53', padding: '18px 20px 0', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#fff' }}>How to use the Networking Assistant</div>
                  <div style={{ fontSize: 12, color: '#6b93b8', marginTop: 2 }}>Tap any section below for a quick guide</div>
                </div>
                <button onClick={() => setShowHelp(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#6b93b8', cursor: 'pointer', lineHeight: 1 }}>✕</button>
              </div>
              {/* Tab pills */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' as const }}>
                {HELP_TABS.map(t => (
                  <button key={t.key} onClick={() => setHelpTab(t.key)} style={{
                    flexShrink: 0, height: 30, padding: '0 12px', borderRadius: 15,
                    border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: helpTab === t.key ? 700 : 500,
                    background: helpTab === t.key ? '#c2410c' : 'rgba(255,255,255,0.12)',
                    color: helpTab === t.key ? '#fff' : '#93b4d4',
                    whiteSpace: 'nowrap' as const,
                  }}>{t.label}</button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 36px' }}>
              {activeTab.content.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: i < activeTab.content.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: '#f0f4ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}

              {/* Footer note */}
              <div style={{ marginTop: 8, padding: '12px 14px', background: '#f8f9fb', borderRadius: 10, fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
                💡 <strong>Reminder:</strong> You don't need to use this every day. Open the app when you go to an event, capture who you met, then check your Queue the next morning. That's the whole workflow.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 138, right: 16, width: 340, maxHeight: '65vh',
          background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          zIndex: 9997, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ background: '#042C53', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>🤖 AI Networking Assistant</div>
              <div style={{ fontSize: 11, color: '#93b4d4' }}>Knows your contacts & events</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#93b4d4', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>

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
                  maxWidth: '85%', padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? '#042C53' : '#f3f4f6',
                  color: m.role === 'user' ? '#fff' : '#111827',
                  fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' as const,
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f3f4f6', borderRadius: '12px 12px 12px 2px', padding: '9px 13px', fontSize: 13, color: '#9ca3af' }}>Thinking…</div>
              </div>
            )}
            {sessionLocked && (
              <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
                Session limit reached. Refresh to start a new conversation.
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '10px 12px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything…"
              disabled={loading || sessionLocked}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' }}
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

      {/* ── Floating button ── */}
      <div style={{ position: 'fixed', bottom: 74, right: 16, zIndex: 9996 }}>
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
