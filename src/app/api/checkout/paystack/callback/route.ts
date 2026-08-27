import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction, getPaystackCurrency } from "@/lib/paystack";
import { convertFromBaseCents } from "@/lib/currency";
import { getOrderByNumber, markOrderPaid, markOrderFailed } from "@/lib/orders";
import { sendOrderConfirmationEmail, sendNewOrderAdminNotification } from "@/lib/email/send";

export async function GET(request: NextRequest) {
  // Paystack appends the reference as either `reference` or `trxref`.
  const reference =
    request.nextUrl.searchParams.get("reference") ??
    request.nextUrl.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(new URL("/checkout?payment=error", request.url));
  }

  // We used the order number as the Paystack reference at initialize time.
  const result = await getOrderByNumber(reference);
  if (!result) {
    return NextResponse.redirect(new URL("/checkout?payment=error", request.url));
  }
  const { order, items } = result;

  // Already processed (e.g. the customer refreshed the callback page) — just
  // send them on to the confirmation page without re-verifying or re-emailing.
  if (order.status === "paid") {
    return NextResponse.redirect(
      new URL(`/checkout/confirmed/${order.orderNumber}`, request.url),
    );
  }

  try {
    const verification = await verifyTransaction(reference);
    const expectedAmount = convertFromBaseCents(order.totalCents, getPaystackCurrency());

    if (verification.status !== "success" || verification.amount !== expectedAmount) {
      await markOrderFailed(order.orderNumber);
      return NextResponse.redirect(new URL("/checkout?payment=failed", request.url));
    }

    await markOrderPaid(order.orderNumber, verification.reference);

    await sendOrderConfirmationEmail(order.email, {
      name: order.name,
      orderNumber: order.orderNumber,
      items: items.map((i) => ({
        productName: i.productName,
        size: i.size,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
      })),
      totalCents: order.totalCents,
    });

    await sendNewOrderAdminNotification({
      orderNumber: order.orderNumber,
      customerName: order.name,
      customerEmail: order.email,
      addressLine1: order.addressLine1,
      addressLine2: order.addressLine2,
      city: order.city,
      postalCode: order.postalCode,
      country: order.country,
      items: items.map((i) => ({
        productName: i.productName,
        size: i.size,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
      })),
      totalCents: order.totalCents,
      paid: true,
      adminOrderUrl: new URL(`/admin/orders/${order.id}/edit`, request.url).toString(),
    });

    return NextResponse.redirect(
      new URL(`/checkout/confirmed/${order.orderNumber}`, request.url),
    );
  } catch {
    return NextResponse.redirect(new URL("/checkout?payment=error", request.url));
  }
}
