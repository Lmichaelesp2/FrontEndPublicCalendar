import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

  try {
    const { messages, context } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Build context summary for the system prompt
    const queueSummary = context?.followUps?.length
      ? `Follow-up queue: ${context.followUps.slice(0, 10).map((f: any) =>
          `${f.na_persons?.first_name ?? ''} ${f.na_persons?.last_name ?? ''} (${f.action_type}, due ${f.due_date})`
        ).join('; ')}`
      : 'No pending follow-ups.';

    const contactsSummary = context?.persons?.length
      ? `Contacts: ${context.persons.slice(0, 15).map((p: any) =>
          `${p.first_name} ${p.last_name ?? ''} at ${p.company ?? 'unknown company'} (${p.relationship_status})`
        ).join('; ')}`
      : 'No contacts yet.';

    const eventsSummary = context?.events?.length
      ? `Upcoming events: ${context.events.slice(0, 5).map((e: any) =>
          `${e.event_name} on ${e.event_date}`
        ).join('; ')}`
      : 'No upcoming events.';

    const SYSTEM_PROMPT = `You are a premium AI networking assistant built into the Local Business Calendars Networking Assistant app. You help the user — a professional networker — manage their contacts, follow-ups, and event strategy.

You have access to their real data:
${queueSummary}
${contactsSummary}
${eventsSummary}

Your capabilities:
- Prioritize their follow-up queue and explain why
- Draft personalized LinkedIn messages or emails based on what they talked about
- Suggest who to reconnect with and when
- Help them prepare for upcoming events
- Answer questions about how the app works
- Give networking advice specific to their situation

Rules:
- Be concise and direct — they're busy professionals
- Reference their actual contacts and events by name when relevant
- Never make up contacts or events not in their data
- For message drafts, keep them warm, brief, and personal
- Max 3-4 sentences unless drafting a message
- If they ask something outside networking/this app, politely redirect`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-8), // last 4 back-and-forth
      }),
    });

    if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);

    const data = await response.json();
    const text = data.content?.[0]?.text ?? 'Sorry, something went wrong.';
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('na-assistant error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
