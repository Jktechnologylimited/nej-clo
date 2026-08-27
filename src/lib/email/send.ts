import { getResendClient, EMAIL_FROM } from "./resend";
import { welcomeEmail, orderConfirmationEmail, restockAlertEmail, newOrderAdminNotificationEmail } from "./templates";

/**
 * All senders below are intentionally "best effort": a failed email should
 * never fail a signup or a checkout. We log and move on.
 */

/** Where new-order alerts go. Defaults to the same address db:seed uses for the admin login. */
function getOrderNotificationEmail(): string | null {
  return process.env.ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || null;
}

export async function sendNewOrderAdminNotification(
  params: Parameters<typeof newOrderAdminNotificationEmail>[0],
) {
  const resend = getResendClient();
  const to = getOrderNotificationEmail();
  if (!resend || !to) return;
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `New order ${params.orderNumber}${params.paid ? " (paid)" : ""} — ${params.customerName}`,
      html: newOrderAdminNotificationEmail(params),
    });
  } catch (err) {
    console.error("[email] failed to send admin order notification", err);
  }
}

export async function sendRestockAlertEmail(
  to: string,
  params: Parameters<typeof restockAlertEmail>[0],
) {
  const resend = getResendClient();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `Nej Clothing — ${params.productName} is back`,
      html: restockAlertEmail(params),
    });
  } catch (err) {
    console.error("[email] failed to send restock alert email", err);
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const resend = getResendClient();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Nej Clothing — access granted",
      html: welcomeEmail(name),
    });
  } catch (err) {
    console.error("[email] failed to send welcome email", err);
  }
}

export async function sendOrderConfirmationEmail(
  to: string,
  params: Parameters<typeof orderConfirmationEmail>[0],
) {
  const resend = getResendClient();
  if (!resend) return;
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `Nej Clothing — order ${params.orderNumber} received`,
      html: orderConfirmationEmail(params),
    });
  } catch (err) {
    console.error("[email] failed to send order confirmation email", err);
  }
}
