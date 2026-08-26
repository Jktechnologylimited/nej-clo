export const orderStatusValues = [
  "pending",
  "paid",
  "processing",
  "dispatched",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
  "cancelled",
] as const;
export type OrderStatus = (typeof orderStatusValues)[number];

/**
 * Ordered fulfillment stages shown on the tracking timeline. Excludes
 * pending/failed/cancelled, which aren't steps on that timeline — pending
 * means "not yet paid" and failed/cancelled are terminal off-ramps.
 */
export const FULFILLMENT_STAGES = [
  "paid",
  "processing",
  "dispatched",
  "in_transit",
  "out_for_delivery",
  "delivered",
] as const;

/** Index into FULFILLMENT_STAGES, or -1 if the status isn't a fulfillment stage. */
export function fulfillmentStageIndex(status: string): number {
  return (FULFILLMENT_STAGES as readonly string[]).indexOf(status);
}

export type OrderStatusGroup = "in_transit" | "delivered" | "cancelled" | "processing";

export function orderStatusGroup(status: string): OrderStatusGroup {
  if (status === "delivered") return "delivered";
  if (status === "cancelled" || status === "failed") return "cancelled";
  if (status === "dispatched" || status === "in_transit" || status === "out_for_delivery") {
    return "in_transit";
  }
  return "processing"; // pending, paid, processing
}
