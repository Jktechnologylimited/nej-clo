import { formatPrice } from "@/lib/currency";

const shell = (title: string, body: string) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0b0b0a;font-family:'Courier New',Courier,monospace;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0a;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#f0ebde;color:#1a1815;">
            <tr>
              <td style="padding:24px 28px;border-bottom:2px dashed #1a1815;">
                <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#6b6558;">Nej Clothing — Manifest</div>
                <div style="font-size:22px;font-weight:800;letter-spacing:.02em;margin-top:4px;">${title}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">${body}</td>
            </tr>
            <tr>
              <td style="padding:20px 28px;border-top:2px dashed #1a1815;font-size:11px;letter-spacing:.1em;color:#6b6558;">
                NEJ CLOTHING · LIMITED RUN · NO RESTOCKS GUARANTEED
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export function welcomeEmail(name: string) {
  return shell(
    "Access granted",
    `
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
        ${escapeHtml(name)}, you're on the list. Your account is active and you'll
        get first word when a drop goes live — before it hits the shop.
      </p>
      <p style="font-size:14px;line-height:1.6;margin:0;">
        No spam. No noise. Just the manifest for what's next.
      </p>
    `,
  );
}

export function orderConfirmationEmail(params: {
  name: string;
  orderNumber: string;
  items: { productName: string; size: string; quantity: number; unitPriceCents: number }[];
  totalCents: number;
}) {
  const rows = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 0;font-size:13px;">${escapeHtml(item.productName)} — ${escapeHtml(item.size)}</td>
          <td style="padding:6px 0;font-size:13px;text-align:center;">x${item.quantity}</td>
          <td style="padding:6px 0;font-size:13px;text-align:right;">${formatPrice(item.unitPriceCents * item.quantity)}</td>
        </tr>
      `,
    )
    .join("");

  return shell(
    "Order received",
    `
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
        ${escapeHtml(params.name)}, we've logged order <strong>${escapeHtml(params.orderNumber)}</strong>.
        Confirmation below for your records.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1a1815;border-bottom:1px solid #1a1815;margin-bottom:16px;">
        ${rows}
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;font-weight:700;">TOTAL</td>
          <td style="font-size:13px;font-weight:700;text-align:right;">${formatPrice(params.totalCents)}</td>
        </tr>
      </table>
    `,
  );
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
