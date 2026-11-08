import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Heart, SearchX } from "lucide-react";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you | Al Sirat Academy",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type State =
  | { kind: "paid"; amount: string; monthly: boolean; email?: string; receiptRequested: boolean }
  | { kind: "pending" }
  | { kind: "unknown" };

/** Ask Stripe what really happened. Anyone can type a URL, so the URL alone proves nothing. */
async function lookup(sessionId: string | undefined): Promise<State> {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return { kind: "unknown" };
  try {
    const s = await getStripe().checkout.sessions.retrieve(sessionId);
    if (s.payment_status === "paid") {
      const amount =
        s.amount_total != null
          ? new Intl.NumberFormat("en-CA", { style: "currency", currency: (s.currency ?? "cad").toUpperCase() }).format(s.amount_total / 100)
          : "";
      return {
        kind: "paid",
        amount,
        monthly: s.mode === "subscription",
        email: s.customer_details?.email ?? s.customer_email ?? undefined,
        receiptRequested: s.metadata?.receiptRequested === "true",
      };
    }
    return { kind: "pending" };
  } catch (err) {
    console.error("[donate] Could not verify session:", err);
    return { kind: "unknown" };
  }
}

const card =
  "w-full max-w-md rounded-3xl border border-palladian/15 bg-abyssal-dark/60 p-8 shadow-2xl shadow-abyssal-dark/60 backdrop-blur-xl";
const primaryBtn =
  "inline-flex items-center gap-2 rounded-full bg-burning-flame px-6 py-3 text-sm font-bold text-abyssal transition-colors hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark";
const ghostBtn =
  "inline-flex items-center gap-2 rounded-full border border-palladian/20 bg-palladian/5 px-6 py-3 text-sm font-semibold text-palladian transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame";

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const state = await lookup(session_id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center text-palladian">
      <div className={card} role="status">
        {state.kind === "paid" && (
          <>
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-burning-flame/15 text-burning-flame">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-palladian-light">Thank you for your generous gift!</h1>
            <p className="mt-3 text-sm leading-relaxed text-palladian/75">
              {state.amount && (
                <>
                  Your {state.monthly ? "monthly gift" : "gift"} of{" "}
                  <span className="font-semibold text-palladian-light">{state.amount}</span> was received
                  {state.monthly ? " and will repeat each month" : ""}.{" "}
                </>
              )}
              {state.email ? (
                <>
                  Stripe will email your payment receipt to{" "}
                  <span className="font-medium text-palladian-light">{state.email}</span>.
                </>
              ) : (
                "Stripe will email your payment receipt."
              )}
              {state.receiptRequested && " We have also noted your request for a donation receipt."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/" className={primaryBtn}>
                <Heart className="size-4" aria-hidden="true" />
                Return home
              </Link>
              <Link href="/donate" className={ghostBtn}>
                Give again
              </Link>
            </div>
          </>
        )}

        {state.kind === "pending" && (
          <>
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-burning-flame/15 text-burning-flame">
              <Clock className="size-8" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-palladian-light">We are confirming your payment</h1>
            <p className="mt-3 text-sm leading-relaxed text-palladian/75">
              Your bank has not confirmed the payment yet. Refresh this page in a minute. You will not be charged twice.
            </p>
            <div className="mt-8">
              <Link href="/" className={ghostBtn}>
                Return home
              </Link>
            </div>
          </>
        )}

        {state.kind === "unknown" && (
          <>
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-palladian/10 text-oatmeal">
              <SearchX className="size-8" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-palladian-light">We could not find that donation</h1>
            <p className="mt-3 text-sm leading-relaxed text-palladian/75">
              This page is shown after a completed payment. If you just gave and expected to see a thank-you here, check your
              email for a receipt, or contact us and we will help.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/donate" className={primaryBtn}>
                <Heart className="size-4" aria-hidden="true" />
                Go to donate
              </Link>
              <Link href="/" className={ghostBtn}>
                Return home
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}