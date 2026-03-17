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
}

function formatPrice(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' zł';
}

const bearSvg = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="14" cy="14" r="9" fill="#E8967A"/>
  <circle cx="50" cy="14" r="9" fill="#E8967A"/>
  <circle cx="14" cy="14" r="5" fill="#c47560"/>
  <circle cx="50" cy="14" r="5" fill="#c47560"/>
  <circle cx="32" cy="34" r="22" fill="#E8967A"/>
  <ellipse cx="32" cy="42" rx="9" ry="6" fill="#c47560"/>
  <circle cx="24" cy="30" r="3" fill="#1C3D1C"/>
  <circle cx="40" cy="30" r="3" fill="#1C3D1C"/>
  <ellipse cx="32" cy="39" rx="3" ry="2" fill="#1C3D1C"/>
</svg>`;

export function buildCustomerEmailHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;color:#1C3D1C;font-size:14px;">${item.name}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;text-align:center;color:#555;font-size:13px;">${item.date}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;text-align:center;color:#555;font-size:13px;">×${item.quantity}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0e8da;text-align:right;color:#E8967A;font-weight:bold;font-size:14px;">${formatPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Potwierdzenie zamówienia – Głodny Niedźwiedź</title></head>
<body style="margin:0;padding:0;background:#FDF6EC;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:#1C3D1C;border-radius:20px 20px 0 0;padding:36px 32px;text-align:center;">
      <div style="display:inline-block;background:#E8967A;border-radius:50%;width:72px;height:72px;line-height:72px;text-align:center;margin-bottom:16px;">
        ${bearSvg}
      </div>
      <div style="font-size:36px;font-weight:900;color:#FDF6EC;letter-spacing:4px;line-height:1;">GN</div>
      <div style="font-size:11px;font-weight:700;color:#E8967A;letter-spacing:4px;margin-top:6px;text-transform:uppercase;">Głodny Niedźwiedź · Est. 2018 Catering</div>
    </div>

    <!-- Hero band -->
    <div style="background:#E8967A;padding:20px 32px;text-align:center;">
      <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:1px;">ZAMÓWIENIE PRZYJĘTE!</div>
      <div style="font-size:13px;color:#fff;opacity:0.9;margin-top:4px;">The best office catering.</div>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px;border-radius:0 0 20px 20px;box-shadow:0 4px 24px rgba(28,61,28,0.10);">

      <!-- Greeting -->
      <p style="color:#1C3D1C;font-size:16px;margin:0 0 4px 0;">Cześć <strong>${data.customerFirstName}</strong>!</p>
      <p style="color:#555;font-size:14px;margin:0 0 24px 0;">Twoje zamówienie zostało przyjęte i jest w trakcie realizacji.</p>

      <!-- Order number -->
      <div style="background:#FDF6EC;border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:12px;font-weight:700;color:#888;letter-spacing:2px;text-transform:uppercase;">Numer zamówienia</span>
        <span style="font-size:20px;font-weight:900;color:#1C3D1C;letter-spacing:3px;">#${data.orderId.slice(0, 8).toUpperCase()}</span>
      </div>

      <!-- Delivery info -->
      <div style="border:2px solid #f0e8da;border-radius:12px;padding:20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#E8967A;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">Dostawa</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#888;width:120px;">Firma</td>
            <td style="padding:3px 0;font-size:13px;color:#1C3D1C;font-weight:700;">${data.companyName}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#888;">Adres</td>
            <td style="padding:3px 0;font-size:13px;color:#1C3D1C;">${data.address}${data.floorRoom ? ', ' + data.floorRoom : ''}, ${data.city}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#888;">Okno dostawy</td>
            <td style="padding:3px 0;font-size:13px;color:#1C3D1C;font-weight:700;">12:00 – 14:00</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#888;">Dni</td>
            <td style="padding:3px 0;font-size:13px;color:#1C3D1C;">${data.deliveryDates.join(' · ')}</td>
          </tr>
        </table>
      </div>

      <!-- Items -->
      <div style="font-size:11px;font-weight:700;color:#E8967A;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">Zamówione pozycje</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:0;">
        <thead>
          <tr style="background:#FDF6EC;">
            <th style="padding:8px 14px;text-align:left;color:#1C3D1C;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Danie</th>
            <th style="padding:8px 14px;text-align:center;color:#1C3D1C;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Data</th>
            <th style="padding:8px 14px;text-align:center;color:#1C3D1C;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Szt.</th>
            <th style="padding:8px 14px;text-align:right;color:#1C3D1C;font-size:11px;letter-spacing:1px;text-transform:uppercase;">Cena</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#1C3D1C;border-radius:0 0 8px 8px;">
            <td colspan="3" style="padding:14px;text-align:right;font-weight:900;color:#FDF6EC;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Razem:</td>
            <td style="padding:14px;text-align:right;font-weight:900;color:#E8967A;font-size:20px;">${formatPrice(data.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Payment + notes -->
      <div style="background:#FDF6EC;border-radius:12px;padding:16px 20px;margin-top:20px;">
        <p style="margin:0;color:#555;font-size:13px;">
          <span style="font-weight:700;color:#1C3D1C;">Płatność:</span> ${data.paymentMethod === 'stripe' ? 'Karta / online' : 'Gotówka przy dostawie'}
        </p>
        ${data.notes ? `<p style="margin:8px 0 0;color:#555;font-size:13px;"><span style="font-weight:700;color:#1C3D1C;">Uwagi:</span> ${data.notes}</p>` : ''}
      </div>

      <!-- Footer -->
      <p style="color:#aaa;font-size:12px;margin-top:28px;text-align:center;border-top:1px solid #f0e8da;padding-top:20px;">
        Pytania? Napisz do nas: <a href="mailto:${process.env.RESTAURANT_EMAIL}" style="color:#1C3D1C;font-weight:700;">${process.env.RESTAURANT_EMAIL}</a>
      </p>
    </div>

    <p style="text-align:center;font-size:11px;color:#bbb;margin-top:16px;">© Głodny Niedźwiedź Catering · Est. 2018</p>
  </div>
</body>
</html>`;
}

export function buildRestaurantEmailHtml(data: OrderEmailData): string {
  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8da;color:#1C3D1C;font-size:13px;">${item.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8da;color:#555;font-size:13px;">${item.category}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8da;text-align:center;color:#555;font-size:13px;">${item.date}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8da;text-align:center;color:#555;font-size:13px;">×${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8da;text-align:right;color:#E8967A;font-weight:bold;font-size:13px;">${formatPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Nowe zamówienie – GN Admin</title></head>
<body style="margin:0;padding:0;background:#FDF6EC;font-family:Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:#1C3D1C;border-radius:16px 16px 0 0;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:28px;font-weight:900;color:#FDF6EC;letter-spacing:4px;line-height:1;">GN</div>
        <div style="font-size:10px;font-weight:700;color:#E8967A;letter-spacing:3px;margin-top:4px;text-transform:uppercase;">Admin · Nowe zamówienie</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:22px;font-weight:900;color:#E8967A;letter-spacing:2px;">#${data.orderId.slice(0, 8).toUpperCase()}</div>
        <div style="font-size:12px;color:#fff;opacity:0.7;margin-top:2px;">${data.paymentMethod === 'stripe' ? 'Karta / online' : 'Gotówka'} · ${formatPrice(data.totalAmount)}</div>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:28px 32px;border-radius:0 0 16px 16px;box-shadow:0 4px 20px rgba(28,61,28,0.10);">

      <!-- Customer -->
      <div style="font-size:11px;font-weight:700;color:#E8967A;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">Dane klienta</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#888;width:130px;">Imię i nazwisko</td>
          <td style="padding:4px 0;font-size:13px;color:#1C3D1C;font-weight:700;">${data.customerFirstName} ${data.customerLastName}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#888;">Email</td>
          <td style="padding:4px 0;font-size:13px;color:#1C3D1C;">${data.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#888;">Telefon</td>
          <td style="padding:4px 0;font-size:13px;color:#1C3D1C;">${data.customerPhone}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#888;">Firma</td>
          <td style="padding:4px 0;font-size:13px;color:#1C3D1C;">${data.companyName}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#888;">Adres</td>
          <td style="padding:4px 0;font-size:13px;color:#1C3D1C;">${data.address}${data.floorRoom ? ', ' + data.floorRoom : ''}, ${data.city}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#888;">Dni dostawy</td>
          <td style="padding:4px 0;font-size:13px;color:#1C3D1C;font-weight:700;">${data.deliveryDates.join(' · ')}</td>
        </tr>
        ${data.notes ? `<tr><td style="padding:4px 0;font-size:13px;color:#888;">Uwagi</td><td style="padding:4px 0;font-size:13px;color:#E8967A;font-style:italic;">${data.notes}</td></tr>` : ''}
      </table>

      <!-- Items -->
      <div style="font-size:11px;font-weight:700;color:#E8967A;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">Pozycje zamówienia</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#FDF6EC;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Danie</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Kat.</th>
            <th style="padding:8px 12px;text-align:center;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Data</th>
            <th style="padding:8px 12px;text-align:center;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Szt.</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:#1C3D1C;letter-spacing:1px;text-transform:uppercase;">Cena</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#1C3D1C;">
            <td colspan="4" style="padding:12px;text-align:right;font-weight:900;color:#FDF6EC;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Razem:</td>
            <td style="padding:12px;text-align:right;font-weight:900;color:#E8967A;font-size:18px;">${formatPrice(data.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p style="text-align:center;font-size:11px;color:#bbb;margin-top:16px;">© Głodny Niedźwiedź Catering · System zamówień</p>
  </div>
</body>
</html>`;
}

export async function sendOrderEmails(data: OrderEmailData) {
  const restaurantEmail = process.env.RESTAURANT_EMAIL || 'trolstachulec@gmail.com';
  const resendClient = getResend();

  await Promise.all([
    resendClient.emails.send({
      from: 'Głodny Niedźwiedź <noreply@szkolaonline.com>',
      to: data.customerEmail,
      subject: `Potwierdzenie zamówienia #${data.orderId.slice(0, 8).toUpperCase()} – Głodny Niedźwiedź`,
      html: buildCustomerEmailHtml(data),
    }),
    resendClient.emails.send({
      from: 'System zamówień <noreply@szkolaonline.com>',
      to: restaurantEmail,
      subject: `Nowe zamówienie #${data.orderId.slice(0, 8).toUpperCase()} – ${data.customerFirstName} ${data.customerLastName}`,
      html: buildRestaurantEmailHtml(data),
    }),
  ]);
}
