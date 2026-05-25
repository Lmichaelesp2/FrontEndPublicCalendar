import { NextRequest, NextResponse } from 'next/server';

const MAX_MESSAGES = 10;       // max user messages per session
const MAX_INPUT_CHARS = 400;   // max characters per user message
const HISTORY_WINDOW = 6;      // max messages sent to API (3 back-and-forth)

const SYSTEM_PROMPT = `You are a focused help assistant for Local Business Calendars — a site that lists business networking events in Texas cities (San Antonio, Austin, Dallas, Houston).

Your ONLY job is to answer questions directly about this website and its events. You must refuse any question that is not about this site, its events, pricing, or how to use it.

If asked anything off-topic (general advice, other websites, coding, politics, recipes, random facts, anything unrelated to this calendar site), respond with:
"I can only help with questions about Local Business Calendars. Try asking about events, pricing, how to subscribe, or how to submit an event."

Key facts:
- Free accounts see this week's events only.
- Premium ($14.99/month): 30 days of events, personalized filters, weekly email digest.
- Filter by: city, cost, time of day, event category.
- Event categories: networking, chamber events, real estate, technology, small business.
- Sign up free: click "Sign Up Free" on any page.
- Upgrade to Premium: go to /pricing.
- Submit an event: go to /submit-event.
- Cities covered: San Antonio, Austin, Dallas, Houston (Texas only for now).
- Contact: michael@localbusinesscalendars.com

Keep answers short — 2 to 4 sentences max. No lists unless essential. If you don't know something specific, say so and suggest emailing michael@localbusinesscalendars.com.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI chat not configured' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    // Guard: session message limit (count only user messages)
    const userMessageCount = messages.filter((m: { role: string }) => m.role === 'user').length;
    if (userMessageCount > MAX_MESSAGES) {
      return NextResponse.json({ error: 'SESSION_LIMIT' }, { status: 429 });
    }

    // Guard: input length on the latest user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user' && typeof lastMessage.content === 'string') {
      if (lastMessage.content.length > MAX_INPUT_CHARS) {
        return NextResponse.json({ error: 'INPUT_TOO_LONG' }, { status: 400 });
      }
    }

    // Trim history: only send the last HISTORY_WINDOW messages to the API
    const trimmedMessages = messages.slice(-HISTORY_WINDOW);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: trimmedMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? 'Sorry, I couldn\'t generate a response.';

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
