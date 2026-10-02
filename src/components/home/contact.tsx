"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

const CONTACT = {
  email: "hello@alsirat.example",
  phone: "+1 (629) 555-0129",
  phoneHref: "tel:+16295550129",
  address: ["123 Community Way", "Winnipeg, Manitoba R3C 0A1", "Canada"],
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=123+Community+Way+Winnipeg+Manitoba",
};

const SOCIALS = [
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
  { label: "Twitter / X", href: "#", Icon: FaTwitter },
];

const TOPICS = ["General", "Classes", "Volunteering", "Donations", "Events"];

const MAX_MESSAGE = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* -------------------------------------------------------------------------- */
/*  Types and validation                                                      */
/* -------------------------------------------------------------------------- */

type FormData = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof FormData, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: FormData = { name: "", email: "", topic: "General", message: "" };

function validate(d: FormData): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2) e.name = "Enter your name so we know who to reply to.";
  if (!d.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(d.email.trim())) e.email = "Enter a valid email, like name@example.com.";
  if (d.message.trim().length < 10) e.message = "Write at least 10 characters so we can help.";
  return e;
}

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const inputBase =
  "w-full rounded-2xl border bg-abyssal-dark/55 px-5 py-3.5 text-sm text-palladian placeholder:text-oatmeal/50 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-palladian/25 focus:bg-abyssal-dark/80 focus:ring-4";
const inputOk = "border-palladian/[0.12] focus:border-burning-flame/60 focus:ring-burning-flame/10";
const inputBad = "border-truffle-light/70 focus:border-truffle-light focus:ring-truffle-light/15";

function Field({
  id,
  label,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium text-palladian/80">
          {label}
        </label>
        {aside}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden text-xs font-medium text-truffle-light"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1800);
    } catch {
      /* clipboard blocked: the link itself still works */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? `${label} copied` : `Copy ${label}`}
      className="grid size-8 shrink-0 place-items-center rounded-full border border-palladian/10 bg-palladian/5 text-oatmeal transition-colors hover:border-burning-flame/40 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
    >
      {done ? <Check className="size-3.5 text-burning-flame" /> : <Copy className="size-3.5" />}
      <span className="sr-only" aria-live="polite">{done ? "Copied" : ""}</span>
    </button>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
  action,
}: {
  icon: typeof Mail;
  label: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="group relative flex items-start gap-4 rounded-3xl border border-palladian/[0.1] bg-linear-to-br from-palladian/[0.08] to-palladian/[0.02] p-4 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl transition-colors duration-300 hover:border-burning-flame/35 sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-burning-flame/25 bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-xs text-oatmeal">{label}</span>
        <div className="mt-1 text-[15px] font-medium leading-relaxed text-palladian-light">{children}</div>
      </div>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function ContactSection({
  onSubmit,
}: {
  /** Plug in your API call. Throw to show the error state. */
  onSubmit?: (data: FormData) => Promise<void>;
}) {
  const reduce = useReducedMotion();

  const [data, setData] = useState<FormData>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honey, setHoney] = useState("");
  const firstBad = useRef<HTMLFormElement>(null);

  const errors = validate(data);
  const show = (k: keyof FormData) => (touched[k] ? errors[k] : undefined);

  const set =
    (k: keyof FormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = k === "message" ? e.target.value.slice(0, MAX_MESSAGE) : e.target.value;
      setData((d) => ({ ...d, [k]: v }));
      if (status === "error") setStatus("idle");
    };
  const blur = (k: keyof FormData) => () => setTouched((t) => ({ ...t, [k]: true }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setTouched({ name: true, email: true, message: true });

    if (Object.keys(errors).length) {
      const key = (Object.keys(errors) as (keyof FormData)[])[0];
      firstBad.current?.querySelector<HTMLElement>(`#contact-${key}`)?.focus();
      return;
    }
    if (honey) {
      // Bots fill hidden fields: pretend success, send nothing
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      if (onSubmit) await onSubmit(data);
      else await new Promise((r) => setTimeout(r, 1100)); // demo delay
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setData(EMPTY);
    setTouched({});
    setStatus("idle");
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  const sending = status === "sending";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-abyssal-dark py-20 text-palladian sm:py-24 lg:py-28"
    >
      {/* ---------- Background (same lattice + diagonal light as the other sections) ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.05]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent 78%)",
          }}
        >
          <defs>
            <pattern id="contact-star-lattice" width="96" height="96" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="28" y="28" width="40" height="40" />
                <rect x="28" y="28" width="40" height="40" transform="rotate(45 48 48)" />
                <path d="M48 0V19.7M48 76.3V96M0 48H19.7M76.3 48H96" />
                <path d="M0 -7L7 0L0 7L-7 0Z" />
                <path d="M96 -7L103 0L96 7L89 0Z" />
                <path d="M0 89L7 96L0 103L-7 96Z" />
                <path d="M96 89L103 96L96 103L89 96Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-star-lattice)" />
        </svg>
        <div className="absolute -left-48 -top-24 size-[40rem] rounded-full bg-blue-fantastic-light/30 blur-[130px]" />
        <div className="absolute -bottom-32 -right-40 size-[42rem] rounded-full bg-truffle/25 blur-[130px]" />
        <div className="absolute bottom-0 right-10 size-[22rem] rounded-full bg-burning-flame/12 blur-[110px]" />

        {/* ghost word, same treatment as "Stories" */}
        <span
          className="absolute -bottom-6 right-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent lg:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Hello
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14"
        >
          {/* ================= Left: details ================= */}
          <div className="flex flex-col lg:col-span-5">
            <motion.div variants={rise}>
              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                Contact us
              </div>
              <h2
                id="contact-heading"
                className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
              >
                Get in touch
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-palladian/75 sm:text-base">
                Questions about classes, volunteering or visiting for the first time? Send us a
                note and a real person will get back to you.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs text-oatmeal">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-burning-flame/60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-burning-flame" />
                </span>
                We usually reply within one working day
              </p>
            </motion.div>

            <motion.div variants={rise} className="mt-8 space-y-3">
              <InfoRow
                icon={Mail}
                label="Email"
                action={<CopyButton value={CONTACT.email} label="email address" />}
              >
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="break-all rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  {CONTACT.email}
                </a>
              </InfoRow>

              <InfoRow
                icon={Phone}
                label="Phone"
                action={<CopyButton value={CONTACT.phone} label="phone number" />}
              >
                <a
                  href={CONTACT.phoneHref}
                  className="rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  {CONTACT.phone}
                </a>
              </InfoRow>

              <InfoRow
                icon={MapPin}
                label="Address"
                action={
                  <a
                    href={CONTACT.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open address in Google Maps (opens in a new tab)"
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-palladian/10 bg-palladian/5 text-oatmeal transition-colors hover:border-burning-flame/40 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                  >
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                }
              >
                <address className="not-italic">
                  {CONTACT.address.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </address>
              </InfoRow>
            </motion.div>

            <motion.div variants={rise} className="mt-8 flex items-center gap-4">
              <span className="text-xs font-medium text-oatmeal">Follow us</span>
              <span aria-hidden="true" className="h-px w-8 bg-burning-flame/50" />
              <ul className="flex items-center gap-2.5">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <motion.a
                      href={href}
                      aria-label={label}
                      whileHover={reduce ? undefined : { y: -3 }}
                      whileTap={{ scale: 0.94 }}
                      className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ================= Right: form ================= */}
          <motion.div variants={rise} className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-5 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent sm:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-burning-flame/10 blur-3xl" />

              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="done"
                    role="status"
                    initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                    className="relative flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: reduce ? 1 : 0.4, rotate: reduce ? 0 : -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                      className="grid size-20 place-items-center rounded-full border border-burning-flame/30 bg-burning-flame/15"
                    >
                      <CheckCircle2 className="size-10 text-burning-flame" aria-hidden="true" />
                    </motion.span>
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-palladian-light">
                      Message sent
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-palladian/75">
                      Thank you{data.name ? `, ${data.name.trim().split(" ")[0]}` : ""}. We will reply to{" "}
                      <span className="font-medium text-palladian-light">{data.email || "your email"}</span>{" "}
                      within one working day.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-palladian/5 px-5 py-2.5 text-sm font-medium text-palladian transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={firstBad}
                    noValidate
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Field id="contact-name" label="Your name" error={show("name")}>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your full name"
                          value={data.name}
                          onChange={set("name")}
                          onBlur={blur("name")}
                          aria-invalid={!!show("name")}
                          aria-describedby={show("name") ? "contact-name-error" : undefined}
                          className={`${inputBase} ${show("name") ? inputBad : inputOk}`}
                        />
                      </Field>

                      <Field id="contact-email" label="Email address" error={show("email")}>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="Your email address"
                          value={data.email}
                          onChange={set("email")}
                          onBlur={blur("email")}
                          aria-invalid={!!show("email")}
                          aria-describedby={show("email") ? "contact-email-error" : undefined}
                          className={`${inputBase} ${show("email") ? inputBad : inputOk}`}
                        />
                      </Field>
                    </div>

                    {/* Topic chips */}
                    <fieldset>
                      <legend className="text-xs font-medium text-palladian/80">What is this about?</legend>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {TOPICS.map((t) => {
                          const on = data.topic === t;
                          return (
                            <label key={t} className="cursor-pointer">
                              <input
                                type="radio"
                                name="topic"
                                value={t}
                                checked={on}
                                onChange={() => setData((d) => ({ ...d, topic: t }))}
                                className="peer sr-only"
                              />
                              <span
                                className={`inline-block rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame ${
                                  on
                                    ? "border-burning-flame bg-burning-flame text-abyssal shadow-lg shadow-burning-flame/20"
                                    : "border-burning-flame/25 bg-burning-flame/10 text-burning-flame-light hover:border-burning-flame/60 hover:bg-burning-flame/15"
                                }`}
                              >
                                {t}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <Field
                      id="contact-message"
                      label="Message"
                      error={show("message")}
                      aside={
                        <span
                          className={`text-[11px] tabular-nums transition-colors ${
                            data.message.length >= MAX_MESSAGE - 40 ? "text-burning-flame" : "text-oatmeal"
                          }`}
                        >
                          {data.message.length}/{MAX_MESSAGE}
                        </span>
                      }
                    >
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        placeholder="Write something...."
                        value={data.message}
                        onChange={set("message")}
                        onBlur={blur("message")}
                        aria-invalid={!!show("message")}
                        aria-describedby={show("message") ? "contact-message-error" : undefined}
                        className={`${inputBase} resize-none py-4 ${show("message") ? inputBad : inputOk}`}
                      />
                    </Field>

                    {/* Honeypot: hidden from people, tempting to bots */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        Leave this empty
                        <input
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honey}
                          onChange={(e) => setHoney(e.target.value)}
                        />
                      </label>
                    </div>

                    <AnimatePresence initial={false}>
                      {status === "error" && (
                        <motion.p
                          role="alert"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="rounded-2xl border border-truffle-light/40 bg-truffle/15 px-4 py-3 text-sm text-palladian-light"
                        >
                          Your message did not send. Check your connection and try again, or email us
                          at {CONTACT.email}.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={reduce || sending ? undefined : { scale: 1.01 }}
                      whileTap={reduce || sending ? undefined : { scale: 0.985 }}
                      className="group flex w-full items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal disabled:cursor-wait disabled:opacity-80"
                    >
                      <span>{sending ? "Sending..." : status === "error" ? "Try again" : "Send message"}</span>
                      <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                        {sending ? (
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Send className="size-4 -translate-x-px translate-y-px" aria-hidden="true" />
                        )}
                      </span>
                    </motion.button>

                    <p className="flex items-center justify-center gap-2 text-center text-[11px] text-oatmeal">
                      <Clock className="size-3.5" aria-hidden="true" />
                      Your details are only used to reply to this message.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}