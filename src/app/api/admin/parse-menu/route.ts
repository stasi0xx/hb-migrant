import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, COOKIE_NAME } from '@/lib/admin/auth';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const EXTRACT_SYSTEM = `Jesteś asystentem który ekstrahuje dane z menu restauracji.
Zwróć TYLKO JSON bez żadnego innego tekstu, komentarzy ani bloków markdown.`;

const EXTRACT_USER = `Z tego PDF z menu restauracji "Głodny Niedźwiedź" wyekstrahuj WSZYSTKIE dania na każdy dzień tygodnia.

PDF ma 5 stron (poniedziałek–piątek). Na każdej stronie jest data i nazwa dnia oraz kategorie dań.
Kategorie to: "Kanapki i wrapy", "Śniadania i owsianki", "Zupy", "Obiady", "Sałatki", "Sushi i poke", "Desery i napoje"

Dla każdego dania sprawdź ikony przy nazwie:
- Zielona ikona liścia = is_vege: true
- Czerwona ikona papryczki chili = is_spicy: true
- Brak ikon = oba false

WAŻNE: Wyekstrahuj absolutnie KAŻDE danie – nie opuszczaj żadnego. Skupiaj się szczególnie na kategorii Obiady i Kanapki, gdzie jest ich bardzo dużo.

Zwróć JSON:
{
  "days": [
    {
      "date": "DD.MM.YYYY",
      "day_name": "Poniedziałek",
      "categories": [
        {
          "name": "Kanapki i wrapy",
          "items": [
            { "name": "Pełna nazwa dania po polsku", "price_pln": 14.00, "is_vege": false, "is_spicy": false }
          ]
        }
      ]
    }
  ]
}

Ceny jako liczby (np. 14.00, 8.50). Nie pomijaj ŻADNYCH dań. Wypisz wszystkie.`;

// Price EUR lookup from real data
const PLN_TO_EUR: Record<number, number> = {
  8.5:  3.50,  9.9:  3.75, 10.9: 4.00,
  11.5: 4.00, 11.9: 4.25, 12.0: 4.25,
 12.9:  4.50, 14.0: 4.75, 16.0: 5.25,
 17.9:  5.75, 19.0: 5.75, 20.0: 6.25,
 21.0:  6.50, 22.0: 6.75, 22.9: 7.00,
 24.0:  7.50, 29.0: 8.25, 34.0: 9.50,
};

function getPriceEur(pln: number): number {
  const rounded = Math.round(pln * 10) / 10;
  if (PLN_TO_EUR[rounded] !== undefined) return PLN_TO_EUR[rounded];
  return Math.round((pln / 4.3) * 4) / 4;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('pdf') as File | null;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Brak pliku PDF' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  let extracted: {
    days: {
      date: string;
      day_name: string;
      categories: {
        name: string;
        items: { name: string; price_pln: number; is_vege: boolean; is_spicy: boolean }[];
      }[];
    }[];
  };

  try {
    const response = await (openai.responses as any).create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_file', filename: file.name, file_data: `data:application/pdf;base64,${base64}` },
            { type: 'input_text', text: EXTRACT_USER },
          ],
        },
      ],
      instructions: EXTRACT_SYSTEM,
    });

    const raw = response.output_text.trim();
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    extracted = JSON.parse(cleaned);
  } catch (err: any) {
    return NextResponse.json({ error: 'Błąd ekstrakcji PDF', detail: err?.message }, { status: 500 });
  }

  // Add EUR prices and base PL translations — NO language translation here
  const result = {
    days: extracted.days.map((day) => ({
      ...day,
      categories: day.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({
          ...item,
          price_eur: getPriceEur(item.price_pln),
          name_translations: { pl: item.name },
        })),
      })),
    })),
  };

  return NextResponse.json(result);
}
