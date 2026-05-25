import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a helpful assistant for Local Business Calendars, a website that tracks business networking events in Texas cities — San Antonio, Austin, Dallas, and Houston.

You help visitors with questions about the site. Keep answers short, friendly, and practical.

Key facts:
- The site is free to use. Free accounts see this week's events.
- Premium ($14.99/month) gives 30 days of events, personalized filters, and a weekly email digest.
- Users can filter by city, cost, time of day, and event category.
- Event categories include: networking, chamber events, real estate, technology, small business, and more.
- To subscribe free: click "Sign Up Free" on any page.
- To upgrade to Premium: go to /upgrade or /pricing.
- To submit an event: go to /submit-event.
- Contact email: michael@localbusinesscalendars.com
- The site covers Texas cities for now, with plans to expand.

If someone reports a bug or technical issue, tell them they can use the Contact tab in this chat or email michael@localbusinesscalendars.com.

If you don't know something, say so simply and suggest they email michael@localbusinesscalendars.com.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI chat not configured' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();

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
        messages,
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
