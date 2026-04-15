import { Resend } from 'resend';
import { createServerSupabaseClient } from '@/lib/supabase';
import { checkDelivery } from './delivery-zones';

interface MenuItem {
  date: string;
  day_name: string;
  category: string;
  name: string;
  name_translations: Record<string, string> | null;
  is_vege: boolean;
  is_spicy: boolean;
}

async function fetchCurrentMenuItems(): Promise<MenuItem[]> {
  const supabase = createServerSupabaseClient();

  const { data: week } = await supabase
    .from('menu_weeks')
    .select('id')
    .eq('status', 'published')
    .order('week_start', { ascending: false })
    .limit(1)
    .single();

  if (!week) return [];

  const { data: items } = await supabase
    .from('menu_items')
    .select('date, day_name, category, name, name_translations, is_vege, is_spicy')
    .eq('week_id', week.id)
    .order('position');

  return (items as MenuItem[]) ?? [];
}

function formatItemsForLLM(items: MenuItem[], preferences: string): string {
  const lower = preferences.toLowerCase();
  const wantsVege = /vege|vegetarian|wegetarian|vegetar|vegeta|вегет|növény|rostlin/i.test(preferences);
  const wantsSpicy = /spicy|pikant|острo|pikantní/i.test(preferences);

  const filtered = items.filter((item) => {
    if (wantsVege && !item.is_vege) return false;
    if (wantsSpicy && !item.is_spicy) return false;
    return true;
  });

  const toShow = filtered.length > 0 ? filtered : items;

  // Group by date
  const byDate: Record<string, { category: string; name: string; is_vege: boolean; is_spicy: boolean }[]> = {};
  for (const item of toShow) {
    if (!byDate[item.date]) byDate[item.date] = [];
    byDate[item.date].push({ category: item.category, name: item.name, is_vege: item.is_vege, is_spicy: item.is_spicy });
  }

  const lines: string[] = [];
  for (const [date, dayItems] of Object.entries(byDate)) {
    lines.push(`${date}:`);
    for (const d of dayItems) {
      const tags = [d.is_vege ? '🌱 vege' : null, d.is_spicy ? '🌶 spicy' : null].filter(Boolean).join(', ');
      lines.push(`  • [${d.category}] ${d.name}${tags ? ` (${tags})` : ''}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

async function handleSearchMenu(preferences: string): Promise<string> {
  const items = await fetchCurrentMenuItems();

  if (items.length === 0) {
    return 'No menu is currently published. Tell the customer the menu will be available soon and suggest they check back.';
  }

  const formatted = formatItemsForLLM(items, preferences);

  return `Current published menu (filter: "${preferences}"):\n\n${formatted}`;
}

function handleCheckDelivery(city: string): string {
  const result = checkDelivery(city);

  if (result.available && result.city) {
    const note = result.note ?? `We deliver to ${result.city}.`;
    return `DELIVERY AVAILABLE: ${note}`;
  }

  return (
    `DELIVERY NOT AVAILABLE to "${city}". ` +
    `We currently deliver to: Tilburg, Den Bosch, Eindhoven, Venlo. ` +
    `Ask the customer if any of these cities works for them, or suggest they contact us if they are nearby.`
  );
}

async function handleReportProblem(
  customerName: string,
  customerEmail: string,
  problem: string,
): Promise<string> {
  const restaurantEmail = process.env.RESTAURANT_EMAIL || 'info@hongigebeer.nl';

  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

    await resend.emails.send({
      from: 'Hongige Beer Chat <noreply@hongigebeer.nl>',
      to: restaurantEmail,
      subject: `Customer problem — ${customerName}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Customer Problem Report</title></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    <div style="background:#1C3D1C;border-radius:12px 12px 0 0;padding:24px 32px;">
      <div style="font-size:11px;font-weight:700;color:#ec8998;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Hongige Beer</div>
      <div style="font-size:20px;font-weight:900;color:#fff;">Customer Problem Report</div>
      <div style="font-size:12px;color:#fff;opacity:0.6;margin-top:4px;">Submitted via chat assistant</div>
    </div>
    <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(28,61,28,0.08);">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#999;width:110px;vertical-align:top;text-transform:uppercase;letter-spacing:1px;">Name</td>
          <td style="padding:10px 0;font-size:14px;color:#1C3D1C;font-weight:700;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#999;vertical-align:top;text-transform:uppercase;letter-spacing:1px;">Email</td>
          <td style="padding:10px 0;font-size:14px;color:#1C3D1C;">
            <a href="mailto:${customerEmail}" style="color:#1C3D1C;">${customerEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#999;vertical-align:top;text-transform:uppercase;letter-spacing:1px;">Problem</td>
          <td style="padding:10px 0;font-size:14px;color:#1C3D1C;line-height:1.6;">${problem}</td>
        </tr>
      </table>
    </div>
    <p style="text-align:center;font-size:11px;color:#bbb;margin-top:20px;">© Hongige Beer · hongigebeer.nl</p>
  </div>
</body>
</html>`,
    });

    return 'REPORT_SENT: The problem report was sent successfully to the team.';
  } catch (err) {
    console.error('[report_problem] Failed to send email:', err);
    return `REPORT_FAILED: Email could not be sent. Tell the customer to contact us directly at ${restaurantEmail}.`;
  }
}

export async function handleToolCall(name: string, input: Record<string, string>): Promise<string> {
  if (name === 'search_menu') {
    return handleSearchMenu(input.preferences);
  }
  if (name === 'check_delivery') {
    return handleCheckDelivery(input.city);
  }
  if (name === 'report_problem') {
    return handleReportProblem(input.customer_name, input.customer_email, input.problem);
  }
  return 'Unknown tool.';
}
