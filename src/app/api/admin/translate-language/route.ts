import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin/auth';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANG_NAMES: Record<string, string> = {
  en: 'English',
  nl: 'Dutch (Nederlands)',
  de: 'German (Deutsch)',
  fr: 'French (Français)',
  es: 'Spanish (Español)',
  it: 'Italian (Italiano)',
  pt: 'Portuguese (Português)',
  cs: 'Czech (Čeština)',
  hu: 'Hungarian (Magyar)',
  ro: 'Romanian (Română)',
  bg: 'Bulgarian (Български)',
};

const BATCH_SIZE = 30; // Per-language = much less output, can use larger batches

async function translateBatch(
  names: string[],
  langCode: string,
  langName: string
): Promise<Record<string, string>> {
  const prompt = `Przetłumacz poniższe ${names.length} nazw dań restauracyjnych na język: ${langName} (kod: ${langCode}).

Zwróć TYLKO JSON (bez markdown) w formacie:
{
  "translations": {
    "Polska nazwa dania": "Tłumaczenie"
  }
}

Dania:
${names.map((n, i) => `${i + 1}. ${n}`).join('\n')}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Jesteś tłumaczem kulinarnym. Tłumacz tylko na ${langName}. Zwróć TYLKO poprawny JSON bez markdown.`,
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.1,
    max_tokens: 4000,
  });

  const raw = response.choices[0].message.content?.trim() ?? '';
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const parsed = JSON.parse(cleaned);
  return parsed.translations as Record<string, string>;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { names, language } = body as { names: string[]; language: string };

  if (!names?.length || !language) {
    return NextResponse.json({ error: 'Brak danych' }, { status: 400 });
  }

  const langName = LANG_NAMES[language];
  if (!langName) {
    return NextResponse.json({ error: `Nieznany język: ${language}` }, { status: 400 });
  }

  // Split into batches
  const chunks: string[][] = [];
  for (let i = 0; i < names.length; i += BATCH_SIZE) {
    chunks.push(names.slice(i, i + BATCH_SIZE));
  }

  // Run batches sequentially to avoid rate limits (single language = faster per-batch)
  const result: Record<string, string> = {};
  for (const chunk of chunks) {
    try {
      const batchResult = await translateBatch(chunk, language, langName);
      Object.assign(result, batchResult);
    } catch (err: any) {
      console.error(`Batch failed for ${language}:`, err?.message);
      // Continue with remaining batches
    }
  }

  return NextResponse.json({ language, translations: result });
}
