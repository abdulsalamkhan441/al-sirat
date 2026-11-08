"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";
import ModalShell from "./modalshell";
import { sendProgramEnrollment } from "@/lib/email"; // Import utility

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type EnrollProgram = {
  id: string;
  title: string;
  categoryLabel: string;
  tone: string;
  Icon: LucideIcon;
  line: string;
  focus: string[];
  audience: string[];
  formats: ("Online" | "In person")[];
  cert: boolean;
  photo: string;
};

export type EnrolRequest = {
  programId: string;
  programTitle: string;
  format: string;
  forWhom: string;
  start: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const CONTACT = { email: "hello@alsirat.example", phone: "+1 (629) 555-0129", phoneHref: "tel:+16295550129" };
const STARTS = ["As soon as possible", "Next term", "Just exploring"];
const NEXT = ["We review your request", "We contact you within one working day", "You pick a start date and join in"];
const MAX_MESSAGE = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const inputBase =
  "w-full rounded-2xl border bg-abyssal-dark/55 px-5 py-3.5 text-sm text-palladian placeholder:text-oatmeal/50 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-palladian/25 focus:bg-abyssal-dark/80 focus:ring-4";
const inputOk = "border-palladian/[0.12] focus:border-burning-flame/60 focus:ring-burning-flame/10";
const inputBad = "border-truffle-light/70 focus:border-truffle-light focus:ring-truffle-light/15";

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
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
  );
}

function Field({ id, label, error, aside, children }: { id: string; label: string; error?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium text-palladian/80">{label}</label>
        {aside}
      </div>
      {children}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

function Chip({ name, value, checked, onChange, children }: { name: string; value: string; checked: boolean; onChange: () => void; children: ReactNode }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`inline-block rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame ${
          checked
            ? "border-burning-flame bg-burning-flame text-abyssal shadow-lg shadow-burning-flame/20"
            : "border-burning-flame/25 bg-burning-flame/10 text-burning-flame-light hover:border-burning-flame/60 hover:bg-burning-flame/15"
        }`}
      >
        {children}
      </span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal                                                                     */
/* -------------------------------------------------------------------------- */

export default function ProgramEnrollModal({
  program,
  onClose,
  onSubmit,
}: {
  program: EnrollProgram | null;
  onClose: () => void;
  onSubmit?: (r: EnrolRequest) => Promise<void>;
}) {
  return (
    <ModalShell
      open={!!program}
      onClose={onClose}
      labelledBy="enrol-title"
      left={program && <Info key={program.id} p={program} />}
      right={program && <EnrolForm key={program.id} p={program} onClose={onClose} onSubmit={onSubmit} />}
    />
  );
}

/* ----------------------------- left: program info ----------------------------- */

function Info({ p }: { p: EnrollProgram }) {
  const reduce = !!useReducedMotion();
  return (
    <>
      <div className="relative h-44 overflow-hidden sm:h-52 md:h-60">
        <motion.div
          initial={{ scale: reduce ? 1 : 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
          className={`absolute inset-0 bg-linear-to-br ${p.tone}`}
        >
          <p.Icon className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.photo} alt="" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} className="absolute inset-0 size-full object-cover" />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal via-abyssal/30 to-abyssal-dark/30" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-palladian/15 bg-abyssal-dark/60 px-3 py-1 text-[11px] font-medium text-palladian backdrop-blur-md">{p.categoryLabel}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-burning-flame/40 bg-burning-flame px-3 py-1 text-[11px] font-semibold text-abyssal">
            <Award className="size-3" aria-hidden="true" />
            {p.cert ? "Certificate available" : "Open to all"}
          </span>
        </div>
      </div>

      <div className="space-y-5 px-5 pb-6 pt-1 sm:px-7">
        <div>
          <h2 id="enrol-title" className="text-2xl font-semibold leading-tight tracking-tight text-palladian-light">{p.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-palladian/75">{p.line}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-oatmeal">What you will focus on</p>
          <ul className="mt-2.5 space-y-2">
            {p.focus.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-palladian/85">
                <Check className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />{f}
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-3 text-sm text-palladian-light">
          <li className="flex items-start gap-3">
            <Users className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />
            <span><span className="block text-[11px] text-oatmeal">Who it is for</span>{p.audience.join(", ")}</span>
          </li>
          <li className="flex items-start gap-3">
            {p.formats.includes("Online") ? <Monitor className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" /> : <MapPin className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />}
            <span><span className="block text-[11px] text-oatmeal">How it runs</span>{p.formats.join(" and ")}</span>
          </li>
        </ul>

        <div>
          <p className="text-xs font-medium text-oatmeal">What happens next</p>
          <ol className="mt-3">
            {NEXT.map((t, i) => (
              <li key={t} className="relative flex items-center gap-3 pb-3 before:absolute before:left-3 before:top-6 before:h-[calc(100%-1.5rem)] before:w-px before:-translate-x-1/2 before:bg-palladian/20 last:pb-0 last:before:hidden">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-burning-flame text-[11px] font-semibold text-abyssal">{i + 1}</span>
                <span className="text-sm text-palladian/85">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

/* ----------------------------- right: enrolment form ----------------------------- */

function EnrolForm({ p, onClose, onSubmit }: { p: EnrollProgram; onClose: () => void; onSubmit?: (r: EnrolRequest) => Promise<void> }) {
  const reduce = !!useReducedMotion();
  const formatChoices: string[] = p.formats.length > 1 ? [...p.formats, "No preference"] : [...p.formats];

  const [format, setFormat] = useState(formatChoices[0]);
  const [forWhom, setForWhom] = useState(p.audience.length > 1 ? "" : p.audience[0]);
  const [start, setStart] = useState(STARTS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const sending = status === "sending";

  const errors: Partial<Record<"name" | "email", string>> = {};
  if (name.trim().length < 2) errors.name = "Enter your name so we know who to reply to.";
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email, like name@example.com.";
  const show = (k: "name" | "email") => (touched[k] ? errors[k] : undefined);
  const clearErr = () => { if (status === "error") setStatus("idle"); };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setTouched({ name: true, email: true });
    const keys = Object.keys(errors);
    if (keys.length) {
      e.currentTarget.querySelector<HTMLElement>(`#enrol-${keys[0]}`)?.focus();
      return;
    }
    if (honey) { setStatus("sent"); return; } // bots fill hidden fields

    const data: EnrolRequest = {
      programId: p.id, programTitle: p.title, format, forWhom: forWhom || "Not specified", start,
      name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim(),
    };

    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await sendProgramEnrollment({
          programTitle: data.programTitle,
          format: data.format,
          forWhom: data.forWhom,
          start: data.start,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        });
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="done"
          role="status"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
          className="flex min-h-[480px] flex-col items-center justify-center px-6 py-16 text-center sm:px-10 md:min-h-full"
        >
          <motion.span
            initial={{ scale: reduce ? 1 : 0.4, rotate: reduce ? 0 : -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
            className="grid size-20 place-items-center rounded-full border border-burning-flame/30 bg-burning-flame/15"
          >
            <CheckCircle2 className="size-10 text-burning-flame" aria-hidden="true" />
          </motion.span>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-palladian-light">Request sent</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-palladian/75">
            Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. We will reply to{" "}
            <span className="font-medium text-palladian-light">{email}</span> within one working day about{" "}
            {p.title}.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {[format, start, forWhom].filter(Boolean).map((t) => (
              <li key={t} className="rounded-full border border-burning-flame/25 bg-burning-flame/10 px-3 py-1.5 text-xs font-medium text-burning-flame-light">{t}</li>
            ))}
          </ul>
          <button type="button" onClick={onClose} className="mt-8 rounded-full bg-burning-flame px-6 py-2.5 text-sm font-semibold text-abyssal transition-colors hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light">
            Back to programs
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative flex min-h-full flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="space-y-6 px-5 pb-6 pt-20 sm:px-8 sm:pt-20 md:pt-8">
            <div className="pr-12">
              <p className="text-xs font-medium text-burning-flame">Enrolment request</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-palladian-light">Tell us what you need</h3>
            </div>

            <fieldset>
              <legend className="text-xs font-medium text-palladian/80">How would you like to learn?</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {formatChoices.map((f) => <Chip key={f} name="format" value={f} checked={format === f} onChange={() => setFormat(f)}>{f}</Chip>)}
              </div>
            </fieldset>

            {p.audience.length > 1 && (
              <fieldset>
                <legend className="text-xs font-medium text-palladian/80">Who is it for? <span className="text-oatmeal">(optional)</span></legend>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {p.audience.map((a) => <Chip key={a} name="forWhom" value={a} checked={forWhom === a} onChange={() => setForWhom(a)}>{a}</Chip>)}
                </div>
              </fieldset>
            )}

            <fieldset>
              <legend className="text-xs font-medium text-palladian/80">When would you like to start?</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {STARTS.map((s) => <Chip key={s} name="start" value= {s} checked={start === s} onChange={() => setStart(s)}>{s}</Chip>)}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field id="enrol-name" label="Your name" error={show("name")}>
                <input
                  id="enrol-name" name="name" type="text" autoComplete="name" placeholder="Your full name"
                  value={name} onChange={(e) => { setName(e.target.value); clearErr(); }} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  aria-invalid={!!show("name")} aria-describedby={show("name") ? "enrol-name-error" : undefined}
                  className={`${inputBase} ${show("name") ? inputBad : inputOk}`}
                />
              </Field>
              <Field id="enrol-phone" label="Phone (optional)">
                <input
                  id="enrol-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Your phone number"
                  value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputBase} ${inputOk}`}
                />
              </Field>
            </div>
            <Field id="enrol-email" label="Email address" error={show("email")}>
              <input
                id="enrol-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="Your email address"
                value={email} onChange={(e) => { setEmail(e.target.value); clearErr(); }} onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={!!show("email")} aria-describedby={show("email") ? "enrol-email-error" : undefined}
                className={`${inputBase} ${show("email") ? inputBad : inputOk}`}
              />
            </Field>

            <Field
              id="enrol-message"
              label="Anything else? (optional)"
              aside={<span className={`text-[11px] tabular-nums ${message.length >= MAX_MESSAGE ? "text-burning-flame" : "text-oatmeal"}`}>{message.length}/{MAX_MESSAGE}</span>}
            >
              <textarea
                id="enrol-message" name="message" rows={3} placeholder="Your level, questions about schedule or cost, accessibility needs..."
                value={message} onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))} className={`${inputBase} ${inputOk} resize-none py-4`}
              />
            </Field>

            {/* Honeypot */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>Leave this empty<input type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
            </div>

            <AnimatePresence initial={false}>
              {status === "error" && (
                <motion.p role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-truffle-light/40 bg-truffle/15 px-4 py-3 text-sm text-palladian-light">
                  Your request did not send. Check your connection and try again, or email us at {CONTACT.email}.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="sticky bottom-0 mt-auto border-t border-palladian/10 bg-abyssal/95 px-5 py-4 backdrop-blur-xl sm:px-8">
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={reduce || sending ? undefined : { scale: 1.01 }}
              whileTap={reduce || sending ? undefined : { scale: 0.985 }}
              className="group flex w-full items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal disabled:cursor-wait disabled:opacity-80"
            >
              <span>{sending ? "Sending..." : status === "error" ? "Try again" : "Send enrolment request"}</span>
              <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4 -translate-x-px translate-y-px" aria-hidden="true" />}
              </span>
            </motion.button>
            <div className="mt-3 flex flex-col items-center justify-center gap-2 text-center text-[11px] text-oatmeal sm:flex-row sm:gap-4">
              <span className="flex items-center gap-2"><Clock className="size-3.5" aria-hidden="true" />We reply within one working day.</span>
              <span className="flex items-center gap-3">
                <a href={CONTACT.phoneHref} className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"><Phone className="size-3.5" aria-hidden="true" />{CONTACT.phone}</a>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"><Mail className="size-3.5" aria-hidden="true" />Email us</a>
              </span>
            </div>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}