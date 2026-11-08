"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Building2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";

import { CATEGORIES, CONTACT_INFO, type CategoryId } from "./contactdata";
import { Backdrop, EASE, GLASS, Label, OVERLAY_GLASS } from "./contactshared";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Server route that receives the inquiry and emails the Al Sirat team. Must be created. */
const CONTACT_ENDPOINT = "/api/contact";

/** Replace with a photo of your own facility. If it fails to load, a gradient shows instead. */
const FORM_PHOTO =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=75";

const MAX_MESSAGE = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,20}$/;

/** 16px on phones so iOS does not zoom the page when a field is focused. */
const INPUT =
  "w-full rounded-2xl border border-palladian/20 bg-abyssal-dark/40 px-4 py-3 text-base text-palladian-light placeholder:text-oatmeal-dark transition-colors duration-300 hover:border-burning-flame/60 focus-visible:border-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame aria-[invalid=true]:border-truffle-light sm:text-sm";

type Values = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  message: string;
  /** Honeypot: real visitors never see or fill this. */
  website: string;
};

const EMPTY: Values = { name: "", email: "", phone: "", organization: "", message: "", website: "" };

/** Order matters: it is the order of the error summary. */
const FIELD_ORDER = ["name", "email", "phone", "category", "message"];

type Status = "idle" | "loading" | "sent";

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
/*  Section 3: Contact form                                                   */
/* -------------------------------------------------------------------------- */

export default function ContactForm({
  category,
  onCategoryChange,
}: {
  category: CategoryId | "";
  onCategoryChange: (c: CategoryId | "") => void;
}) {
  const reduce = !!useReducedMotion();

  const [values, setValues] = useState<Values>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bad, setBad] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef<HTMLHeadingElement>(null);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => setValues((s) => ({ ...s, [k]: v }));

  const current = CATEGORIES.find((c) => c.id === category);
  const needsOrg = category === "partnerships" || category === "sponsorships";

  /* ---------- validation ---------- */
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Enter your full name.";
    const email = values.email.trim();
    if (!email) e.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email address, like name@example.com.";
    const phone = values.phone.trim();
    if (phone && !PHONE_RE.test(phone)) e.phone = "Enter a valid phone number, or leave it blank.";
    if (!category) e.category = "Choose what your message is about.";
    const msg = values.message.trim();
    if (!msg) e.message = "Write a short message so we know how to help.";
    else if (msg.length < 10) e.message = "Please write at least a few words (10 characters or more).";
    return e;
  }, [values, category]);

  const errorKeys = FIELD_ORDER.filter((k) => errors[k]);
  const err = (k: string) => (showErrors ? errors[k] : undefined);
  const visibleKeys = showErrors ? errorKeys : [];

  function focusField(key: string) {
    document.getElementById(`cf-${key}`)?.focus();
  }

  /* ---------- submit ---------- */
  /**
   * Posts the inquiry to your server, which should validate it again and email the team.
   * The honeypot field is sent along so the server can discard bot submissions.
   */
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    if (errorKeys.length) {
      setShowErrors(true);
      requestAnimationFrame(() => focusField(errorKeys[0]));
      return;
    }

    // Bots fill hidden fields. Pretend it worked and send nothing.
    if (values.website.trim()) {
      setStatus("sent");
      return;
    }

    setStatus("loading");
    setSubmitError(null);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          category,
          categoryLabel: current?.label ?? "",
          organization: needsOrg ? values.organization.trim() : "",
          message: values.message.trim(),
          website: values.website,
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setSubmitError(
        "We couldn't send your message just now. Your details are still here, so please try again in a moment."
      );
    }
  }

  function reset() {
    setValues(EMPTY);
    onCategoryChange("");
    setShowErrors(false);
    setSubmitError(null);
    setStatus("idle");
  }

  // After sending, move focus to the confirmation and keep the card in view
  useEffect(() => {
    if (status !== "sent") return;
    sentRef.current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      cardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [status, reduce]);

  /* ---------- animation ---------- */
  const header: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  const info: { Icon: LucideIcon; label: string; content: ReactNode }[] = [
    {
      Icon: Phone,
      label: "Call us",
      content: (
        <a href={CONTACT_INFO.phone.href} className="rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame">
          {CONTACT_INFO.phone.display}
        </a>
      ),
    },
    {
      Icon: Mail,
      label: "Write to us",
      content: (
        <a href={CONTACT_INFO.email.href} className="break-all rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame">
          {CONTACT_INFO.email.display}
        </a>
      ),
    },
    {
      Icon: MapPin,
      label: "Visit us",
      content: (
        <>
          {CONTACT_INFO.address.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </>
      ),
    },
    {
      Icon: Clock,
      label: "Office hours",
      content: (
        <>
          {CONTACT_INFO.hours.map((l) => (
            <span key={l} className="block">{l}</span>
          ))}
        </>
      ),
    },
  ];

  return (
    <section
      id="contact-form"
      aria-labelledby="cf-heading"
      className="relative isolate scroll-mt-20 py-16 text-palladian sm:py-20 lg:py-24"
    >
      <Backdrop ghost="Write" ghostSide="left" />

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
            <Label Icon={Send}>Contact form</Label>
          </motion.div>
          <motion.h2
            id="cf-heading"
            tabIndex={-1}
            variants={rise}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-palladian-light focus-visible:outline-none sm:text-5xl lg:text-6xl"
          >
            Send us <span className="text-burning-flame">a message.</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/80 sm:text-base">
            Tell us a little about you and what you need. A member of the Al Sirat team will respond
            as soon as possible.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 lg:grid-cols-12 lg:items-start lg:gap-8"
        >
          {/* ================= Form ================= */}
          <div ref={cardRef} className="min-w-0 scroll-mt-24 lg:col-span-7">
            <div className={`${GLASS} p-5 sm:p-8`}>
              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    role="status"
                    initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                    className="flex flex-col items-center py-8 text-center sm:py-12"
                  >
                    <span className="grid size-20 place-items-center rounded-full border border-burning-flame/40 bg-burning-flame/15">
                      <svg viewBox="0 0 24 24" className="size-9 text-burning-flame" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <motion.path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          initial={{ pathLength: reduce ? 1 : 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: reduce ? 0 : 0.7, ease: EASE, delay: 0.2 }}
                        />
                      </svg>
                    </span>
                    <h3
                      ref={sentRef}
                      tabIndex={-1}
                      className="mt-6 text-2xl font-semibold tracking-tight text-palladian-light focus-visible:outline-none sm:text-3xl"
                    >
                      Message sent
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-palladian/80">
                      {values.name.trim() ? `Thank you, ${values.name.trim().split(/\s+/)[0]}. ` : "Thank you. "}
                      A member of the Al Sirat team will respond as soon as possible.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-8 rounded-full border border-palladian/20 px-6 py-3 text-sm font-medium text-palladian transition-colors duration-300 hover:border-burning-flame hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    aria-label="Contact form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                  >
                    <p className="mb-5 text-xs text-oatmeal">
                      Fields marked <span className="text-burning-flame">*</span> are required.
                    </p>

                    {/* error summary */}
                    <div aria-live="assertive">
                      {visibleKeys.length > 0 && (
                        <div className="mb-5 rounded-2xl border border-truffle-light/50 bg-truffle-dark/30 p-4">
                          <p className="text-sm font-semibold text-palladian-light">
                            Please fix {visibleKeys.length === 1 ? "this" : `these ${visibleKeys.length}`} before sending:
                          </p>
                          <ul className="mt-2 space-y-1">
                            {visibleKeys.map((k) => (
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id="cf-name"
                        label="Full name"
                        required
                        error={err("name")}
                        render={(p) => (
                          <input {...p} value={values.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
                        )}
                      />
                      <Field
                        id="cf-email"
                        label="Email address"
                        required
                        error={err("email")}
                        render={(p) => (
                          <input
                            {...p}
                            type="email"
                            inputMode="email"
                            value={values.email}
                            onChange={(e) => set("email", e.target.value)}
                            autoComplete="email"
                            placeholder="name@example.com"
                          />
                        )}
                      />
                      <Field
                        id="cf-phone"
                        label="Phone number"
                        error={err("phone")}
                        render={(p) => (
                          <input
                            {...p}
                            type="tel"
                            inputMode="tel"
                            value={values.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            autoComplete="tel"
                          />
                        )}
                      />
                      <Field
                        id="cf-category"
                        label="Your message is about"
                        required
                        error={err("category")}
                        render={(p) => (
                          <div className="relative">
                            <select
                              {...p}
                              value={category}
                              onChange={(e) => onCategoryChange(e.target.value as CategoryId | "")}
                              className={`${p.className} appearance-none pr-11`}
                            >
                              <option value="" disabled className="bg-abyssal text-oatmeal">
                                Select a topic
                              </option>
                              {CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id} className="bg-abyssal text-palladian-light">
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-burning-flame" />
                          </div>
                        )}
                      />

                      {/* organization appears for partnerships and sponsorships */}
                      <AnimatePresence initial={false}>
                        {needsOrg && (
                          <motion.div
                            key="org"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                            className="-mx-1 overflow-hidden px-1 sm:col-span-2"
                          >
                            <Field
                              id="cf-organization"
                              label="Organization"
                              className="pb-1"
                              render={(p) => (
                                <input
                                  {...p}
                                  value={values.organization}
                                  onChange={(e) => set("organization", e.target.value)}
                                  autoComplete="organization"
                                />
                              )}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Field
                        id="cf-message"
                        label="Message"
                        required
                        className="sm:col-span-2"
                        error={err("message")}
                        hint={`${values.message.length} of ${MAX_MESSAGE} characters`}
                        render={(p) => (
                          <textarea
                            {...p}
                            rows={6}
                            maxLength={MAX_MESSAGE}
                            value={values.message}
                            onChange={(e) => set("message", e.target.value)}
                            placeholder={current?.placeholder ?? "Tell us how we can help."}
                            className={`${p.className} min-h-[9rem] resize-y`}
                          />
                        )}
                      />

                      {/* honeypot: hidden from people and assistive tech */}
                      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                        <label htmlFor="cf-website">Leave this field empty</label>
                        <input
                          id="cf-website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={values.website}
                          onChange={(e) => set("website", e.target.value)}
                        />
                      </div>
                    </div>

                    <div role="alert">
                      {submitError && (
                        <p className="mt-5 rounded-2xl border border-truffle-light/50 bg-truffle-dark/30 p-4 text-sm text-palladian-light">
                          {submitError}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-relaxed text-oatmeal sm:max-w-[16rem]">
                        We&apos;ll use your details to respond to your inquiry.
                      </p>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="group inline-flex w-full items-center justify-between gap-4 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 motion-reduce:transition-colors motion-reduce:hover:translate-y-0 sm:w-auto sm:min-w-[220px]"
                      >
                        {status === "loading" ? "Sending..." : "Send message"}
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-enabled:group-hover:translate-x-0.5">
                          {status === "loading" ? (
                            <motion.span
                              aria-hidden="true"
                              className="size-4 rounded-full border-2 border-palladian/30 border-t-palladian"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <Send className="size-4" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ================= Photo + details ================= */}
          <div className="flex min-w-0 flex-col gap-5 lg:col-span-5">
            <div className="relative min-h-[18rem] overflow-hidden rounded-3xl border border-palladian/[0.12] shadow-2xl shadow-abyssal-dark/50 sm:min-h-[22rem]">
              <motion.div
                className="absolute inset-0 bg-linear-to-br from-blue-fantastic-light via-blue-fantastic to-truffle-dark"
                initial={{ scale: reduce ? 1 : 1.12 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0 : 1.8, ease: EASE }}
              >
                <Building2 className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-palladian/20" aria-hidden="true" />
                {!bad && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={FORM_PHOTO}
                    alt="Welcoming community space at Al Sirat Academy"
                    decoding="async"
                    loading="lazy"
                    onError={() => setBad(true)}
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
              </motion.div>
              <div aria-hidden="true" className="absolute inset-0 bg-blue-fantastic/35 mix-blend-multiply" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/90 via-abyssal-dark/20 to-abyssal-dark/10" />

              <div className={`absolute left-4 top-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm sm:left-5 sm:top-5 ${OVERLAY_GLASS} rounded-full`}>
                <Building2 className="size-4 text-burning-flame" aria-hidden="true" />
                <span className="font-semibold text-palladian-light">Al Sirat Academy</span>
              </div>

              <div className={`absolute inset-x-4 bottom-4 p-4 sm:inset-x-5 sm:bottom-5 sm:p-5 ${OVERLAY_GLASS}`}>
                <p className="text-base font-semibold leading-snug text-palladian-light sm:text-lg">
                  Real people, real answers.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-oatmeal">
                  Programs, rentals, volunteering, partnerships and more. We&apos;re here to help.
                </p>
              </div>
            </div>

            <div className={`${GLASS} p-5 sm:p-6`}>
              <p className="text-xs font-medium text-burning-flame">Prefer to reach us directly?</p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {info.map(({ Icon, label, content }) => (
                  <li key={label} className="flex items-start gap-3.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-burning-flame/15 text-burning-flame">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-oatmeal">{label}</span>
                      <span className="mt-0.5 block text-sm font-medium leading-snug text-palladian-light">{content}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}