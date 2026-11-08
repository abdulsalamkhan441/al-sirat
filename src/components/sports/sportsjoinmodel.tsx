"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import ModalShell from "./modalshell";
import { Chip, EMAIL_RE, Field, Stepper, inputBad, inputBase, inputOk } from "./modalparts";
import { sendSportSignup } from "@/lib/email"; // Import utility

/* -------------------------------------------------------------------------- */
/*  Types and content (placeholders, swap for real details)                   */
/* -------------------------------------------------------------------------- */

export type JoinSport = {
  id: string;
  title: string;
  groupLabel: string;
  groupBlurb: string;
  tone: string;
  Icon: LucideIcon;
  focus: string[];
  photo: string;
};

export type SportSignup = {
  sportId: string;
  sportTitle: string;
  ageGroup: string;
  participants: number;
  level: string;
  times: string[];
  name: string;
  email: string;
  phone: string;
  message: string;
};

const CONTACT = { email: "hello@alsirat.example", phone: "+1 (629) 555-0129", phoneHref: "tel:+16295550129" };
const AGE_GROUPS = ["Children", "Youth", "Adults", "Whole family"];
const LEVELS = ["Complete beginner", "Some experience", "Experienced"];
const TIMES = ["Weekday daytime", "Weekday evenings", "Weekends"];
const NEXT = ["We review your sign-up", "We contact you within one working day", "You get your first session details"];
const MAX_MESSAGE = 500;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Modal                                                                     */
/* -------------------------------------------------------------------------- */

export default function SportJoinModal({
  sport,
  onClose,
  onSubmit,
}: {
  sport: JoinSport | null;
  onClose: () => void;
  onSubmit?: (r: SportSignup) => Promise<void>;
}) {
  return (
    <ModalShell
      open={!!sport}
      onClose={onClose}
      labelledBy="join-title"
      left={sport && <Info key={sport.id} s={sport} />}
      right={sport && <JoinForm key={sport.id} s={sport} onClose={onClose} onSubmit={onSubmit} />}
    />
  );
}

/* ----------------------------- left: sport info ----------------------------- */

function Info({ s }: { s: JoinSport }) {
  const reduce = !!useReducedMotion();
  return (
    <>
      <div className="relative h-44 overflow-hidden sm:h-52 md:h-60">
        <motion.div
          initial={{ scale: reduce ? 1 : 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
          className={`absolute inset-0 bg-linear-to-br ${s.tone}`}
        >
          <s.Icon className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.photo} alt="" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} className="absolute inset-0 size-full object-cover" />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal via-abyssal/30 to-abyssal-dark/30" />
        <span className="absolute left-5 top-5 rounded-full border border-palladian/15 bg-abyssal-dark/60 px-3 py-1 text-[11px] font-medium text-palladian backdrop-blur-md">
          {s.groupLabel}
        </span>
      </div>

      <div className="space-y-5 px-5 pb-6 pt-1 sm:px-7">
        <div>
          <h2 id="join-title" className="text-2xl font-semibold leading-tight tracking-tight text-palladian-light">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-palladian/75">{s.groupBlurb}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-oatmeal">What you will build</p>
          <ul className="mt-2.5 space-y-2">
            {s.focus.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-palladian/85">
                <Check className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />{f}
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-3 text-sm text-palladian-light">
          <li className="flex items-start gap-3">
            <Users className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />
            <span><span className="block text-[11px] text-oatmeal">Who can join</span>Children, youth and adults</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />
            <span><span className="block text-[11px] text-oatmeal">Where</span>Al Sirat Community Center</span>
          </li>
        </ul>

        <div className="flex flex-wrap gap-2 text-[11px] text-oatmeal">
          {[{ t: "Stay active", I: Sprout }, { t: "Build friendships", I: HeartHandshake }, { t: "Healthy habits", I: Sprout }].map(({ t, I }) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-palladian/10 bg-palladian/5 px-2.5 py-1">
              <I className="size-3 text-burning-flame" aria-hidden="true" />{t}
            </span>
          ))}
        </div>

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

/* ----------------------------- right: sign-up form ----------------------------- */

function JoinForm({ s, onClose, onSubmit }: { s: JoinSport; onClose: () => void; onSubmit?: (r: SportSignup) => Promise<void> }) {
  const reduce = !!useReducedMotion();
  const [age, setAge] = useState(AGE_GROUPS[0]);
  const [count, setCount] = useState(1);
  const [level, setLevel] = useState(LEVELS[0]);
  const [times, setTimes] = useState<string[]>([]);
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
  const toggleTime = (t: string) => setTimes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setTouched({ name: true, email: true });
    const keys = Object.keys(errors);
    if (keys.length) {
      e.currentTarget.querySelector<HTMLElement>(`#join-${keys[0]}`)?.focus();
      return;
    }
    if (honey) { setStatus("sent"); return; } // bots fill hidden fields

    const data: SportSignup = {
      sportId: s.id, sportTitle: s.title, ageGroup: age, participants: count, level, times,
      name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim(),
    };

    setStatus("sending");
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await sendSportSignup({
          sportTitle: data.sportTitle,
          ageGroup: data.ageGroup,
          participants: data.participants,
          level: data.level,
          times: data.times,
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
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-palladian-light">You are on the list</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-palladian/75">
            Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. We will reply to{" "}
            <span className="font-medium text-palladian-light">{email}</span> within one working day with
            the next steps for {s.title}.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {[age, `${count} ${count === 1 ? "participant" : "participants"}`, level].map((t) => (
              <li key={t} className="rounded-full border border-burning-flame/25 bg-burning-flame/10 px-3 py-1.5 text-xs font-medium text-burning-flame-light">{t}</li>
            ))}
          </ul>
          <button type="button" onClick={onClose} className="mt-8 rounded-full bg-burning-flame px-6 py-2.5 text-sm font-semibold text-abyssal transition-colors hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light">
            Back to sports
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
          className="relative flex min-h-full flex-col"
        >
          <div className="space-y-6 px-5 pb-6 pt-6 sm:px-8 sm:pt-8">
            <div className="pr-12">
              <p className="text-xs font-medium text-burning-flame">Sign-up request</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-palladian-light">Join {s.title}</h3>
            </div>

            <fieldset>
              <legend className="text-xs font-medium text-palladian/80">Who is joining?</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {AGE_GROUPS.map((a) => <Chip key={a} name="age" value={a} checked={age === a} onChange={() => setAge(a)}>{a}</Chip>)}
              </div>
            </fieldset>

            <Stepper id="join-count" label="Participants" hint="How many people are signing up" value={count} min={1} max={10} onChange={setCount} />

            <fieldset>
              <legend className="text-xs font-medium text-palladian/80">Experience level</legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {LEVELS.map((l) => <Chip key={l} name="level" value={l} checked={level === l} onChange={() => setLevel(l)}>{l}</Chip>)}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-medium text-palladian/80">When suits you best? <span className="text-oatmeal">(pick any)</span></legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {TIMES.map((t) => <Chip key={t} kind="checkbox" name="times" value={t} checked={times.includes(t)} onChange={() => toggleTime(t)}>{t}</Chip>)}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field id="join-name" label="Your name" error={show("name")}>
                <input
                  id="join-name" name="name" type="text" autoComplete="name" placeholder="Your full name"
                  value={name} onChange={(e) => { setName(e.target.value); clearErr(); }} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  aria-invalid={!!show("name")} aria-describedby={show("name") ? "join-name-error" : undefined}
                  className={`${inputBase} ${show("name") ? inputBad : inputOk}`}
                />
              </Field>
              <Field id="join-phone" label="Phone (optional)">
                <input
                  id="join-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Your phone number"
                  value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputBase} ${inputOk}`}
                />
              </Field>
            </div>
            <Field id="join-email" label="Email address" error={show("email")}>
              <input
                id="join-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="Your email address"
                value={email} onChange={(e) => { setEmail(e.target.value); clearErr(); }} onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={!!show("email")} aria-describedby={show("email") ? "join-email-error" : undefined}
                className={`${inputBase} ${show("email") ? inputBad : inputOk}`}
              />
            </Field>

            <Field
              id="join-message"
              label="Anything else? (optional)"
              aside={<span className={`text-[11px] tabular-nums ${message.length >= MAX_MESSAGE ? "text-burning-flame" : "text-oatmeal"}`}>{message.length}/{MAX_MESSAGE}</span>}
            >
              <textarea
                id="join-message" name="message" rows={3} placeholder="Ages, equipment, health or accessibility notes..."
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
                  Your sign-up did not send. Check your connection and try again, or email us at {CONTACT.email}.
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
              <span>{sending ? "Sending..." : status === "error" ? "Try again" : "Send sign-up request"}</span>
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