import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 're_placeholder');
}

export interface OrderEmailData {
  orderId: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
  address: string;
  city: string;
  floorRoom?: string;
  notes?: string;
  items: Array<{
    name: string;
    category: string;
    price: number;
    date: string;
    quantity: number;
  }>;
  totalAmount: number;
  paymentMethod: 'stripe' | 'cash';
  deliveryDates: string[];
  registrationToken?: string;
}

function formatPrice(amount: number): string {
  return '€' + amount.toFixed(2).replace('.', ',');
}

export function buildCustomerEmailHtml(data: OrderEmailData): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hongigebeer.nl';
  const logoUrl = `${baseUrl}/images/hb-logo.png`;

  const soups = data.items.filter((i) => i.category.toLowerCase().includes('zup'));
  const mains = data.items.filter((i) => !i.category.toLowerCase().includes('zup'));

  function buildSection(title: string, items: typeof data.items): string {
    if (items.length === 0) return '';
    const rows = items
      .map(
        (item) =>
          `<tr>
            <td style="padding:10px 16px;border-bottom:1px solid #f0e8da;color:#1C3D1C;font-size:14px;">${item.name}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #f0e8da;text-align:right;color:#999;font-size:13px;white-space:nowrap;">×${item.quantity}</td>
          </tr>`
      )
      .join('');
    return `
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;border-radius:10px;overflow:hidden;">
        <thead>
          <tr style="background:#F5F0E8;">
            <th colspan="2" style="padding:10px 16px;text-align:left;color:#ec8998;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">${title}</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order confirmed – Hongige Beer</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#1C3D1C;border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
      <img src="${logoUrl}" alt="Hongige Beer" width="180" style="display:block;margin:0 auto;max-width:180px;height:auto;">
    </div>

    <!-- Hero band -->
    <div style="background:#ec8998;padding:22px 40px;text-align:center;">
      <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:1px;">&#10003; Order confirmed!</div>
      <div style="font-size:13px;color:#fff;opacity:0.92;margin-top:6px;">Cooked in Poland, delivered to your door.</div>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:40px;border-radius:0 0 16px 16px;box-shadow:0 4px 32px rgba(28,61,28,0.08);">

      <!-- Greeting -->
      <p style="color:#1C3D1C;font-size:17px;font-weight:700;margin:0 0 6px 0;">Hi ${data.customerFirstName}!</p>
      <p style="color:#666;font-size:14px;margin:0 0 32px 0;line-height:1.6;">Your order has been received and confirmed. We will deliver your meals on the dates below.</p>

      <!-- Order number -->
      <div style="background:#F5F0E8;border-radius:12px;padding:18px 24px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:11px;font-weight:700;color:#999;letter-spacing:2px;text-transform:uppercase;">Order number</span>
        <span style="font-size:22px;font-weight:900;color:#1C3D1C;letter-spacing:3px;">#${data.orderId.slice(0, 8).toUpperCase()}</span>
      </div>

      <!-- Delivery info -->
      <div style="border:2px solid #f0e8da;border-radius:12px;padding:22px 24px;margin-bottom:28px;">
        <div style="font-size:10px;font-weight:700;color:#ec8998;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;">Delivery details</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#999;width:120px;vertical-align:top;">Address</td>
            <td style="padding:5px 0;font-size:13px;color:#1C3D1C;font-weight:600;">${data.address}${data.floorRoom ? ', ' + data.floorRoom : ''}<br>${data.city}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#999;vertical-align:top;">Time window</td>
            <td style="padding:5px 0;font-size:13px;color:#1C3D1C;font-weight:700;">12:00 – 14:00</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#999;vertical-align:top;">Delivery days</td>
            <td style="padding:5px 0;font-size:14px;color:#1C3D1C;font-weight:700;">${data.deliveryDates.join(' &nbsp;·&nbsp; ')}</td>
          </tr>
        </table>
      </div>

      <!-- Items -->
      ${buildSection('Soups', soups)}
      ${buildSection('Main dishes', mains)}

      <!-- Total -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:0;">
        <tfoot>
          <tr style="background:#1C3D1C;border-radius:8px;">
            <td style="padding:16px 20px;text-align:right;font-weight:700;color:#FDF6EC;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Total:</td>
            <td style="padding:16px 20px;text-align:right;font-weight:900;color:#ec8998;font-size:22px;white-space:nowrap;width:1%;">${formatPrice(data.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Payment + notes -->
      <div style="background:#F5F0E8;border-radius:12px;padding:18px 24px;margin-top:24px;">
        <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
          <span style="font-weight:700;color:#1C3D1C;">Payment:</span> ${data.paymentMethod === 'stripe' ? 'Card / online' : 'Cash on delivery'}
        </p>
        ${data.notes ? `<p style="margin:8px 0 0;color:#555;font-size:13px;line-height:1.6;"><span style="font-weight:700;color:#1C3D1C;">Notes:</span> ${data.notes}</p>` : ''}
      </div>

      <!-- What's next -->
      <div style="border-left:4px solid #ec8998;padding:16px 20px;margin-top:28px;background:#fffaf5;border-radius:0 8px 8px 0;">
        <p style="margin:0;color:#1C3D1C;font-size:13px;font-weight:700;margin-bottom:6px;">What happens next?</p>
        <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">Your meals are prepared in Poland and transported to the Netherlands. We will deliver them to your address on the confirmed dates between 12:00 and 14:00.</p>
      </div>

      ${data.registrationToken ? `
      <!-- Create account CTA -->
      <div style="background:#1C3D1C;border-radius:12px;padding:22px 24px;margin-top:24px;">
        <p style="margin:0 0 4px 0;color:#ec8998;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Track your order</p>
        <p style="margin:6px 0 14px 0;color:#fff;font-size:14px;line-height:1.6;">Create a free account to track your order history and manage your deliveries in one place.</p>
        <a href="${baseUrl}/register?token=${data.registrationToken}" style="display:inline-block;background:#ec8998;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;">Create account →</a>
      </div>` : ''}

      <!-- Footer -->
      <div style="border-top:1px solid #f0e8da;padding-top:24px;margin-top:32px;text-align:center;">
        <p style="color:#aaa;font-size:12px;margin:0 0 8px 0;">Questions? Contact us:</p>
        <a href="mailto:${process.env.RESTAURANT_EMAIL}" style="color:#1C3D1C;font-weight:700;font-size:13px;text-decoration:none;">${process.env.RESTAURANT_EMAIL}</a>
      </div>

    </div>

    <p style="text-align:center;font-size:11px;color:#bbb;margin-top:20px;line-height:1.6;">
      © Hongige Beer · hongigebeer.nl<br>
      Home-cooked meals for migrants in the Netherlands
    </p>

  </div>
</body>
</html>`;
}

export function buildRestaurantEmailHtml(data: OrderEmailData): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hongigebeer.nl';
  const logoUrl = `${baseUrl}/images/hb-logo.png`;

  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;color:#1C3D1C;font-size:13px;">${item.name}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;color:#666;font-size:13px;">${item.category}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;text-align:center;color:#666;font-size:13px;">${item.date}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;text-align:center;color:#666;font-size:13px;">×${item.quantity}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;text-align:right;color:#ec8998;font-weight:700;font-size:13px;">${formatPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New order – Hongige Beer Admin</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:660px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#1C3D1C;border-radius:16px 16px 0 0;padding:24px 36px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <img src="${logoUrl}" alt="Hongige Beer" width="140" style="display:block;max-width:140px;height:auto;">
          <div style="font-size:10px;font-weight:600;color:#ec8998;letter-spacing:3px;margin-top:8px;text-transform:uppercase;">Admin · New order</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:26px;font-weight:900;color:#ec8998;letter-spacing:2px;">#${data.orderId.slice(0, 8).toUpperCase()}</div>
          <div style="font-size:12px;color:#fff;opacity:0.7;margin-top:4px;">${data.paymentMethod === 'stripe' ? 'Card / online' : 'Cash'} · ${formatPrice(data.totalAmount)}</div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px 36px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(28,61,28,0.08);">

      <!-- Customer -->
      <div style="font-size:10px;font-weight:700;color:#ec8998;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">Customer details</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr>
          <td style="padding:5px 0;font-size:13px;color:#999;width:140px;">Name</td>
          <td style="padding:5px 0;font-size:13px;color:#1C3D1C;font-weight:700;">${data.customerFirstName} ${data.customerLastName}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;font-size:13px;color:#999;">Email</td>
          <td style="padding:5px 0;font-size:13px;color:#1C3D1C;">${data.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;font-size:13px;color:#999;">Phone</td>
          <td style="padding:5px 0;font-size:13px;color:#1C3D1C;">${data.customerPhone}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;font-size:13px;color:#999;">Address</td>
          <td style="padding:5px 0;font-size:13px;color:#1C3D1C;">${data.address}${data.floorRoom ? ', ' + data.floorRoom : ''}, ${data.city}</td>
        </tr>
        <tr>
          <td style="padding:5px 0;font-size:13px;color:#999;">Delivery days</td>
          <td style="padding:5px 0;font-size:13px;color:#1C3D1C;font-weight:700;">${data.deliveryDates.join(' · ')}</td>
        </tr>
        ${data.notes ? `<tr><td style="padding:5px 0;font-size:13px;color:#999;">Notes</td><td style="padding:5px 0;font-size:13px;color:#ec8998;font-style:italic;">${data.notes}</td></tr>` : ''}
      </table>

      <!-- Items -->
      <div style="font-size:10px;font-weight:700;color:#ec8998;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">Order items</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#F5F0E8;">
            <th style="padding:10px 14px;text-align:left;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Meal</th>
            <th style="padding:10px 14px;text-align:left;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Category</th>
            <th style="padding:10px 14px;text-align:center;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Date</th>
            <th style="padding:10px 14px;text-align:center;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Qty</th>
            <th style="padding:10px 14px;text-align:right;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#1C3D1C;">
            <td colspan="4" style="padding:14px;text-align:right;font-weight:700;color:#FDF6EC;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Total:</td>
            <td style="padding:14px;text-align:right;font-weight:900;color:#ec8998;font-size:20px;">${formatPrice(data.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

    </div>

    <p style="text-align:center;font-size:11px;color:#bbb;margin-top:20px;">© Hongige Beer · Order management system · hongigebeer.nl</p>
  </div>
</body>
</html>`;
}

export async function sendOrderEmails(data: OrderEmailData) {
  const restaurantEmail = process.env.RESTAURANT_EMAIL || 'info@hongigebeer.nl';
  const resendClient = getResend();

  await Promise.all([
    resendClient.emails.send({
      from: 'Hongige Beer <noreply@hongigebeer.nl>',
      to: data.customerEmail,
      subject: `Order confirmed #${data.orderId.slice(0, 8).toUpperCase()} – Hongige Beer`,
      html: buildCustomerEmailHtml(data),
    }),
    resendClient.emails.send({
      from: 'Hongige Beer Orders <noreply@hongigebeer.nl>',
      to: restaurantEmail,
      subject: `New order #${data.orderId.slice(0, 8).toUpperCase()} – ${data.customerFirstName} ${data.customerLastName}`,
      html: buildRestaurantEmailHtml(data),
    }),
  ]);
}
