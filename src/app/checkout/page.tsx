import { Suspense } from "react";
import { isPaystackConfigured } from "@/lib/paystack";
import { CheckoutForm } from "./CheckoutForm";

export default function CheckoutPage() {
  const paystackEnabled = isPaystackConfigured();

  return (
    <Suspense fallback={null}>
      <CheckoutForm paystackEnabled={paystackEnabled} />
    </Suspense>
  );
}
