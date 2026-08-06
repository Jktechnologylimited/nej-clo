import { sql } from "@/lib/db";
import type { Order, OrderItem } from "@/lib/db/types";

const ORDER_COLUMNS = `
  id, order_number AS "orderNumber", user_id AS "userId", email, name,
  address_line1 AS "addressLine1", address_line2 AS "addressLine2",
  city, postal_code AS "postalCode", country, status,
  total_cents AS "totalCents", payment_reference AS "paymentReference",
  created_at AS "createdAt"
`;

const ORDER_ITEM_COLUMNS = `
  id, order_id AS "orderId", product_id AS "productId",
  product_name AS "productName", size, quantity,
  unit_price_cents AS "unitPriceCents"
`;

export async function getOrderByNumber(orderNumber: string) {
  const orderRows = await sql.query(
    `SELECT ${ORDER_COLUMNS} FROM orders WHERE order_number = $1 LIMIT 1`,
    [orderNumber],
  );
  const order = orderRows[0] as Order | undefined;
  if (!order) return null;

  const itemRows = await sql.query(
    `SELECT ${ORDER_ITEM_COLUMNS} FROM order_items WHERE order_id = $1`,
    [order.id],
  );

  return { order, items: itemRows as unknown as OrderItem[] };
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const rows = await sql.query(
    `SELECT ${ORDER_COLUMNS} FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  return rows as unknown as Order[];
}

export async function markOrderPaid(orderNumber: string, paymentReference: string): Promise<void> {
  await sql`
    UPDATE orders
    SET status = 'paid', payment_reference = ${paymentReference}
    WHERE order_number = ${orderNumber}
  `;
}

export async function markOrderFailed(orderNumber: string): Promise<void> {
  await sql`
    UPDATE orders SET status = 'failed' WHERE order_number = ${orderNumber}
  `;
}
