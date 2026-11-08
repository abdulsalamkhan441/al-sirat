import Stripe from "stripe";
import { DESIGNATION_LABELS, type DonationPayload } from "./donation";

/** Thrown when the server is missing its Stripe key, so the route can answer clearly. */
export class StripeConfigError extends Error {}

let client: Stripe | null = null;

/**
 * Create the client on first use, not at import time.
 * `new Stripe(undefined!)` at the top of a file throws while Next.js is building the
 * route, which looks like a random crash instead of "the key is missing".
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new StripeConfigError(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (or your host's environment settings) and restart the server.",
    );
  }
  return (client ??= new Stripe(key));
}

const asOrigin = (value: string | null | undefined) => {
  if (!value || value === "null") return null;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:" ? u.origin : null;
  } catch {
    return null;
  }
};

/**
 * Where Stripe sends people back to. The `Origin` header can be missing, and
 * "null/donate/success" is not a valid URL, so Stripe rejects the whole request.
 * Order: the browser's Origin, then NEXT_PUBLIC_SITE_URL, then the request's own URL.
 */
export function getBaseUrl(request: Request): string {
  return (
    asOrigin(request.headers.get("origin")) ??
    asOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    new URL(request.url).origin
  );
}

/** Turns a validated donation into Stripe Checkout parameters. */
export function buildSessionParams(d: DonationPayload, baseUrl: string): Stripe.Checkout.SessionCreateParams {
  const monthly = d.frequency === "monthly";
  const label = DESIGNATION_LABELS[d.designation];
  const description = `Al Sirat Academy: ${label}`;

  const metadata: Record<string, string> = {
    donorName: `${d.donor.firstName} ${d.donor.lastName}`.slice(0, 100),
    donorEmail: d.donor.email,
    designation: d.designation,
    receiptRequested: d.receipt ? "true" : "false",
  };
  if (d.note) metadata.note = d.note.slice(0, 450); // Stripe allows 500 characters per value
  if (d.address) {
    const a = d.address;
    metadata.mailingAddress = [a.line1, a.line2, a.city, a.province, a.postalCode, a.country]
      .filter(Boolean)
      .join(", ")
      .slice(0, 480);
  }

  const base: Stripe.Checkout.SessionCreateParams = {
    mode: monthly ? "subscription" : "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: Math.round(d.amount * 100),
          product_data: {
            name: monthly ? "Monthly Community Donation" : "One-Time Donation",
            description,
          },
          ...(monthly && { recurring: { interval: "month" as const } }),
        },
      },
    ],
    customer_email: d.donor.email,
    // If a receipt was requested, make Stripe collect the billing address on its own page.
    billing_address_collection: d.receipt ? "required" : "auto",
    metadata,
    success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/donate?canceled=1`,
  };

  return monthly
    ? { ...base, subscription_data: { metadata } }
    : {
        ...base,
        submit_type: "donate", // "Donate" on the button instead of "Pay"
        payment_intent_data: { description, metadata, receipt_email: d.donor.email },
      };
}