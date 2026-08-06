import { isCurrency, defaultCurrency, type CurrencyCode } from "@/lib/currency";

const PAYSTACK_BASE = "https://api.paystack.co";

/**
 * Paystack's settlement currency for this integration. Must be a currency
 * lib/currency.ts has a conversion rate for (GBP, USD, EUR, JPY, CAD, AUD,
 * NGN). Falls back to NGN if PAYSTACK_CURRENCY is unset, GBP if it's set to
 * something unrecognized.
 */
export function getPaystackCurrency(): CurrencyCode {
  const raw = process.env.PAYSTACK_CURRENCY || "NGN";
  return isCurrency(raw) ? raw : defaultCurrency;
}

function getSecretKey(): string | null {
  return process.env.PAYSTACK_SECRET_KEY || null;
}

export function isPaystackConfigured(): boolean {
  return !!getSecretKey();
}

function requireSecretKey(): string {
  const key = getSecretKey();
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set — check isPaystackConfigured() before calling this.",
    );
  }
  return key;
}

export type InitializeTransactionResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

/**
 * Starts a Paystack transaction and returns a hosted checkout URL to redirect
 * the customer to. If PAYSTACK_SUBACCOUNT_CODE is set, the payment is split
 * to that subaccount per Paystack's standard subaccount behaviour (the
 * platform takes its configured percentage/flat fee, the rest settles to the
 * subaccount) — configure the split percentage on the subaccount itself in
 * the Paystack dashboard, it isn't set per-transaction here.
 */
export async function initializeTransaction(input: {
  email: string;
  amount: number; // integer, in the target currency's minor unit (e.g. kobo for NGN)
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeTransactionResult> {
  const secretKey = requireSecretKey();
  const subaccount = process.env.PAYSTACK_SUBACCOUNT_CODE || undefined;

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      ...(subaccount ? { subaccount } : {}),
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status) {
    throw new Error(data?.message || "Could not start the Paystack transaction.");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export type VerifyTransactionResult = {
  status: string; // "success" on a completed payment; "failed"/"abandoned" otherwise
  reference: string;
  amount: number;
  currency: string;
};

/** Always verify server-side before trusting a payment — never trust the redirect alone. */
export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const secretKey = requireSecretKey();

  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secretKey}` } },
  );

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status) {
    throw new Error(data?.message || "Could not verify the Paystack transaction.");
  }

  return {
    status: data.data.status,
    reference: data.data.reference,
    amount: data.data.amount,
    currency: data.data.currency,
  };
}
