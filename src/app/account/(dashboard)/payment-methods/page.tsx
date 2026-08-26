import { ComingSoon } from "@/components/ComingSoon";

export default function PaymentMethodsPage() {
  return (
    <ComingSoon
      eyebrow="PAYMENT METHODS"
      title="Saved cards coming soon"
      body="Saving a card for faster checkout needs real tokenization through Paystack, which isn't wired up yet. You'll enter payment details fresh each time for now."
    />
  );
}
