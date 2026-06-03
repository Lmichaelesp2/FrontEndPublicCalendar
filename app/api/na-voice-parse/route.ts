import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a contact extraction assistant for a networking CRM app. The user will give you a voice transcript spoken at a networking event. Extract the following fields and return ONLY a valid JSON object with exactly these keys:

{
  "first_name": string or null,
  "last_name": string or null,
  "company": string or null,
  "title": string or null,
  "email": string or null,
  "phone": string or null,
  "topic": string or null,
  "follow_up_action": one of ["linkedin_connect","linkedin_message","email","call","reminder"] or null,
  "follow_up_days": number (1, 2, 3, 7, or 14) or null
}

Rules:
- Extract only what is clearly stated. Do not infer or guess.
- For follow_up_action: "connect on linkedin" or "add on linkedin" = linkedin_connect; "message on linkedin" = linkedin_message; "send email" or "email them" = email; "call" or "give them a call" = call; "remind me" = reminder. If multiple actions mentioned, pick the most specific one.
- For follow_up_days: "tomorrow" = 1, "2 days" = 2, "this week" = 3, "next week" = 7, "2 weeks" = 14. If unclear, return null.
- topic should be a concise summary of what was discussed (1-2 sentences max).
- Return ONLY the JSON object. No explanation, no markdown, no code blocks.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 3) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    if (transcript.length > 2000) {
      return NextResponse.json({ error: 'Transcript too long' }, { status: 400 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: transcript.trim() }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.content?.[0]?.text ?? '';

    // Strip markdown code fences if Claude wrapped the JSON
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    // Parse the JSON response from Claude
    const parsed = JSON.parse(text);
    return NextResponse.json({ fields: parsed });
  } catch (err) {
    console.error('na-voice-parse error:', err);
    return NextResponse.json({ error: 'Failed to parse transcript' }, { status: 500 });
  }
}
