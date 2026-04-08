import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getSiteConfig } from '@/config/sites';

export const revalidate = 60; // revalidate every 60s

export async function GET() {
  const supabase = createServerSupabaseClient();

  // Find the currently published week
  const { data: week } = await supabase
    .from('menu_weeks')
    .select('id')
    .eq('status', 'published')
    .order('week_start', { ascending: false })
    .limit(1)
    .single();

  if (!week) {
    return NextResponse.json({ menu: null });
  }

  const { data: items, error } = await supabase
    .from('menu_items')
    .select('date, day_name, category, name, name_translations, price, price_pln, price_eur, is_vege, is_spicy')
    .eq('week_id', week.id)
    .order('position');

  if (error || !items) {
    return NextResponse.json({ menu: null });
  }

  // Transform to menu.json format:
  // { "DD.MM.YYYY": { "Kategoria": [{ nazwa, name_translations, cena, is_vege, is_spicy }] } }
  const menu: Record<string, Record<string, { nazwa: string; name_translations: any; cena: string; is_vege: boolean; is_spicy: boolean }[]>> = {};

  const siteConfig = getSiteConfig();
  const isEur = siteConfig.currency === 'EUR';

  for (const item of items) {
    if (!menu[item.date]) menu[item.date] = {};
    if (!menu[item.date][item.category]) menu[item.date][item.category] = [];

    let currentPrice: number;
    let currencySuffix: string;

    if (isEur) {
      currentPrice = item.price_eur ?? item.price;
      currencySuffix = ' €';
    } else {
      currentPrice = item.price_pln ?? item.price;
      currencySuffix = ' zł';
    }

    const priceStr = currentPrice.toFixed(2).replace('.', ',').replace(/,?0+$/, '').replace(/,$/, '') + currencySuffix;
    
    menu[item.date][item.category].push({
      nazwa: item.name,
      name_translations: item.name_translations || { pl: item.name },
      cena: priceStr,
      is_vege: item.is_vege,
      is_spicy: item.is_spicy,
    });
  }

  return NextResponse.json({ menu });
}
