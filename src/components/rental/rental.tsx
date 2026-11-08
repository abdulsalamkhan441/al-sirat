"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  Mail,
  Phone,
  Send,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Mic2,
  PartyPopper,
  Sparkles,
  Trophy,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Unsplash helper. Swap for your own photos. A failed image shows a gradient + icon. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const RENTALS: { id: string; title: string; Icon: LucideIcon; text: string; photo: string; tone: string }[] = [
  { id: "community", title: "Community events", Icon: HeartHandshake, text: "Neighbourhood gatherings, festivals and open days.", photo: u("photo-1511795409834-ef04bbd61622"), tone: "from-gold-accent/60 via-blue-fantastic to-abyssal" },
  { id: "educational", title: "Educational programs", Icon: GraduationCap, text: "Classes, courses and training for every level.", photo: u("photo-1523240795612-9a054b0db644"), tone: "from-blue-fantastic-light via-blue-fantastic to-abyssal" },
  { id: "workshops", title: "Workshops", Icon: Wrench, text: "Hands-on sessions with room to spread out.", photo: u("photo-1552664730-d307ca884978"), tone: "from-truffle via-truffle-dark to-abyssal" },
  { id: "conferences", title: "Conferences", Icon: Mic2, text: "Space for speakers, panels and large audiences.", photo: u("photo-1540575467063-178a50c2df87"), tone: "from-blue-fantastic-light via-truffle-dark to-abyssal" },
  { id: "sports", title: "Sports activities", Icon: Trophy, text: "Games, practices and tournaments, indoors or out.", photo: u("photo-1546519638-68e109498ffc"), tone: "from-burning-flame-dark/60 via-truffle-dark to-abyssal" },
  { id: "family", title: "Family gatherings", Icon: Users, text: "Birthdays, reunions and get-togethers of any size.", photo: u("photo-1511895426328-dc8714191300"), tone: "from-truffle-light/60 via-blue-fantastic to-abyssal" },
  { id: "corporate", title: "Corporate meetings", Icon: Briefcase, text: "Meetings, retreats and team days away from the office.", photo: u("photo-1517048676732-d65bc937f952"), tone: "from-blue-fantastic via-abyssal-light to-abyssal" },
  { id: "exhibitions", title: "Exhibitions", Icon: Landmark, text: "Open floor space for displays, fairs and showcases.", photo: u("photo-1531058020387-3be344556be6"), tone: "from-gold-accent/60 via-truffle-dark to-abyssal" },
  { id: "occasions", title: "Special occasions", Icon: PartyPopper, text: "Celebrations and milestones made to measure.", photo: u("photo-1519741497674-611481863552"), tone: "from-burning-flame-dark/60 via-blue-fantastic to-abyssal" },
];

const MAX_MONTHS = 12; // how far ahead people can look
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Date helpers (local time, so dates never shift by a day)                  */
/* -------------------------------------------------------------------------- */

type Status = "available" | "booked" | "past";
export type Inquiry = {
  eventType: string;
  date: string | null; // YYYY-MM-DD
  dateLabel: string | null;
  flexible: boolean;
  time: string;
  guests: string;
  spaces: string[];
  wants: string[];
  name: string;
  email: string;
  phone: string;
  message: string;
};
type Errors = Partial<Record<"name" | "email" | "date" | "wants", string>>;
type SendStatus = "idle" | "sending" | "sent" | "error";

const CONTACT = { email: "hello@alsirat.example", phone: "+1 (629) 555-0129", phoneHref: "tel:+16295550129" }; // placeholders
const GUESTS = ["Under 50", "50 to 150", "150 to 300", "300+"];
const TIMES = ["Morning", "Afternoon", "Evening", "Full day"];
const SPACES = ["Indoor event space", "Outdoor area", "Classrooms", "Sports & recreation area", "Parking"];
const WANTS = ["Availability", "Pricing", "Booking process"];
const MAX_MESSAGE = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const inputBase =
  "w-full rounded-2xl border bg-abyssal-dark/55 px-5 py-3.5 text-sm text-palladian placeholder:text-oatmeal/50 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-palladian/25 focus:bg-abyssal-dark/80 focus:ring-4";
const inputOk = "border-palladian/[0.12] focus:border-burning-flame/60 focus:ring-burning-flame/10";
const inputBad = "border-truffle-light/70 focus:border-truffle-light focus:ring-truffle-light/15";

const FORM0 = {
  flexible: false, time: "", guests: "", spaces: [] as string[], wants: ["Availability"],
  name: "", email: "", phone: "", message: "",
};
type Form = typeof FORM0;

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fullDate = (d: Date) => new Intl.DateTimeFormat("en-CA", { dateStyle: "full" }).format(d);
const monthLabel = (y: number, m: number) => new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format(new Date(y, m, 1));
/** Demo pattern, used only when no real `bookedDates` are passed in. */
const demoBooked = (d: Date) => (d.getDate() * 5 + d.getMonth() * 3) % 9 === 0;

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function FacilityRentals({
  bookedDates,
  onSubmit,
}: {
  /** Fully booked dates as "YYYY-MM-DD". Pass these from your backend or CMS. */
  bookedDates?: string[];
  /** Plug in your API call. Throw to show the error state. */
  onSubmit?: (data: Inquiry) => Promise<void>;
}) {
  const reduce = !!useReducedMotion();

  const [type, setType] = useState<string>("");
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState({ y: 0, m: 0 });
  const [dir, setDir] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [focus, setFocus] = useState("");
  const focusNext = useRef(false);

  /* "today" is read on the client only, so server and client markup match */
  useEffect(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    setToday(t);
    setView({ y: t.getFullYear(), m: t.getMonth() });
    setFocus(toIso(t));
  }, []);

  const booked = useMemo(() => (bookedDates ? new Set(bookedDates) : null), [bookedDates]);
  const statusOf = (d: Date): Status => {
    if (today && d < today) return "past";
    if (booked ? booked.has(toIso(d)) : demoBooked(d)) return "booked";
    return "available";
  };

  const diff = today ? (view.y - today.getFullYear()) * 12 + (view.m - today.getMonth()) : 0;
  const shift = (n: number) => {
    setDir(n);
    const d = new Date(view.y, view.m + n, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  const first = new Date(view.y, view.m, 1).getDay();
  const count = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const rows = Array.from({ length: cells.length / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));

  /* exactly one day is tabbable (roving tabindex) */
  const prefix = `${view.y}-${pad(view.m + 1)}-`;
  const tabIso = focus.startsWith(prefix)
    ? focus
    : today && view.y === today.getFullYear() && view.m === today.getMonth()
      ? toIso(today)
      : `${prefix}01`;

  useEffect(() => {
    if (focusNext.current) {
      focusNext.current = false;
      document.getElementById(`day-${focus}`)?.focus();
    }
  }, [focus, view]);

  const onGridKey = (e: KeyboardEvent) => {
    if (!today) return;
    const d = fromIso(tabIso);
    switch (e.key) {
      case "ArrowLeft": d.setDate(d.getDate() - 1); break;
      case "ArrowRight": d.setDate(d.getDate() + 1); break;
      case "ArrowUp": d.setDate(d.getDate() - 7); break;
      case "ArrowDown": d.setDate(d.getDate() + 7); break;
      case "Home": d.setDate(d.getDate() - d.getDay()); break;
      case "End": d.setDate(d.getDate() + (6 - d.getDay())); break;
      case "PageUp": d.setMonth(d.getMonth() - 1); break;
      case "PageDown": d.setMonth(d.getMonth() + 1); break;
      default: return;
    }
    e.preventDefault();
    const max = new Date(today.getFullYear(), today.getMonth() + MAX_MONTHS, 0);
    const next = d < today ? new Date(today) : d > max ? max : d;
    setDir(next > fromIso(tabIso) ? 1 : -1);
    setFocus(toIso(next));
    setView({ y: next.getFullYear(), m: next.getMonth() });
    focusNext.current = true;
  };

  const pick = (iso: string, s: Status) => {
    setFocus(iso);
    if (s === "available") setSelected(iso);
  };

  const selectedDate = selected ? fromIso(selected) : null;
  const typeTitle = RENTALS.find((r) => r.id === type)?.title ?? "Not sure yet";

  /* ---------- inquiry form ---------- */
  const [f, setF] = useState<Form>(FORM0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SendStatus>("idle");
  const [honey, setHoney] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const sending = status === "sending";

  const errors: Errors = {};
  if (f.name.trim().length < 2) errors.name = "Enter your name so we know who to reply to.";
  if (!f.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(f.email.trim())) errors.email = "Enter a valid email, like name@example.com.";
  if (!selected && !f.flexible) errors.date = "Choose a free day on the calendar, or tick that your dates are flexible.";
  if (!f.wants.length) errors.wants = "Choose at least one thing you would like to know.";
  const show = (k: keyof Errors) => (touched[k] ? errors[k] : undefined);
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (status === "error") setStatus("idle");
  };
  const toggle = (k: "spaces" | "wants", v: string) =>
    setField(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setTouched({ name: true, email: true, date: true, wants: true });

    const keys = Object.keys(errors) as (keyof Errors)[];
    if (keys.length) {
      const k = keys[0];
      if (k === "date") document.getElementById(`day-${tabIso}`)?.focus();
      else formRef.current?.querySelector<HTMLElement>(`#inq-${k}`)?.focus();
      return;
    }
    if (honey) { setStatus("sent"); return; } // bots fill hidden fields: pretend success, send nothing

    const data: Inquiry = {
      ...f,
      name: f.name.trim(),
      email: f.email.trim(),
      eventType: typeTitle,
      date: selected,
      dateLabel: selectedDate ? fullDate(selectedDate) : null,
    };
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
    setF(FORM0);
    setTouched({});
    setStatus("idle");
    setSelected(null);
    setType("");
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  const navBtn =
    "grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame disabled:pointer-events-none disabled:opacity-30";

  return (
    <section
      id="facility-rentals"
      aria-labelledby="rentals-heading"
      className="relative isolate overflow-hidden py-20 text-palladian sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="absolute -top-4 left-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent xl:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Host
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }}>
          {/* ---------- Heading ---------- */}
          <motion.div variants={rise} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                Rental opportunities
              </div>
              <h2 id="rentals-heading" className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl">
                What you can host here
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-palladian/75 sm:text-base">
              Nine kinds of events already happen at the facility. Choose the one closest to yours,
              then check a date below.
            </p>
          </motion.div>

          {/* ---------- Rental cards ---------- */}
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RENTALS.map((r, i) => (
              <RentalCard
                key={r.id}
                r={r}
                n={i + 1}
                on={type === r.id}
                reduce={reduce}
                rise={rise}
                onToggle={() => setType((t) => (t === r.id ? "" : r.id))}
              />
            ))}
          </ul>

          {/* ---------- Availability + inquiry ---------- */}
          <motion.div variants={rise} id="booking" className="mt-20 scroll-mt-28">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                  <CalendarCheck className="size-4 text-burning-flame" aria-hidden="true" />
                  Availability &amp; booking
                </div>
                <h3 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-palladian-light sm:text-4xl lg:text-5xl">
                  Check your date, then ask us anything
                </h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-palladian/75 sm:text-base">
                Contact the Al Sirat team for availability, pricing and booking information. Pick a
                free day, tell us about your event, and a real person will reply within one working day.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
              {/* ===== Calendar ===== */}
              <div className="flex flex-col gap-5 lg:col-span-5">
              <div className="rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-4 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl sm:p-6">
                <p className="mb-4 text-xs font-medium text-oatmeal">Step 1 &middot; Choose a date</p>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p id="cal-title" aria-live="polite" className="text-lg font-semibold text-palladian-light">
                    {today ? monthLabel(view.y, view.m) : "Loading calendar"}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" aria-label="Previous month" disabled={!today || diff <= 0} onClick={() => shift(-1)} className={navBtn}>
                      <ChevronLeft className="size-5" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Next month" disabled={!today || diff >= MAX_MONTHS - 1} onClick={() => shift(1)} className={navBtn}>
                      <ChevronRight className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 min-h-[19rem]" aria-busy={!today}>
                  {today && (
                    <div role="grid" aria-labelledby="cal-title" onKeyDown={onGridKey}>
                      <div role="row" className="grid grid-cols-7 gap-1">
                        {WEEKDAYS.map((w) => (
                          <div key={w} role="columnheader" aria-label={w} className="py-2 text-center text-[11px] font-medium text-oatmeal">
                            {w[0]}
                          </div>
                        ))}
                      </div>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`${view.y}-${view.m}`}
                          initial={{ opacity: 0, x: reduce ? 0 : dir * 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: reduce ? 0 : dir * -24 }}
                          transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
                          className="space-y-1"
                        >
                          {rows.map((row, ri) => (
                            <div key={ri} role="row" className="grid grid-cols-7 gap-1">
                              {row.map((day, ci) => {
                                if (!day) return <div key={ci} role="gridcell" aria-hidden="true" />;
                                const d = new Date(view.y, view.m, day);
                                const iso = toIso(d);
                                const s = statusOf(d);
                                const sel = selected === iso;
                                const isToday = toIso(today) === iso;
                                return (
                                  <div key={ci} role="gridcell" className="flex justify-center">
                                    <button
                                      id={`day-${iso}`}
                                      type="button"
                                      tabIndex={iso === tabIso ? 0 : -1}
                                      aria-label={`${fullDate(d)}, ${s === "available" ? "available" : s === "booked" ? "booked" : "unavailable"}`}
                                      aria-pressed={sel}
                                      aria-disabled={s !== "available"}
                                      aria-current={isToday ? "date" : undefined}
                                      onClick={() => pick(iso, s)}
                                      className={`relative grid aspect-square w-full max-w-11 place-items-center rounded-full text-sm tabular-nums transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame ${
                                        sel
                                          ? "bg-burning-flame font-semibold text-abyssal shadow-lg shadow-burning-flame/25"
                                          : s === "available"
                                            ? "text-palladian-light hover:bg-burning-flame/20"
                                            : s === "booked"
                                              ? "cursor-not-allowed text-palladian/30 line-through decoration-palladian/30"
                                              : "cursor-not-allowed text-palladian/20"
                                      } ${isToday && !sel ? "ring-1 ring-burning-flame/60" : ""}`}
                                    >
                                      {day}
                                      {s === "available" && !sel && (
                                        <span aria-hidden="true" className="absolute bottom-1 size-1 rounded-full bg-burning-flame/70" />
                                      )}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-oatmeal" aria-label="Legend">
                  <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-burning-flame/70" aria-hidden="true" />Available</li>
                  <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-burning-flame" aria-hidden="true" />Your date</li>
                  <li className="flex items-center gap-2"><span className="text-palladian/40 line-through" aria-hidden="true">12</span>Booked</li>
                </ul>
              </div>
              </div>

              <NextSteps reduce={reduce} />
              </div>

              {/* ===== Inquiry form ===== */}
              <div className="relative overflow-hidden rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-5 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent sm:p-8 lg:col-span-7">
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
                      className="relative flex min-h-[460px] flex-col items-center justify-center text-center"
                    >
                      <motion.span
                        initial={{ scale: reduce ? 1 : 0.4, rotate: reduce ? 0 : -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                        className="grid size-20 place-items-center rounded-full border border-burning-flame/30 bg-burning-flame/15"
                      >
                        <CheckCircle2 className="size-10 text-burning-flame" aria-hidden="true" />
                      </motion.span>
                      <h4 className="mt-6 text-2xl font-semibold tracking-tight text-palladian-light">Inquiry sent</h4>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-palladian/75">
                        Thank you{f.name.trim() ? `, ${f.name.trim().split(" ")[0]}` : ""}. We will reply to{" "}
                        <span className="font-medium text-palladian-light">{f.email}</span> within one working day.
                      </p>
                      <ul className="mt-6 flex flex-wrap justify-center gap-2">
                        {[selectedDate ? fullDate(selectedDate) : "Flexible dates", typeTitle, f.guests && `${f.guests} guests`].filter(Boolean).map((t) => (
                          <li key={t as string} className="rounded-full border border-burning-flame/25 bg-burning-flame/10 px-3 py-1.5 text-xs font-medium text-burning-flame-light">{t}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-8 inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-palladian/5 px-5 py-2.5 text-sm font-medium text-palladian transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                      >
                        <CalendarDays className="size-4" aria-hidden="true" />
                        Send another inquiry
                      </button>
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
                      className="relative space-y-6"
                    >
                      <p className="text-xs font-medium text-oatmeal">Step 2 &middot; Tell us about your event</p>

                      {/* date */}
                      <div className="flex flex-col gap-2">
                        <div className={`flex items-center gap-3 rounded-2xl border bg-abyssal-dark/55 px-4 py-3 transition-colors ${show("date") ? "border-truffle-light/70" : "border-palladian/[0.12]"}`}>
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-burning-flame/15 text-burning-flame">
                            <CalendarDays className="size-[18px]" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[11px] text-oatmeal">Your date</span>
                            <span aria-live="polite" className="block truncate text-sm font-medium text-palladian-light">
                              {selectedDate ? fullDate(selectedDate) : f.flexible ? "Flexible, we will suggest dates" : "Pick a free day on the calendar"}
                            </span>
                          </span>
                          {selectedDate && (
                            <button type="button" aria-label="Clear selected date" onClick={() => setSelected(null)} className="grid size-8 shrink-0 place-items-center rounded-full border border-palladian/10 bg-palladian/5 text-oatmeal transition-colors hover:border-burning-flame/40 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame">
                              <X className="size-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Chip kind="checkbox" name="flexible" value="flexible" checked={f.flexible} onChange={() => setField("flexible", !f.flexible)}>
                            My dates are flexible
                          </Chip>
                        </div>
                        <FieldError id="inq-date-error" error={show("date")} />
                      </div>

                      {/* event type */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="rental-type" className="text-xs font-medium text-palladian/80">Event type</label>
                        <div className="relative">
                          <select
                            id="rental-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className={`${inputBase} ${inputOk} cursor-pointer appearance-none pr-12 [&>option]:bg-abyssal [&>option]:text-palladian`}
                          >
                            <option value="">Not sure yet</option>
                            {RENTALS.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-oatmeal" aria-hidden="true" />
                        </div>
                      </div>

                      <fieldset>
                        <legend className="text-xs font-medium text-palladian/80">How many guests?</legend>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {GUESTS.map((g) => (
                            <Chip key={g} kind="radio" name="guests" value={g} checked={f.guests === g} onChange={() => setField("guests", g)}>{g}</Chip>
                          ))}
                        </div>
                      </fieldset>

                      <fieldset>
                        <legend className="text-xs font-medium text-palladian/80">Time of day</legend>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {TIMES.map((t) => (
                            <Chip key={t} kind="radio" name="time" value={t} checked={f.time === t} onChange={() => setField("time", t)}>{t}</Chip>
                          ))}
                        </div>
                      </fieldset>

                      <fieldset>
                        <legend className="text-xs font-medium text-palladian/80">Which spaces do you need? <span className="text-oatmeal">(pick any)</span></legend>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {SPACES.map((sp) => (
                            <Chip key={sp} kind="checkbox" name="spaces" value={sp} checked={f.spaces.includes(sp)} onChange={() => toggle("spaces", sp)}>{sp}</Chip>
                          ))}
                        </div>
                      </fieldset>

                      <hr className="border-palladian/10" />
                      <p className="text-xs font-medium text-oatmeal">Step 3 &middot; How can we reach you?</p>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Field id="inq-name" label="Your name" error={show("name")}>
                          <input
                            id="inq-name" name="name" type="text" autoComplete="name" placeholder="Your full name"
                            value={f.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => touch("name")}
                            aria-invalid={!!show("name")} aria-describedby={show("name") ? "inq-name-error" : undefined}
                            className={`${inputBase} ${show("name") ? inputBad : inputOk}`}
                          />
                        </Field>
                        <Field id="inq-phone" label="Phone (optional)">
                          <input
                            id="inq-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Your phone number"
                            value={f.phone} onChange={(e) => setField("phone", e.target.value)}
                            className={`${inputBase} ${inputOk}`}
                          />
                        </Field>
                      </div>
                      <Field id="inq-email" label="Email address" error={show("email")}>
                        <input
                          id="inq-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="Your email address"
                          value={f.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => touch("email")}
                          aria-invalid={!!show("email")} aria-describedby={show("email") ? "inq-email-error" : undefined}
                          className={`${inputBase} ${show("email") ? inputBad : inputOk}`}
                        />
                      </Field>

                      <fieldset>
                        <legend className="text-xs font-medium text-palladian/80">What would you like to know?</legend>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {WANTS.map((w, i) => (
                            <Chip key={w} id={i === 0 ? "inq-wants" : undefined} kind="checkbox" name="wants" value={w} checked={f.wants.includes(w)} onChange={() => toggle("wants", w)}>{w}</Chip>
                          ))}
                        </div>
                        <FieldError id="inq-wants-error" error={show("wants")} className="mt-2" />
                      </fieldset>

                      <Field
                        id="inq-message"
                        label="Anything else? (optional)"
                        aside={
                          <span className={`text-[11px] tabular-nums transition-colors ${f.message.length >= MAX_MESSAGE - 40 ? "text-burning-flame" : "text-oatmeal"}`}>
                            {f.message.length}/{MAX_MESSAGE}
                          </span>
                        }
                      >
                        <textarea
                          id="inq-message" name="message" rows={4} placeholder="Setup needs, equipment, catering, accessibility..."
                          value={f.message} onChange={(e) => setField("message", e.target.value.slice(0, MAX_MESSAGE))}
                          className={`${inputBase} ${inputOk} resize-none py-4`}
                        />
                      </Field>

                      {/* Honeypot: hidden from people, tempting to bots */}
                      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                        <label>
                          Leave this empty
                          <input type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} />
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
                            Your inquiry did not send. Check your connection and try again, or email us at {CONTACT.email}.
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
                        <span>{sending ? "Sending..." : status === "error" ? "Try again" : "Send inquiry"}</span>
                        <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                          {sending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4 -translate-x-px translate-y-px" aria-hidden="true" />}
                        </span>
                      </motion.button>

                      <div className="flex flex-col items-center justify-center gap-2 text-center text-[11px] text-oatmeal sm:flex-row sm:gap-4">
                        <span className="flex items-center gap-2"><Clock className="size-3.5" aria-hidden="true" />A request is not a confirmed booking.</span>
                        <span className="flex items-center gap-3">
                          <a href={CONTACT.phoneHref} className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"><Phone className="size-3.5" aria-hidden="true" />{CONTACT.phone}</a>
                          <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"><Mail className="size-3.5" aria-hidden="true" />Email us</a>
                        </span>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

function RentalCard({
  r, n, on, reduce, rise, onToggle,
}: {
  r: (typeof RENTALS)[number];
  n: number;
  on: boolean;
  reduce: boolean;
  rise: Variants;
  onToggle: () => void;
}) {
  const [bad, setBad] = useState(false);
  return (
    <motion.li variants={rise} whileHover={reduce ? undefined : { y: -6 }} className="flex">
      <button
        type="button"
        aria-pressed={on}
        onClick={onToggle}
        className={`group flex w-full flex-col rounded-3xl border p-3 text-left shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:p-4 ${
          on ? "border-burning-flame/60 bg-burning-flame/10" : "border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] hover:border-burning-flame/35"
        }`}
      >
        <span className="flex items-center justify-between px-1.5 pb-3 pt-1.5">
          <span className="text-xs tabular-nums text-oatmeal">/ 0{n}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-300 ${on ? "border-burning-flame bg-burning-flame text-abyssal" : "border-palladian/15 bg-palladian/5 text-palladian"}`}>
            {on ? <Check className="size-3" aria-hidden="true" /> : <r.Icon className="size-3" aria-hidden="true" />}
            {on ? "Selected" : "Select"}
          </span>
        </span>
        <span className={`relative block aspect-[4/3] overflow-hidden rounded-2xl bg-linear-to-br ${r.tone}`}>
          <r.Icon className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
          {!bad && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.photo} alt="" loading="lazy" decoding="async" onError={() => setBad(true)} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none" />
          )}
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/70 via-transparent to-transparent" />
        </span>
        <span className="px-1.5 pb-1.5 pt-4">
          <span className="block text-lg font-semibold leading-snug tracking-tight text-palladian-light">{r.title}</span>
          <span className="mt-1 block text-sm leading-relaxed text-palladian/75">{r.text}</span>
        </span>
      </button>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form building blocks                                                      */
/* -------------------------------------------------------------------------- */

function FieldError({ id, error, className = "" }: { id: string; error?: string; className?: string }) {
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
          className={`overflow-hidden text-xs font-medium text-truffle-light ${className}`}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Field({
  id, label, error, aside, children,
}: {
  id: string; label: string; error?: string; aside?: ReactNode; children: ReactNode;
}) {
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

function Chip({
  kind, name, value, checked, onChange, id, children,
}: {
  kind: "radio" | "checkbox"; name: string; value: string; checked: boolean; onChange: () => void; id?: string; children: ReactNode;
}) {
  return (
    <label className="cursor-pointer">
      <input id={id} type={kind} name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame ${
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
/*  Photo + "what happens next" (fills the space beside the long form)        */
/* -------------------------------------------------------------------------- */

const NEXT_STEPS = [
  "Send your inquiry",
  "We confirm availability and pricing",
  "Lock in your booking",
];

/** Swap for a photo of your own facility. A failed image shows a gradient + icon. */
const NEXT_PHOTO = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=70";

function NextSteps({ reduce }: { reduce: boolean }) {
  const [bad, setBad] = useState(false);
  return (
    <div className="relative hidden min-h-[22rem] flex-1 overflow-hidden rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-blue-fantastic-light via-blue-fantastic to-truffle-dark shadow-2xl shadow-abyssal-dark/50 lg:block">
      <Building2 className="absolute left-1/2 top-[36%] size-20 -translate-x-1/2 -translate-y-1/2 text-palladian/20" aria-hidden="true" />
      {!bad && (
        <motion.img
          src={NEXT_PHOTO}
          alt="Open event hall ready for a booking"
          loading="lazy"
          decoding="async"
          onError={() => setBad(true)}
          initial={{ scale: reduce ? 1 : 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 1.6, ease: EASE }}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/90 via-abyssal-dark/25 to-abyssal-dark/10" />

      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/60 px-3 py-1.5 text-xs font-medium text-palladian backdrop-blur-md">
        <Building2 className="size-3.5 text-burning-flame" aria-hidden="true" />
        24,000+ sq. ft. ready for you
      </span>

      <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-palladian/15 bg-abyssal-dark/60 p-5 backdrop-blur-xl">
        <p className="text-sm font-semibold text-palladian-light">What happens next</p>
        <ol className="mt-4">
          {NEXT_STEPS.map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, x: reduce ? 0 : -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE, delay: reduce ? 0 : 0.15 + i * 0.12 }}
              className="relative flex items-center gap-3 pb-4 before:absolute before:left-3.5 before:top-7 before:h-[calc(100%-1.75rem)] before:w-px before:-translate-x-1/2 before:bg-palladian/20 last:pb-0 last:before:hidden"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-burning-flame text-xs font-semibold text-abyssal">{i + 1}</span>
              <span className="text-sm text-palladian/85">{t}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}