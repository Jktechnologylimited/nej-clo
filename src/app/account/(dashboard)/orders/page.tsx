import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders";
import { OrdersListClient } from "./OrdersListClient";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) return null;
  const orders = await getOrdersForUser(session.userId);

  return (
    <Suspense fallback={null}>
      <OrdersListClient orders={orders} />
    </Suspense>
  );
}
