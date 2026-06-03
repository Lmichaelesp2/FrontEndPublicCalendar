import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a contact extraction assistant. The user will send you an image — either a business card photo or a LinkedIn profile screenshot. Extract contact information and return ONLY a valid JSON object with exactly these keys:

{
  "first_name": string or null,
  "last_name": string or null,
  "company": string or null,
  "title": string or null,
  "email": string or null,
  "phone": string or null,
  "linkedin_url": string or null,
  "topic": string or null
}

Rules:
- Extract only what is clearly visible in the image. Do not guess or infer.
- For LinkedIn screenshots: extract the URL if visible in the browser bar, otherwise null.
- topic: if this is a LinkedIn screenshot, write a 1-sentence summary of what they do based on their headline/about section. For business cards, null.
- Return ONLY the JSON object. No explanation, no markdown, no code blocks.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  try {
    const { imageBase64, mediaType } = await req.json();

    if (!imageBase64 || !mediaType) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
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
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            {
              type: 'text',
              text: 'Extract the contact information from this image.',
            },
          ],
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.content?.[0]?.text ?? '';
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    const parsed = JSON.parse(text);
    return NextResponse.json({ fields: parsed });
  } catch (err) {
    console.error('na-photo-parse error:', err);
    return NextResponse.json({ error: 'Failed to parse image' }, { status: 500 });
  }
}
