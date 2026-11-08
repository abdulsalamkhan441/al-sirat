"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Landmark,
  Loader2,
  Lock,
  MapPin,
  Minus,
  Plus,
  Send,
  X,
} from "lucide-react";
import { fmtLong, fmtMoney, fmtRange, type Audience, type EventItem } from "../events/events";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type PaymentMethod = "none" | "online" | "door" | "etransfer";

export type Registration = {
  eventId: string;
  eventTitle: string;
  waitlist: boolean;
  attendingAs: Audience;
  adults: number;
  children: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
  updates: boolean;
  payment: PaymentMethod;
  total: number; // CAD
};

/** Return `checkoutUrl` to send people to your payment provider (for example Stripe Checkout). */
export type SubmitResult = void | { checkoutUrl?: string; reference?: string };

type Props = {
  event: EventItem | null;
  onClose: () => void;
  /** Plug in your API call. Throw to show the error state. */
  onSubmit?: (r: Registration) => Promise<SubmitResult>;
};

const CONTACT_EMAIL = "hello@alsirat.example"; // placeholder
const MAX_NOTES = 500;
const MAX_GUESTS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const inputBase =
  "w-full rounded-2xl border bg-abyssal-dark/55 px-5 py-3.5 text-sm text-palladian placeholder:text-oatmeal/50 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-palladian/25 focus:bg-abyssal-dark/80 focus:ring-4";
const inputOk = "border-palladian/[0.12] focus:border-burning-flame/60 focus:ring-burning-flame/10";
const inputBad = "border-truffle-light/70 focus:border-truffle-light focus:ring-truffle-light/15";

const PAYMENTS: { id: Exclude<PaymentMethod, "none">; label: string; text: string; Icon: typeof CreditCard }[] = [
  { id: "online", label: "Pay online", text: "Secure card payment on our payment partner's page.", Icon: CreditCard },
  { id: "door", label: "Pay at the door", text: "Pay when you arrive at check-in.", Icon: Banknote },
  { id: "etransfer", label: "Interac e-Transfer", text: "We email you the details after you register.", Icon: Landmark },
];

/* -------------------------------------------------------------------------- */
/*  Add to calendar (.ics)                                                    */
/* -------------------------------------------------------------------------- */

function downloadIcs(e: EventItem) {
  const d = e.date.replace(/-/g, "");
  const t = (s: string) => s.replace(":", "") + "00";
  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]|\.\d{3}/g, "");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Al Sirat//Events//EN", "BEGIN:VEVENT",
    `UID:${e.id}@alsirat`, `DTSTAMP:${stamp}`,
    `DTSTART:${d}T${t(e.start)}`, `DTEND:${d}T${t(e.end)}`,
    `SUMMARY:${esc(e.title)}`, `LOCATION:${esc(`${e.location}, ${e.address}`)}`,
    `DESCRIPTION:${esc(e.description)}`, "END:VEVENT", "END:VCALENDAR",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
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

function Stepper({ id, label, hint, value, min, max, onChange }: { id: string; label: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const btn =
    "grid size-9 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-palladian/[0.12] bg-abyssal-dark/55 px-4 py-3">
      <div>
        <p id={`${id}-label`} className="text-sm font-semibold text-palladian-light">{label}</p>
        <p className="text-[11px] text-oatmeal">{hint}</p>
      </div>
      <div role="group" aria-labelledby={`${id}-label`} className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}>
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span id={id} aria-live="polite" className="w-5 text-center text-sm font-semibold tabular-nums text-palladian-light">{value}</span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}>
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Modal (portal + backdrop blur + focus trap)                               */
/* -------------------------------------------------------------------------- */

export default function EventBookingModal({ event, onClose, onSubmit }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>{event && <Dialog key={event.id} event={event} onClose={onClose} onSubmit={onSubmit} />}</AnimatePresence>,
    document.body,
  );
}

function Dialog({ event: ev, onClose, onSubmit }: Omit<Props, "event"> & { event: EventItem }) {
  const reduce = !!useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const downOnBackdrop = useRef(false);

  const waitlist = ev.spotsLeft === 0;
  const paid = ev.price > 0 && !waitlist;
  const maxGuests = waitlist ? MAX_GUESTS : Math.min(ev.spotsLeft, MAX_GUESTS);

  const [as, setAs] = useState<Audience>(ev.audience[0]);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [updates, setUpdates] = useState(false);
  const [pay, setPay] = useState<PaymentMethod>(paid ? "online" : "none");
  const [honey, setHoney] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = useState<string | undefined>();

  const guests = adults + kids;
  const total = paid ? guests * ev.price : 0;
  const sending = status === "sending";

  const errors: Partial<Record<"name" | "email", string>> = {};
  if (name.trim().length < 2) errors.name = "Enter your name so we know who is coming.";
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Enter a valid email, like name@example.com.";
  const show = (k: "name" | "email") => (touched[k] ? errors[k] : undefined);

  /* Lock page scroll, keep focus inside, restore focus on close */
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    const bg = document.body.style.backgroundColor;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    // the space left by the hidden page scrollbar must not show the light body colour
    document.body.style.backgroundColor = "var(--color-abyssal-dark)";
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.body.style.backgroundColor = bg;
      prev?.focus?.();
    };
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'),
    ).filter((el) => el.tabIndex !== -1 && el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setTouched({ name: true, email: true });
    const keys = Object.keys(errors);
    if (keys.length) {
      formRef.current?.querySelector<HTMLElement>(`#reg-${keys[0]}`)?.focus();
      return;
    }
    if (honey) { setStatus("sent"); return; } // bots fill hidden fields: pretend success, send nothing

    const data: Registration = {
      eventId: ev.id, eventTitle: ev.title, waitlist, attendingAs: as, adults, children: kids,
      name: name.trim(), email: email.trim(), phone: phone.trim(), notes: notes.trim(), updates,
      payment: paid ? pay : "none", total,
    };
    setStatus("sending");
    try {
      let result: SubmitResult = undefined;
      if (onSubmit) result = await onSubmit(data);
      else await new Promise((r) => setTimeout(r, 1200)); // demo delay
      if (result && result.checkoutUrl && paid && pay === "online") {
        window.location.assign(result.checkoutUrl);
        return;
      }
      if (result && result.reference) setReference(result.reference);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const cta = waitlist ? "Join the waitlist" : paid && pay === "online" ? "Continue to secure payment" : paid ? "Reserve my spot" : "Confirm registration";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.address)}`;

  return (
    <motion.div
      style={{ colorScheme: "dark" }} className="fixed inset-0 z-[100] flex items-end justify-center bg-abyssal-dark/60 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
      onPointerDown={(e) => { downOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (downOnBackdrop.current && e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reg-title"
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
        data-lenis-prevent style={{ colorScheme: "dark" }} className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-y-auto overscroll-contain rounded-t-[2rem] border border-palladian/[0.14] bg-abyssal shadow-2xl shadow-abyssal-dark/80 sm:max-h-[90dvh] sm:rounded-[2rem] md:h-[min(90dvh,54rem)] md:max-h-none md:grid-cols-5 md:grid-rows-[minmax(0,1fr)] md:overflow-hidden md:grid [scrollbar-width:thin] [scrollbar-color:color-mix(in_srgb,var(--color-palladian)_28%,transparent)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-palladian/25 hover:[&::-webkit-scrollbar-thumb]:bg-palladian/40"
      >
        {/* ---------------- Left: event info ---------------- */}
        <div data-lenis-prevent className="relative min-h-0 md:col-span-2 md:overflow-y-auto md:overscroll-contain [scrollbar-width:thin] [scrollbar-color:color-mix(in_srgb,var(--color-palladian)_28%,transparent)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-palladian/25 hover:[&::-webkit-scrollbar-thumb]:bg-palladian/40">
          <div className="relative h-44 overflow-hidden sm:h-52 md:h-60">
            <motion.div
              initial={{ scale: reduce ? 1 : 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
              className="absolute inset-0 bg-linear-to-br from-blue-fantastic-light via-blue-fantastic to-truffle-dark"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ev.photo} alt="" decoding="async" onError={(e) => { e.currentTarget.style.display = "none"; }} className="absolute inset-0 size-full object-cover" />
            </motion.div>
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal via-abyssal/30 to-abyssal-dark/30" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-palladian/15 bg-abyssal-dark/60 px-3 py-1 text-[11px] font-medium text-palladian backdrop-blur-md">{ev.kind}</span>
              <span className="rounded-full border border-burning-flame/40 bg-burning-flame px-3 py-1 text-[11px] font-semibold text-abyssal">
                {ev.price === 0 ? "Free" : `${fmtMoney(ev.price)} per person`}
              </span>
            </div>
          </div>

          <div className="space-y-5 px-5 pb-6 pt-1 sm:px-7">
            <div>
              <h2 id="reg-title" className="text-2xl font-semibold leading-tight tracking-tight text-palladian-light">{ev.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-palladian/75">{ev.description}</p>
            </div>

            <ul className="space-y-3 text-sm text-palladian-light">
              <li className="flex items-start gap-3"><CalendarDays className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />{fmtLong(ev.date)}</li>
              <li className="flex items-start gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />{fmtRange(ev)}</li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />
                <span>
                  {ev.location}
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="block rounded text-xs text-oatmeal underline-offset-2 transition-colors hover:text-burning-flame hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame">
                    {ev.address} (opens in a new tab)
                  </a>
                </span>
              </li>
            </ul>

            <div>
              <p className="text-xs font-medium text-oatmeal">What to expect</p>
              <ul className="mt-2.5 space-y-2">
                {ev.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-palladian/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />{h}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-oatmeal">Spots</span>
                <span className={waitlist ? "font-semibold text-truffle-light" : ev.spotsLeft <= 15 ? "font-semibold text-burning-flame" : "text-palladian/80"}>
                  {waitlist ? "Full, waitlist open" : `${ev.spotsLeft} of ${ev.capacity} left`}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-palladian/10" aria-hidden="true">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((ev.capacity - ev.spotsLeft) / ev.capacity) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 1, ease: EASE, delay: 0.3 }}
                  className="h-full rounded-full bg-burning-flame"
                />
              </div>
            </div>

            <p className="flex flex-wrap gap-2 pt-1 text-[11px] text-oatmeal">
              {["Participate", "Learn", "Connect", "Grow together"].map((w) => (
                <span key={w} className="rounded-full border border-palladian/10 bg-palladian/5 px-2.5 py-1">{w}</span>
              ))}
            </p>
          </div>
        </div>

        {/* ---------------- Right: booking ---------------- */}
        <div data-lenis-prevent className="relative min-h-0 border-t border-palladian/10 md:col-span-3 md:overflow-y-auto md:overscroll-contain md:border-l md:border-t-0 [scrollbar-width:thin] [scrollbar-color:color-mix(in_srgb,var(--color-palladian)_28%,transparent)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-palladian/25 hover:[&::-webkit-scrollbar-thumb]:bg-palladian/40">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close registration"
            className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-palladian/15 bg-abyssal-dark/70 text-palladian backdrop-blur-md transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
          >
            <X className="size-4" aria-hidden="true" />
          </button>

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
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-palladian-light">
                  {waitlist ? "You are on the waitlist" : "You are registered"}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-palladian/75">
                  Thank you{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. We sent the details to{" "}
                  <span className="font-medium text-palladian-light">{email}</span>.
                  {waitlist ? " We will email you if a spot opens." : paid && pay === "door" ? " Please pay at the door when you arrive." : paid && pay === "etransfer" ? " Check your email for the e-Transfer details." : ""}
                </p>
                {reference && <p className="mt-3 rounded-full border border-palladian/15 bg-palladian/5 px-4 py-1.5 text-xs tabular-nums text-palladian">Reference: {reference}</p>}
                <ul className="mt-6 flex flex-wrap justify-center gap-2">
                  {[fmtLong(ev.date), fmtRange(ev), `${guests} ${guests === 1 ? "guest" : "guests"}`].map((t) => (
                    <li key={t} className="rounded-full border border-burning-flame/25 bg-burning-flame/10 px-3 py-1.5 text-xs font-medium text-burning-flame-light">{t}</li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {!waitlist && (
                    <button type="button" onClick={() => downloadIcs(ev)} className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-palladian/5 px-5 py-2.5 text-sm font-medium text-palladian transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame">
                      <Download className="size-4" aria-hidden="true" />
                      Add to calendar
                    </button>
                  )}
                  <button type="button" onClick={onClose} className="rounded-full bg-burning-flame px-6 py-2.5 text-sm font-semibold text-abyssal transition-colors hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light">
                    Done
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
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
                    <p className="text-xs font-medium text-burning-flame">{waitlist ? "Waitlist" : "Registration"}</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-palladian-light">
                      {waitlist ? "Join the waitlist" : "Reserve your spot"}
                    </h3>
                  </div>

                  {ev.audience.length > 1 && (
                    <fieldset>
                      <legend className="text-xs font-medium text-palladian/80">I am joining as</legend>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {ev.audience.map((a) => (
                          <Chip key={a} name="as" value={a} checked={as === a} onChange={() => setAs(a)}>{a === "Individuals" ? "An individual" : a === "Community members" ? "A community member" : a === "Volunteers" ? "A volunteer" : "A family"}</Chip>
                        ))}
                      </div>
                    </fieldset>
                  )}

                  <div className="space-y-2.5">
                    <p className="text-xs font-medium text-palladian/80">Who is coming?</p>
                    <Stepper id="reg-adults" label="Adults" hint="Age 18 and over" value={adults} min={1} max={Math.max(1, maxGuests - kids)} onChange={setAdults} />
                    <Stepper id="reg-kids" label="Children" hint="Under 18" value={kids} min={0} max={Math.max(0, maxGuests - adults)} onChange={setKids} />
                    {!waitlist && ev.spotsLeft < MAX_GUESTS && <p className="text-[11px] text-oatmeal">Only {ev.spotsLeft} {ev.spotsLeft === 1 ? "spot is" : "spots are"} left.</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field id="reg-name" label="Your name" error={show("name")}>
                      <input
                        id="reg-name" name="name" type="text" autoComplete="name" placeholder="Your full name"
                        value={name} onChange={(e) => { setName(e.target.value); if (status === "error") setStatus("idle"); }} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        aria-invalid={!!show("name")} aria-describedby={show("name") ? "reg-name-error" : undefined}
                        className={`${inputBase} ${show("name") ? inputBad : inputOk}`}
                      />
                    </Field>
                    <Field id="reg-phone" label="Phone (optional)">
                      <input
                        id="reg-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Your phone number"
                        value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputBase} ${inputOk}`}
                      />
                    </Field>
                  </div>
                  <Field id="reg-email" label="Email address" error={show("email")}>
                    <input
                      id="reg-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="Your email address"
                      value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }} onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      aria-invalid={!!show("email")} aria-describedby={show("email") ? "reg-email-error" : undefined}
                      className={`${inputBase} ${show("email") ? inputBad : inputOk}`}
                    />
                  </Field>

                  <Field
                    id="reg-notes"
                    label="Accessibility or dietary needs (optional)"
                    aside={<span className={`text-[11px] tabular-nums ${notes.length >= MAX_NOTES - 40 ? "text-burning-flame" : "text-oatmeal"}`}>{notes.length}/{MAX_NOTES}</span>}
                  >
                    <textarea
                      id="reg-notes" name="notes" rows={3} placeholder="Anything we should know to make this easier for you?"
                      value={notes} onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))} className={`${inputBase} ${inputOk} resize-none py-4`}
                    />
                  </Field>

                  {/* Payment (only for paid events) */}
                  {paid && (
                    <fieldset>
                      <legend className="text-xs font-medium text-palladian/80">How would you like to pay?</legend>
                      <div className="mt-2.5 grid grid-cols-1 gap-2.5">
                        {PAYMENTS.map((p) => {
                          const on = pay === p.id;
                          return (
                            <label key={p.id} className="cursor-pointer">
                              <input type="radio" name="payment" value={p.id} checked={on} onChange={() => setPay(p.id)} className="peer sr-only" />
                              <span className={`flex items-center gap-3.5 rounded-2xl border p-3.5 transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame ${on ? "border-burning-flame/60 bg-burning-flame/10" : "border-palladian/[0.12] bg-abyssal-dark/55 hover:border-palladian/25"}`}>
                                <span className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors ${on ? "border-burning-flame bg-burning-flame text-abyssal" : "border-burning-flame/25 bg-burning-flame/15 text-burning-flame"}`}>
                                  <p.Icon className="size-[18px]" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-semibold text-palladian-light">{p.label}</span>
                                  <span className="block text-xs text-oatmeal">{p.text}</span>
                                </span>
                                <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-full border ${on ? "border-burning-flame bg-burning-flame text-abyssal" : "border-palladian/25"}`}>
                                  {on && <Check className="size-3" />}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {pay === "online" && (
                        <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-oatmeal">
                          <Lock className="mt-0.5 size-3.5 shrink-0 text-burning-flame" aria-hidden="true" />
                          You will enter your card details on a secure payment page. We never see or store your card number.
                        </p>
                      )}
                    </fieldset>
                  )}

                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-palladian/80">
                    <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="peer sr-only" />
                    <span aria-hidden="true" className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame ${updates ? "border-burning-flame bg-burning-flame text-abyssal" : "border-palladian/25 bg-abyssal-dark/55"}`}>
                      {updates && <Check className="size-3.5" />}
                    </span>
                    Email me about future events at Al Sirat (optional).
                  </label>

                  {/* Honeypot: hidden from people, tempting to bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>Leave this empty<input type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
                  </div>

                  <AnimatePresence initial={false}>
                    {status === "error" && (
                      <motion.p role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-truffle-light/40 bg-truffle/15 px-4 py-3 text-sm text-palladian-light">
                        Your registration did not send. Check your connection and try again, or email us at {CONTACT_EMAIL}.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sticky footer: total + submit */}
                <div className="sticky bottom-0 mt-auto border-t border-palladian/10 bg-abyssal/95 px-5 py-4 backdrop-blur-xl sm:px-8">
                  <div className="mb-3 flex items-end justify-between gap-4 text-sm">
                    <span className="text-oatmeal">
                      {waitlist ? "No payment needed now" : paid ? `${guests} × ${fmtMoney(ev.price)}` : `${guests} ${guests === 1 ? "guest" : "guests"}`}
                    </span>
                    <span className="text-right">
                      <span className="block text-[11px] text-oatmeal">Total</span>
                      <span className="text-xl font-semibold tabular-nums text-palladian-light">{waitlist ? "$0.00" : paid ? fmtMoney(total) : "Free"}</span>
                    </span>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={reduce || sending ? undefined : { scale: 1.01 }}
                    whileTap={reduce || sending ? undefined : { scale: 0.985 }}
                    className="group flex w-full items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal disabled:cursor-wait disabled:opacity-80"
                  >
                    <span>{sending ? "Sending..." : status === "error" ? "Try again" : cta}</span>
                    <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                      {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4 -translate-x-px translate-y-px" aria-hidden="true" />}
                    </span>
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}