import { NextResponse } from "next/server";
import Stripe from "stripe";
import { validateDonation } from "@/lib/donation";
import { buildSessionParams, getBaseUrl, getStripe, StripeConfigError } from "@/lib/stripe";

export const runtime = "nodejs"; // the Stripe SDK needs Node, not the Edge runtime
export const dynamic = "force-dynamic";

const isDev = process.env.NODE_ENV !== "production";

/** `detail` only appears in development, so you can see the real cause without leaking it to visitors. */
const fail = (error: string, status: number, detail?: string) =>
  NextResponse.json({ error, ...(isDev && detail ? { detail } : {}) }, { status });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("The donation request was not valid.", 400);
  }

  const result = validateDonation(body);
  if (!result.ok) return fail(result.error, 400);

  try {
    const session = await getStripe().checkout.sessions.create(
      buildSessionParams(result.data, getBaseUrl(request)),
    );
    if (!session.url) return fail("We could not start the payment. Please try again.", 502, "Stripe returned no URL");
    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof StripeConfigError) {
      console.error("[donate]", err.message);
      return fail("Online giving is not available right now. Please try again later.", 503, err.message);
    }
    if (err instanceof Stripe.errors.StripeError) {
      console.error("[donate] Stripe error:", err.type, err.code, err.message);
      return fail("We could not start the payment. Please try again.", 502, `${err.type}: ${err.message}`);
    }
    console.error("[donate] Unexpected error:", err);
    return fail("Something went wrong. Please try again.", 500, err instanceof Error ? err.message : String(err));
  }
}