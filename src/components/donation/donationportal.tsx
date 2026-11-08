"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Lock,
  Pencil,
  Receipt,
  Repeat,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Change if the organization collects in another currency. */
const CURRENCY = "CAD";
const MAX_AMOUNT = 100000;
const PRESETS = [10, 25, 50, 100, 250];

/** Server route that creates a hosted checkout session and returns { url }. Must be created. */
const CHECKOUT_ENDPOINT = "/api/donate/checkout";

const COUNTRIES = ["Canada", "United States", "Other"];

/** Illustrative impact lines. Replace with real, verified examples before launch. */
const IMPACT_TIERS: { min: number; text: string }[] = [
  { min: 250, text: "Helps sustain a full program for our community, from space to supplies." },
  { min: 100, text: "Helps keep classes, activities and events running for families." },
  { min: 50, text: "Helps cover materials and equipment for youth and sports programs." },
  { min: 25, text: "Helps provide supplies so more people can take part." },
  { min: 1, text: "Every contribution helps create opportunities for someone." },
];

const STEPS = [
  { label: "Amount", title: "How much would you like to give?", text: "Choose a one-time or monthly gift." },
  { label: "Your details", title: "Tell us about you", text: "We use these for your confirmation and, if you ask, your receipt." },
  { label: "Review", title: "Review and give", text: "Check everything, then continue to our secure payment page." },
];

const TRUST: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: Lock,
    title: "Secure checkout",
    text: "You enter card details on our payment provider's secure page, never on this site.",
  },
  {
    Icon: Receipt,
    title: "Electronic receipts",
    text: "Eligible donors can request an official receipt, sent to their email.",
  },
  {
    Icon: Accessibility,
    title: "Made for everyone",
    text: "Designed for keyboard and screen-reader use, and for any size of screen.",
  },
];

type Frequency = "once" | "monthly";
type Status = "idle" | "loading";
type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  receipt: boolean;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  receipt: false,
  address1: "",
  address2: "",
  city: "",
  region: "",
  postal: "",
  country: "Canada",
};

/** Which validated fields belong to which step (amount, then details, then review). */
const STEP_FIELDS: string[][] = [
  ["amount"],
  ["firstName", "lastName", "email", "address1", "city", "region", "postal"],
  [],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Glass system shared with the rest of the site */
const GLASS =
  "relative rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent";

const OVERLAY_GLASS =
  "rounded-2xl border border-palladian/[0.16] bg-abyssal-dark/40 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl";

/** 16px on phones so iOS does not zoom the page when a field is focused. */
const INPUT =
  "w-full rounded-2xl border border-palladian/20 bg-abyssal-dark/40 px-4 py-3 text-base text-palladian-light placeholder:text-oatmeal-dark transition-colors duration-300 hover:border-burning-flame/60 focus-visible:border-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame aria-[invalid=true]:border-truffle-light sm:text-sm";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const whole = new Intl.NumberFormat("en-CA", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-CA", { style: "currency", currency: CURRENCY, minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => (Number.isInteger(n) ? whole.format(n) : cents.format(n));

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

type ControlProps = {
  id: string;
  className: string;
  "aria-invalid": boolean;
  "aria-required": boolean | undefined;
  "aria-describedby": string | undefined;
};

function Field({
  id,
  label,
  required,
  error,
  hint,
  className = "",
  render,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  render: (p: ControlProps) => ReactNode;
}) {
  const errId = `${id}-error`;
  const hintId = `${id}-hint`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-palladian">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-burning-flame">*</span>
        ) : (
          <span className="ml-1 font-normal text-oatmeal-dark">(optional)</span>
        )}
      </label>
      {render({
        id,
        className: INPUT,
        "aria-invalid": !!error,
        "aria-required": required ? true : undefined,
        "aria-describedby": error ? errId : hint ? hintId : undefined,
      })}
      {error ? (
        <p id={errId} className="mt-1.5 text-xs font-medium text-truffle-light">
          <span className="sr-only">Error: </span>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-oatmeal">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function DonationPortal() {
  const reduce = !!useReducedMotion();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [preset, setPreset] = useState<number | null>(50);
  const [custom, setCustom] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  /* ---------- derived gift ---------- */
  const parsedCustom = custom === "" ? null : Number.parseFloat(custom);
  const amount = parsedCustom !== null ? parsedCustom : preset;
  const valid = amount !== null && Number.isFinite(amount) && amount >= 1 && amount <= MAX_AMOUNT;
  const safeAmount = valid ? Math.round((amount as number) * 100) / 100 : 0;
  const label = valid ? money(safeAmount) : null;
  const impact = valid ? IMPACT_TIERS.find((t) => safeAmount >= t.min)?.text : undefined;

  /* ---------- validation ---------- */
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!valid) {
      e.amount =
        custom !== ""
          ? `Enter an amount between ${whole.format(1)} and ${whole.format(MAX_AMOUNT)}.`
          : "Choose an amount to continue.";
    }
    if (!form.firstName.trim()) e.firstName = "Enter your first name.";
    if (!form.lastName.trim()) e.lastName = "Enter your last name.";
    const email = form.email.trim();
    if (!email) e.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address, like name@example.com.";
    if (form.receipt) {
      if (!form.address1.trim()) e.address1 = "Enter your street address.";
      if (!form.city.trim()) e.city = "Enter your city.";
      if (!form.region.trim()) e.region = "Enter your province or state.";
      if (!form.postal.trim()) e.postal = "Enter your postal or ZIP code.";
    }
    return e;
  }, [valid, custom, form]);

  const stepErrors = (s: number) => STEP_FIELDS[s].filter((k) => errors[k]);
  const err = (k: string) => (showErrors ? errors[k] : undefined);
  const visibleErrors = showErrors ? stepErrors(step) : [];

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  function focusField(key: string) {
    document.getElementById(`dp-${key}`)?.focus();
  }

  /* ---------- amount handlers ---------- */
  function pickPreset(n: number) {
    setPreset(n);
    setCustom("");
  }
  function onCustomChange(raw: string) {
    // digits plus one decimal point, max two decimals
    let v = raw.replace(/[^0-9.]/g, "");
    const dot = v.indexOf(".");
    if (dot !== -1) v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, "").slice(0, 2);
    v = v.slice(0, 9);
    setCustom(v);
    if (v !== "") setPreset(null);
  }

  /* ---------- navigation ---------- */
  function goTo(n: number, keepErrors = false) {
    moved.current = true;
    setDir(n > step ? 1 : -1);
    setStep(n);
    setShowErrors(keepErrors);
    setSubmitError(null);
  }

  function next() {
    const bad = stepErrors(step);
    if (bad.length) {
      setShowErrors(true);
      requestAnimationFrame(() => focusField(bad[0]));
      return;
    }
    goTo(step + 1);
  }

  // Move focus to the step heading and keep the card in view after each step change
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      cardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [step, reduce]);

  /**
   * Posts the gift to your server, which should create a hosted checkout session
   * (Stripe Checkout or similar) and return { url }. Card details never touch this page.
   * Validate everything again on the server before creating the session.
   */
  async function startCheckout() {
    if (status === "loading") return;
    const firstBad = STEP_FIELDS.findIndex((_, i) => stepErrors(i).length > 0);
    if (firstBad !== -1) {
      goTo(firstBad, true);
      return;
    }
    setStatus("loading");
    setSubmitError(null);
    try {
      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: safeAmount,
          currency: CURRENCY.toLowerCase(),
          frequency,
          donor: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
          },
          receipt: form.receipt,
          address: form.receipt
            ? {
                line1: form.address1.trim(),
                line2: form.address2.trim(),
                city: form.city.trim(),
                region: form.region.trim(),
                postal: form.postal.trim(),
                country: form.country,
              }
            : null,
        }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("no url");
      window.location.assign(data.url);
    } catch {
      setStatus("idle");
      setSubmitError("We couldn't open the payment page just now. Nothing was charged. Please try again in a moment.");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) next();
    else void startCheckout();
  }

  /* ---------- animation ---------- */
  const header: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };
  const panel: Variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 32 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0 : 0.4, ease: EASE, staggerChildren: reduce ? 0 : 0.06 },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: reduce ? 0 : d * -32,
      transition: { duration: reduce ? 0 : 0.2, ease: EASE },
    }),
  };
  const item: Variants = {
    enter: { opacity: 0, y: reduce ? 0 : 12 },
    center: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.4, ease: EASE } },
  };
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 34 };

  const addressLine = [form.address1, form.address2, form.city, form.region, form.postal, form.country]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");

  const lastStep = step === STEPS.length - 1;

  return (
    <section
      id="donate"
      aria-labelledby="portal-heading"
      className="relative isolate scroll-mt-20 py-16 text-palladian sm:py-20 lg:py-24"
    >
      <div className="absolute -left-40 top-1/4 size-[34rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <motion.div
          className="absolute -right-40 bottom-0 size-[36rem] rounded-full bg-burning-flame/10 blur-3xl"
          animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="absolute -top-4 right-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent xl:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Give
        </span>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ================= Heading ================= */}
        <motion.div
          variants={header}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-2xl"
        >
          <motion.div variants={rise}>
            <span className="inline-flex items-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/50 px-3.5 py-1.5 text-[13px] font-medium text-palladian backdrop-blur-md">
              <ShieldCheck className="size-4 text-burning-flame" aria-hidden="true" />
              Online donation portal
            </span>
          </motion.div>
          <motion.h2
            id="portal-heading"
            variants={rise}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl"
          >
            Give in <span className="text-burning-flame">three simple steps.</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/80 sm:text-base">
            Secure, accessible and quick. Eligible donors can receive an electronic receipt by email.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-12 lg:items-start lg:gap-8"
        >
          {/* ================= Wizard ================= */}
          <div ref={cardRef} className="min-w-0 scroll-mt-24 lg:col-span-7">
            <form
              onSubmit={onSubmit}
              noValidate
              aria-labelledby="portal-step-title"
              className={`${GLASS} p-5 sm:p-8`}
            >
              {/* stepper */}
              <ol aria-label="Donation progress" className="flex items-center">
                {STEPS.map((s, i) => {
                  const done = i < step;
                  const current = i === step;
                  return (
                    <li
                      key={s.label}
                      aria-current={current ? "step" : undefined}
                      className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors duration-300 ${
                          done || current
                            ? "border-burning-flame bg-burning-flame text-abyssal"
                            : "border-palladian/25 bg-abyssal-dark/40 text-palladian/70"
                        }`}
                      >
                        {done ? <Check className="size-4" aria-hidden="true" /> : <span aria-hidden="true">{i + 1}</span>}
                      </span>
                      <span
                        className={`sr-only sm:not-sr-only sm:ml-2.5 sm:text-xs sm:font-medium ${
                          current ? "text-palladian-light" : "text-oatmeal"
                        }`}
                      >
                        <span className="sr-only">{done ? "Completed: " : current ? "Current step: " : "Upcoming: "}</span>
                        {s.label}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span aria-hidden="true" className="relative mx-3 h-px flex-1 bg-palladian/20">
                          <motion.span
                            className="absolute inset-0 origin-left bg-burning-flame"
                            initial={false}
                            animate={{ scaleX: done ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                          />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>

              {/* step heading (focus target after each step change) */}
              <div className="mt-7">
                <p className="text-xs font-medium text-burning-flame">
                  Step {step + 1} of {STEPS.length}
                </p>
                <h3
                  id="portal-step-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight text-palladian-light focus-visible:outline-none sm:text-3xl"
                >
                  {STEPS[step].title}
                </h3>
                <p className="mt-1.5 text-sm text-palladian/70">{STEPS[step].text}</p>
              </div>

              {/* error summary */}
              <div aria-live="assertive">
                {visibleErrors.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-truffle-light/50 bg-truffle-dark/30 p-4">
                    <p className="text-sm font-semibold text-palladian-light">
                      Please fix {visibleErrors.length === 1 ? "this" : `these ${visibleErrors.length}`} before continuing:
                    </p>
                    <ul className="mt-2 space-y-1">
                      {visibleErrors.map((k) => (
                        <li key={k}>
                          <button
                            type="button"
                            onClick={() => focusField(k)}
                            className="rounded text-left text-sm text-burning-flame-light underline underline-offset-2 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                          >
                            {errors[k]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* step content */}
              <div className="mt-6">
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={panel}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {/* ---------- Step 1: amount ---------- */}
                    {step === 0 && (
                      <LayoutGroup id="portal-amount">
                        <motion.fieldset variants={item}>
                          <legend className="sr-only">Donation frequency</legend>
                          <div className="grid grid-cols-2 gap-1 rounded-full border border-palladian/15 bg-abyssal-dark/40 p-1">
                            {(
                              [
                                { id: "once", text: "One-time", Icon: Heart },
                                { id: "monthly", text: "Monthly", Icon: Repeat },
                              ] as { id: Frequency; text: string; Icon: LucideIcon }[]
                            ).map(({ id, text, Icon }) => {
                              const on = frequency === id;
                              return (
                                <label key={id} className="relative cursor-pointer">
                                  <input
                                    type="radio"
                                    name="frequency"
                                    value={id}
                                    checked={on}
                                    onChange={() => setFrequency(id)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    className={`relative flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame ${
                                      on ? "text-abyssal" : "text-palladian hover:text-burning-flame"
                                    }`}
                                  >
                                    {on && (
                                      <motion.span
                                        layoutId="portal-freq"
                                        aria-hidden="true"
                                        className="absolute inset-0 rounded-full bg-burning-flame"
                                        transition={spring}
                                      />
                                    )}
                                    <span className="relative inline-flex items-center gap-2">
                                      <Icon className="size-4" aria-hidden="true" />
                                      {text}
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </motion.fieldset>

                        <motion.fieldset variants={item} className="mt-6">
                          <legend className="mb-3 text-xs font-medium uppercase tracking-wider text-oatmeal">
                            Choose an amount
                          </legend>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                            {PRESETS.map((n) => {
                              const on = preset === n && custom === "";
                              return (
                                <label key={n} className="relative cursor-pointer">
                                  <input
                                    type="radio"
                                    name="preset"
                                    value={n}
                                    checked={on}
                                    onChange={() => pickPreset(n)}
                                    className="peer sr-only"
                                  />
                                  <span
                                    className={`relative grid place-items-center rounded-full border px-3 py-3 text-sm font-semibold transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-abyssal ${
                                      on
                                        ? "border-burning-flame text-abyssal"
                                        : "border-palladian/20 bg-abyssal-dark/40 text-palladian hover:border-burning-flame/60 hover:text-burning-flame"
                                    }`}
                                  >
                                    {on && (
                                      <motion.span
                                        layoutId="portal-pill"
                                        aria-hidden="true"
                                        className="absolute inset-0 rounded-full bg-burning-flame"
                                        transition={spring}
                                      />
                                    )}
                                    <span className="relative">{whole.format(n)}</span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </motion.fieldset>

                        <motion.div variants={item} className="mt-4">
                          <label htmlFor="dp-amount" className="mb-1.5 block text-xs font-medium text-palladian">
                            Or enter your own amount ({CURRENCY})
                          </label>
                          <div className="relative">
                            <span aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-burning-flame">
                              $
                            </span>
                            <input
                              id="dp-amount"
                              inputMode="decimal"
                              autoComplete="off"
                              placeholder="0.00"
                              value={custom}
                              onChange={(e) => onCustomChange(e.target.value)}
                              aria-invalid={!!err("amount")}
                              aria-describedby={err("amount") ? "dp-amount-error" : "dp-amount-hint"}
                              className={`${INPUT} rounded-full pl-10`}
                            />
                          </div>
                          {err("amount") ? (
                            <p id="dp-amount-error" className="mt-1.5 text-xs font-medium text-truffle-light">
                              <span className="sr-only">Error: </span>
                              {err("amount")}
                            </p>
                          ) : (
                            <p id="dp-amount-hint" className="mt-1.5 text-xs text-oatmeal">
                              Minimum {whole.format(1)}.
                            </p>
                          )}
                        </motion.div>
                      </LayoutGroup>
                    )}

                    {/* ---------- Step 2: details ---------- */}
                    {step === 1 && (
                      <>
                        <motion.p variants={item} className="mb-4 text-xs text-oatmeal">
                          Fields marked <span className="text-burning-flame">*</span> are required.
                        </motion.p>

                        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
                          <Field
                            id="dp-firstName"
                            label="First name"
                            required
                            error={err("firstName")}
                            render={(p) => (
                              <input {...p} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
                            )}
                          />
                          <Field
                            id="dp-lastName"
                            label="Last name"
                            required
                            error={err("lastName")}
                            render={(p) => (
                              <input {...p} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
                            )}
                          />
                          <Field
                            id="dp-email"
                            label="Email address"
                            required
                            className="sm:col-span-2"
                            error={err("email")}
                            hint="We email your confirmation here."
                            render={(p) => (
                              <input
                                {...p}
                                type="email"
                                inputMode="email"
                                value={form.email}
                                onChange={(e) => set("email", e.target.value)}
                                autoComplete="email"
                                placeholder="name@example.com"
                              />
                            )}
                          />
                        </motion.div>

                        <motion.div variants={item} className={`${OVERLAY_GLASS} mt-5 p-4 sm:p-5`}>
                          <label htmlFor="dp-receipt" className="flex cursor-pointer items-start gap-3">
                            <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
                              <input
                                id="dp-receipt"
                                type="checkbox"
                                checked={form.receipt}
                                onChange={(e) => set("receipt", e.target.checked)}
                                aria-describedby="dp-receipt-hint"
                                className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-lg border border-palladian/30 bg-abyssal-dark/40 transition-colors duration-300 checked:border-burning-flame checked:bg-burning-flame hover:border-burning-flame/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal"
                              />
                              <Check
                                aria-hidden="true"
                                className="pointer-events-none relative size-4 text-abyssal opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-palladian-light">
                                Send me an official donation receipt
                              </span>
                              <span id="dp-receipt-hint" className="mt-0.5 block text-xs leading-relaxed text-oatmeal">
                                For eligible donors. We email it electronically, and we need your mailing address to issue it.
                              </span>
                            </span>
                          </label>

                          <AnimatePresence initial={false}>
                            {form.receipt && (
                              <motion.div
                                key="address"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                                className="-mx-1 overflow-hidden px-1"
                              >
                                <fieldset className="mt-4 grid gap-4 border-t border-palladian/10 pb-1 pt-4 sm:grid-cols-2">
                                  <legend className="sr-only">Mailing address for your receipt</legend>
                                  <Field
                                    id="dp-address1"
                                    label="Address line 1"
                                    required
                                    className="sm:col-span-2"
                                    error={err("address1")}
                                    render={(p) => (
                                      <input {...p} value={form.address1} onChange={(e) => set("address1", e.target.value)} autoComplete="address-line1" />
                                    )}
                                  />
                                  <Field
                                    id="dp-address2"
                                    label="Address line 2"
                                    className="sm:col-span-2"
                                    render={(p) => (
                                      <input {...p} value={form.address2} onChange={(e) => set("address2", e.target.value)} autoComplete="address-line2" />
                                    )}
                                  />
                                  <Field
                                    id="dp-city"
                                    label="City"
                                    required
                                    error={err("city")}
                                    render={(p) => (
                                      <input {...p} value={form.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
                                    )}
                                  />
                                  <Field
                                    id="dp-region"
                                    label="Province / state"
                                    required
                                    error={err("region")}
                                    render={(p) => (
                                      <input {...p} value={form.region} onChange={(e) => set("region", e.target.value)} autoComplete="address-level1" />
                                    )}
                                  />
                                  <Field
                                    id="dp-postal"
                                    label="Postal / ZIP code"
                                    required
                                    error={err("postal")}
                                    render={(p) => (
                                      <input {...p} value={form.postal} onChange={(e) => set("postal", e.target.value)} autoComplete="postal-code" />
                                    )}
                                  />
                                  <Field
                                    id="dp-country"
                                    label="Country"
                                    required
                                    render={(p) => (
                                      <div className="relative">
                                        <select
                                          {...p}
                                          value={form.country}
                                          onChange={(e) => set("country", e.target.value)}
                                          autoComplete="country-name"
                                          className={`${p.className} appearance-none pr-11`}
                                        >
                                          {COUNTRIES.map((c) => (
                                            <option key={c} value={c} className="bg-abyssal text-palladian-light">
                                              {c}
                                            </option>
                                          ))}
                                        </select>
                                        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-burning-flame" />
                                      </div>
                                    )}
                                  />
                                </fieldset>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </>
                    )}

                    {/* ---------- Step 3: review ---------- */}
                    {step === 2 && (
                      <>
                        <motion.dl variants={item} className={`${OVERLAY_GLASS} divide-y divide-palladian/10 px-4 sm:px-5`}>
                          {[
                            {
                              term: "Gift",
                              value: (
                                <>
                                  <span className="font-semibold text-palladian-light">{label}</span>
                                  <span className="text-oatmeal"> {frequency === "monthly" ? "every month" : "one time"}</span>
                                </>
                              ),
                              edit: 0,
                            },
                            {
                              term: "Name",
                              value: `${form.firstName.trim()} ${form.lastName.trim()}`,
                              edit: 1,
                            },
                            { term: "Email", value: form.email.trim(), edit: 1 },
                            {
                              term: "Receipt",
                              value: form.receipt ? (
                                <>
                                  Official electronic receipt
                                  <span className="mt-0.5 block text-xs text-oatmeal">{addressLine}</span>
                                </>
                              ) : (
                                "Confirmation email only"
                              ),
                              edit: 1,
                            },
                          ].map((r) => (
                            <div key={r.term} className="flex items-start justify-between gap-4 py-3.5">
                              <div className="min-w-0">
                                <dt className="text-xs font-medium text-oatmeal">{r.term}</dt>
                                <dd className="mt-0.5 break-words text-sm text-palladian">{r.value}</dd>
                              </div>
                              <button
                                type="button"
                                onClick={() => goTo(r.edit)}
                                aria-label={`Edit ${r.term.toLowerCase()}`}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-palladian/20 px-3 py-1.5 text-xs font-medium text-palladian transition-colors duration-300 hover:border-burning-flame hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                              >
                                <Pencil className="size-3" aria-hidden="true" />
                                Edit
                              </button>
                            </div>
                          ))}
                        </motion.dl>

                        <motion.p variants={item} className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-oatmeal">
                          <Lock className="mt-0.5 size-3.5 shrink-0 text-burning-flame" aria-hidden="true" />
                          You&apos;ll enter your card details on a secure, encrypted payment page. Nothing is charged until you confirm there.
                        </motion.p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* submit error */}
              <div role="alert">
                {submitError && (
                  <p className="mt-5 rounded-2xl border border-truffle-light/50 bg-truffle-dark/30 p-4 text-sm text-palladian-light">
                    {submitError}
                  </p>
                )}
              </div>

              {/* navigation */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="group inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-palladian transition-colors duration-300 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                  >
                    <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
                    Back
                  </button>
                ) : (
                  <span aria-hidden="true" className="hidden sm:block" />
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex w-full items-center justify-between gap-4 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 sm:w-auto sm:min-w-[250px]"
                >
                  <span className="min-w-0 truncate">
                    {status === "loading"
                      ? "Opening secure payment..."
                      : lastStep
                        ? label
                          ? `Donate ${label}${frequency === "monthly" ? " / month" : ""}`
                          : "Donate"
                        : step === 0
                          ? "Continue"
                          : "Review my gift"}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-enabled:group-hover:translate-x-0.5">
                    {status === "loading" ? (
                      <motion.span
                        aria-hidden="true"
                        className="size-4 rounded-full border-2 border-palladian/30 border-t-palladian"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : lastStep ? (
                      <Lock className="size-4" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="size-4" aria-hidden="true" />
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* ================= Summary + trust ================= */}
          <div className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-28 lg:col-span-5">
            <aside aria-label="Your gift summary" className={`${GLASS} overflow-hidden p-6 sm:p-8`}>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full text-palladian opacity-[0.07]"
                style={{
                  maskImage: "radial-gradient(ellipse 70% 50% at 100% 0%, black, transparent 80%)",
                  WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 100% 0%, black, transparent 80%)",
                }}
              >
                <rect width="100%" height="100%" fill="url(#portal-lattice)" />
              </svg>

              <div className="relative">
                <p className="text-xs font-medium text-burning-flame">Your gift</p>

                <div className="mt-2 flex items-end gap-2">
                  <div className="relative h-14 min-w-0 flex-1 overflow-hidden sm:h-16">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={label ?? "none"}
                        initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 1 : 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: reduce ? 0 : "-100%", opacity: reduce ? 0 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                        className="absolute inset-0 truncate text-5xl font-semibold leading-none tracking-tight tabular-nums text-palladian-light sm:text-6xl"
                      >
                        {label ?? "$0"}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <span className="pb-1 text-sm text-oatmeal">{frequency === "monthly" ? "/ month" : "one time"}</span>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-burning-flame/20 bg-burning-flame/[0.08] p-4">
                  <Heart className="mt-0.5 size-4 shrink-0 fill-burning-flame/30 text-burning-flame" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-palladian sm:text-sm">
                    {impact ?? "Choose an amount to see how your gift helps."}
                    {valid && frequency === "monthly" && " Monthly gifts help us plan ahead with confidence."}
                  </p>
                </div>

                <ul className="mt-5 space-y-2 text-xs text-oatmeal">
                  <li className="flex items-center gap-2">
                    <Receipt className="size-4 shrink-0 text-burning-flame" aria-hidden="true" />
                    {form.receipt ? "Official receipt requested" : "Confirmation email only"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="size-4 shrink-0 text-burning-flame" aria-hidden="true" />
                    Secure payment on the next page
                  </li>
                </ul>
              </div>
            </aside>

            <div className={`${OVERLAY_GLASS} p-5 sm:p-6`}>
              <ul className="space-y-4">
                {TRUST.map(({ Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-burning-flame/15 text-burning-flame">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-palladian-light">{title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-oatmeal">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-palladian/10 pt-4 text-xs text-oatmeal">
                Questions about giving?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-burning-flame underline underline-offset-2 hover:text-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}