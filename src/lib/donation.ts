/* -------------------------------------------------------------------------- */
/*  The donation contract shared by the form (browser) and the API (server).  */
/*  Pure TypeScript on purpose: no Stripe or Next imports, so both can use it. */
/* -------------------------------------------------------------------------- */

export const MIN_GIFT = 1; // CAD
export const MAX_GIFT = 10_000; // CAD, guards against typos like 50000 instead of 500

export type Frequency = "once" | "monthly";

export const DESIGNATIONS = ["general", "education", "youth", "sports", "events", "support"] as const;
export type Designation = (typeof DESIGNATIONS)[number];

export const DESIGNATION_LABELS: Record<Designation, string> = {
  general: "Where it is needed most",
  education: "Educational programs",
  youth: "Youth development",
  sports: "Sports activities",
  events: "Community events",
  support: "Support services",
};

export type DonorAddress = {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

/** What the browser sends to POST /api/donate/checkout. */
export type DonationPayload = {
  amount: number; // dollars (CAD), up to 2 decimals
  frequency: Frequency;
  designation: Designation;
  donor: { firstName: string; lastName: string; email: string };
  receipt: boolean;
  address?: DonorAddress;
  note?: string;
};

export type ValidationResult = { ok: true; data: DonationPayload } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ONCE_ALIASES = new Set(["once", "one-time", "one_time", "onetime", "single"]);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Never trust the browser: this runs on the server before anything is sent to Stripe. */
export function validateDonation(input: unknown): ValidationResult {
  if (!isRecord(input)) return { ok: false, error: "Invalid donation request." };

  // Amount: a real, finite number in range, rounded to cents
  const rawAmount = typeof input.amount === "string" ? Number(input.amount) : input.amount;
  if (typeof rawAmount !== "number" || !Number.isFinite(rawAmount)) {
    return { ok: false, error: "Enter a donation amount." };
  }
  const amount = Math.round(rawAmount * 100) / 100;
  if (amount < MIN_GIFT) return { ok: false, error: `The minimum gift is $${MIN_GIFT}.` };
  if (amount > MAX_GIFT) {
    return { ok: false, error: `For gifts over $${MAX_GIFT.toLocaleString("en-CA")}, please contact us directly.` };
  }

  // Frequency: "monthly" or any spelling of one-time. Anything else is rejected.
  let frequency: Frequency;
  if (input.frequency === "monthly") frequency = "monthly";
  else if (input.frequency === undefined || (typeof input.frequency === "string" && ONCE_ALIASES.has(input.frequency.toLowerCase()))) {
    frequency = "once";
  } else return { ok: false, error: "Choose one-time or monthly." };

  // Designation (optional)
  const designation = input.designation ?? "general";
  if (typeof designation !== "string" || !(DESIGNATIONS as readonly string[]).includes(designation)) {
    return { ok: false, error: "Choose where your gift should go." };
  }

  // Donor
  if (!isRecord(input.donor)) return { ok: false, error: "Enter your name and email." };
  const firstName = text(input.donor.firstName, 80);
  const lastName = text(input.donor.lastName, 80);
  const email = text(input.donor.email, 254);
  if (!firstName || !lastName) return { ok: false, error: "Enter your first and last name." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid email address." };

  // Address (optional; Stripe also collects it on its page when a receipt is requested)
  let address: DonorAddress | undefined;
  if (isRecord(input.address)) {
    const a = input.address;
    const line1 = text(a.line1, 120);
    const city = text(a.city, 80);
    if (line1 && city) {
      address = {
        line1,
        line2: text(a.line2, 120) || undefined,
        city,
        province: text(a.province, 80),
        postalCode: text(a.postalCode, 20),
        country: text(a.country, 80) || "Canada",
      };
    }
  }

  return {
    ok: true,
    data: {
      amount,
      frequency,
      designation: designation as Designation,
      donor: { firstName, lastName, email },
      receipt: input.receipt === true,
      address,
      note: text(input.note, 500) || undefined,
    },
  };
}