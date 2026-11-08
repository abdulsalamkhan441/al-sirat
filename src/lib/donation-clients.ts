import type { DonationPayload } from "./donation";

/**
 * Call this from the donation form's submit handler.
 *
 *   const url = await startDonationCheckout(payload);
 *   window.location.assign(url);   // Stripe's secure page
 *
 * Throws an Error whose message is safe to show to the donor.
 */
export async function startDonationCheckout(payload: DonationPayload): Promise<string> {
  let res: Response;
  try {
    res = await fetch("/api/donate/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("We could not reach the server. Check your connection and try again.");
  }

  const data: { url?: string; error?: string } | null = await res.json().catch(() => null);
  if (!res.ok || !data?.url) {
    throw new Error(data?.error ?? "We could not start the payment. Please try again.");
  }
  return data.url;
}