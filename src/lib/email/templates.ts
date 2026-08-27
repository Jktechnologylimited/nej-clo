import { formatPrice } from "@/lib/currency";

const shell = (title: string, body: string) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#e8e2d3;font-family:'Courier New',Courier,monospace;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8e2d3;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;color:#111111;">
            <tr>
              <td style="padding:24px 28px;border-bottom:2px dashed #111111;">
                <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#686868;">Nej Clothing — Manifest</div>
                <div style="font-size:22px;font-weight:800;letter-spacing:.02em;margin-top:4px;">${title}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">${body}</td>
            </tr>
            <tr>
              <td style="padding:20px 28px;border-top:2px dashed #111111;font-size:11px;letter-spacing:.1em;color:#686868;">
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

export function newOrderAdminNotificationEmail(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  items: { productName: string; size: string; quantity: number; unitPriceCents: number }[];
  totalCents: number;
  paid: boolean;
  adminOrderUrl: string;
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
    params.paid ? "New order — paid" : "New order",
    `
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
        Order <strong>${escapeHtml(params.orderNumber)}</strong> from
        ${escapeHtml(params.customerName)} (${escapeHtml(params.customerEmail)}).
        ${params.paid ? "Payment confirmed via Paystack." : "No payment processor connected — logged only."}
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #111111;border-bottom:1px solid #111111;margin-bottom:16px;">
        ${rows}
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="font-size:13px;font-weight:700;">TOTAL</td>
          <td style="font-size:13px;font-weight:700;text-align:right;">${formatPrice(params.totalCents)}</td>
        </tr>
      </table>
      <p style="font-size:12px;line-height:1.6;color:#686868;margin:0 0 20px;">
        SHIP TO<br />
        ${escapeHtml(params.customerName)}<br />
        ${escapeHtml(params.addressLine1)}${params.addressLine2 ? ", " + escapeHtml(params.addressLine2) : ""}<br />
        ${escapeHtml(params.city)}, ${escapeHtml(params.postalCode)}<br />
        ${escapeHtml(params.country)}
      </p>
      <a href="${params.adminOrderUrl}" style="display:inline-block;background:#111111;color:#ffffff;padding:12px 20px;font-size:12px;letter-spacing:.1em;text-decoration:none;">
        VIEW ORDER
      </a>
    `,
  );
}

export function restockAlertEmail(params: {
  productName: string;
  colorway: string;
  priceCents: number;
  productUrl: string;
}) {
  return shell(
    "It's back.",
    `
      <p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
        <strong>${escapeHtml(params.productName)}</strong> — ${escapeHtml(params.colorway)} is logged and
        back in stock. Same rules as always: first to check, first served.
      </p>
      <p style="font-size:16px;font-weight:700;margin:0 0 20px;">
        ${formatPrice(params.priceCents)}
      </p>
      <a href="${params.productUrl}" style="display:inline-block;background:#111111;color:#ffffff;padding:12px 20px;font-size:12px;letter-spacing:.1em;text-decoration:none;">
        SHOP NOW
      </a>
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
