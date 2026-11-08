"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import {
  AUDIENCES,
  fmtLong,
  fmtMoney,
  fmtRange,
  fmtShort,
  parseDate,
  type Audience,
  type EventItem,
} from "./events";
import { EASE, GLASS, OVERLAY, THEMES, matchesTheme, type ThemeId } from "./shared";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

type Props = {
  /** Upcoming events, soonest first. */
  events: EventItem[];
  theme: ThemeId | null;
  onThemeChange: (t: ThemeId | null) => void;
  onRegister: (e: EventItem) => void;
};

type Tab = "All" | Audience;
const TABS: Tab[] = ["All", ...AUDIENCES];
const tabLabel = (t: Tab) => (t === "All" ? "All events" : t);

const PER_PAGE = 3;
const FEATURED_COUNT = 4;

// Semicircular bite at the bottom centre of the featured card; the arrows sit inside it.
const NOTCH = "radial-gradient(circle 60px at 50% 100%, transparent 59px, #000 60.5px)";

const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-palladian/15 bg-palladian/[0.07] px-3 py-1 text-xs font-medium text-palladian";
const audienceChip =
  "rounded-full border border-burning-flame/25 bg-burning-flame/10 px-2.5 py-0.5 text-[11px] font-medium text-burning-flame-light";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function daysUntil(iso: string, now: Date | null) {
  if (!now) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseDate(iso).getTime() - today.getTime()) / 86_400_000);
}

const whenLabel = (d: number | null) =>
  d === null ? "" : d <= 0 ? "Today" : d === 1 ? "Tomorrow" : `In ${d} days`;

/** Remote photos fail quietly: a palette gradient sits underneath. */
function Photo({ src, className = "" }: { src: string; className?: string }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-br from-blue-fantastic-light via-blue-fantastic to-truffle-dark" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className={`absolute inset-0 size-full object-cover ${className}`}
      />
    </>
  );
}

function SpotsMeter({ e }: { e: EventItem }) {
  const full = e.spotsLeft === 0;
  const low = !full && e.spotsLeft <= 15;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-oatmeal">Spots</span>
        <span className={full ? "font-semibold text-truffle-light" : low ? "font-semibold text-burning-flame" : "text-palladian/80"}>
          {full ? "Full, waitlist open" : `${e.spotsLeft} of ${e.capacity} left`}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-palladian/10" aria-hidden="true">
        <div
          className={`h-full rounded-full ${full ? "bg-truffle-light" : "bg-burning-flame"}`}
          style={{ width: `${((e.capacity - e.spotsLeft) / e.capacity) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Event row                                                                 */
/* -------------------------------------------------------------------------- */

function EventRow({
  e,
  now,
  onRegister,
  variants,
}: {
  e: EventItem;
  now: Date | null;
  onRegister: (e: EventItem) => void;
  variants: Variants;
}) {
  const full = e.spotsLeft === 0;
  const when = whenLabel(daysUntil(e.date, now));

  return (
    <motion.li variants={variants} className="group/row grid gap-4 md:grid-cols-[11.5rem_1fr]">
      {/* Photo */}
      <div className="relative h-44 overflow-hidden rounded-3xl border border-palladian/[0.12] md:h-auto md:min-h-[10rem]">
        <Photo src={e.photo} className="transition-transform duration-700 ease-out group-hover/row:scale-110 motion-reduce:transition-none motion-reduce:group-hover/row:scale-100" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/70 via-transparent to-abyssal-dark/20" />
        <span className="absolute left-3 top-3 rounded-full border border-palladian/15 bg-abyssal-dark/60 px-3 py-1 text-[11px] font-medium text-palladian backdrop-blur-md">
          {e.kind}
        </span>
        {when && (
          <span className="absolute bottom-3 left-3 rounded-full bg-burning-flame px-3 py-1 text-[11px] font-semibold text-abyssal">
            {when}
          </span>
        )}
      </div>

      {/* Details */}
      <div
        className={`${GLASS} flex flex-col gap-5 p-5 transition-all duration-300 group-hover/row:-translate-y-0.5 group-hover/row:border-burning-flame/40 motion-reduce:group-hover/row:translate-y-0 md:flex-row md:items-stretch`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className={chip}>
              <CalendarDays className="size-3.5 text-burning-flame" aria-hidden="true" />
              {fmtShort(e.date)}
            </span>
            <span className={chip}>
              <Clock className="size-3.5 text-burning-flame" aria-hidden="true" />
              {fmtRange(e)}
            </span>
          </div>

          <h3 className="mt-3.5 text-lg font-semibold leading-snug tracking-tight text-palladian-light sm:text-xl">
            {e.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-palladian/70">{e.blurb}</p>

          <p className="mt-3 flex items-center gap-2 text-xs text-oatmeal">
            <MapPin className="size-3.5 shrink-0 text-burning-flame" aria-hidden="true" />
            <span className="truncate">{e.location}</span>
          </p>

          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Who this is for">
            {e.audience.map((a) => (
              <li key={a} className={audienceChip}>{a}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-palladian/10 pt-4 md:w-52 md:shrink-0 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] text-oatmeal">{e.price === 0 ? "Entry" : "Per person"}</p>
              <p className="text-xl font-semibold tabular-nums text-palladian-light">{fmtMoney(e.price)}</p>
            </div>
          </div>
          <SpotsMeter e={e} />
          <button
            type="button"
            onClick={() => onRegister(e)}
            aria-label={`${full ? "Join the waitlist for" : "Register for"} ${e.title}`}
            className="group/btn inline-flex items-center justify-center gap-2 rounded-full border border-burning-flame/50 bg-burning-flame/10 px-5 py-2.5 text-sm font-semibold text-burning-flame-light transition-all duration-300 hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark"
          >
            {full ? "Join waitlist" : "Register"}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function UpcomingEvents({ events, theme, onThemeChange, onRegister }: Props) {
  const reduce = useReducedMotion();
  const [now, setNow] = useState<Date | null>(null);
  const [tab, setTab] = useState<Tab>("All");
  const [page, setPage] = useState(0);
  const [feat, setFeat] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Client-only, so server and browser markup agree
  useEffect(() => setNow(new Date()), []);
  useEffect(() => setPage(0), [theme]);

  const featured = events.slice(0, FEATURED_COUNT);
  const f = featured[Math.min(feat, Math.max(featured.length - 1, 0))];

  const inTab = (e: EventItem, t: Tab) => t === "All" || e.audience.includes(t);
  const themed = theme ? events.filter((e) => matchesTheme(e, theme)) : events;
  const filtered = themed.filter((e) => inTab(e, tab));
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages - 1);
  const pageItems = filtered.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);
  const activeTheme = theme ? THEMES.find((t) => t.id === theme) : null;

  const goPage = (p: number) => {
    setPage(p);
    listRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  };
  const pickTab = (t: Tab) => {
    setTab(t);
    setPage(0);
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + TABS.length) % TABS.length;
    else return;
    e.preventDefault();
    pickTab(TABS[n]);
    document.getElementById(`aud-tab-${n}`)?.focus();
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.8, ease: EASE } },
  };
  const list: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
    exit: { opacity: 0, y: reduce ? 0 : -8, transition: { duration: 0.15 } },
  };
  const row: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.6, ease: EASE } },
  };

  return (
    <section id="upcoming" aria-labelledby="upcoming-heading" className="relative scroll-mt-24 py-20 text-palladian sm:py-24 lg:py-28">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        {/* ---------- Header ---------- */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
          >
            <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
            Upcoming events
          </motion.div>
          <motion.h2
            id="upcoming-heading"
            variants={rise}
            className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
          >
            Find your next gathering
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/75 sm:text-base">
            Opportunities for individuals, families, volunteers and community
            members. Pick one and save your spot in a minute.
          </motion.p>
        </div>

        {/* ---------- Featured (next up) ---------- */}
        {f && (
          <motion.div variants={rise} className="relative mt-12">
            <div
              style={{ maskImage: NOTCH, WebkitMaskImage: NOTCH }}
              className="relative h-[30rem] overflow-hidden rounded-3xl border border-palladian/[0.12] bg-blue-fantastic shadow-2xl shadow-abyssal-dark/50 sm:h-[32rem]"
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={f.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: "easeOut" }}
                >
                  <Photo src={f.photo} />
                </motion.div>
              </AnimatePresence>
              <div aria-hidden="true" className="absolute inset-0 bg-blue-fantastic/30 mix-blend-multiply" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark via-abyssal-dark/35 to-abyssal-dark/10" />

              <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-burning-flame/40 bg-burning-flame px-3.5 py-1.5 text-xs font-semibold text-abyssal">
                  Next up
                </span>
                {now && (
                  <span className="rounded-full border border-palladian/20 bg-abyssal-dark/55 px-3.5 py-1.5 text-xs font-medium text-palladian backdrop-blur-md">
                    {whenLabel(daysUntil(f.date, now))}
                  </span>
                )}
              </div>
              <span className="absolute right-5 top-5 rounded-full border border-palladian/20 bg-abyssal-dark/55 px-3.5 py-1.5 text-xs font-medium tabular-nums text-palladian backdrop-blur-md">
                {Math.min(feat, featured.length - 1) + 1} / {featured.length}
              </span>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                  className={`absolute inset-x-4 bottom-20 p-5 md:bottom-6 md:left-6 md:right-auto md:w-[min(34rem,calc(50%-5.5rem))] md:min-w-[17rem] md:p-6 ${OVERLAY}`}
                >
                  <div className="flex flex-wrap gap-2">
                    <span className={chip}>
                      <CalendarDays className="size-3.5 text-burning-flame" aria-hidden="true" />
                      {fmtLong(f.date)}
                    </span>
                    <span className={chip}>
                      <Clock className="size-3.5 text-burning-flame" aria-hidden="true" />
                      {fmtRange(f)}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-2xl font-semibold leading-tight tracking-tight text-palladian-light sm:text-[1.7rem]">
                    {f.title}
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-sm text-palladian/75">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />
                    {f.location}, {f.address}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRegister(f)}
                    className="group/cta mt-4 inline-flex items-center gap-3 rounded-full bg-burning-flame py-1.5 pl-5 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark md:hidden"
                  >
                    {f.spotsLeft === 0 ? "Join waitlist" : "Register"}
                    <span className="grid size-9 place-items-center rounded-full bg-abyssal-dark text-palladian">
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </button>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-6 right-6 hidden w-56 flex-col gap-3 md:flex">
                <div className={`${OVERLAY} p-4`}>
                  <SpotsMeter e={f} />
                </div>
                <button
                  type="button"
                  onClick={() => onRegister(f)}
                  className="group/cta inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-1.5 pl-5 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark"
                >
                  {f.spotsLeft === 0 ? "Join waitlist" : "Register"}
                  <span className="grid size-9 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover/cta:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </div>

            {/* arrows sit in the bite */}
            {featured.length > 1 && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2" role="group" aria-label="Featured events">
                {[
                  { label: "Previous event", Icon: ChevronLeft, d: -1 },
                  { label: "Next event", Icon: ChevronRight, d: 1 },
                ].map(({ label, Icon, d }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    onClick={() => setFeat((i) => (i + d + featured.length) % featured.length)}
                    className="grid size-10 place-items-center rounded-full border border-palladian/20 bg-palladian/10 text-palladian backdrop-blur-xl transition-colors duration-300 hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ---------- Audience tabs ---------- */}
        <motion.div variants={rise} className="mt-10">
          <div
            role="tablist"
            aria-label="Show events for"
            className="flex gap-1 overflow-x-auto rounded-full border border-palladian/[0.12] bg-palladian/[0.06] p-1.5 shadow-xl shadow-abyssal-dark/30 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((t, i) => {
              const active = t === tab;
              const n = themed.filter((e) => inTab(e, t)).length;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  id={`aud-tab-${i}`}
                  aria-selected={active}
                  aria-controls="aud-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => pickTab(t)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className="relative shrink-0 rounded-full px-4 py-2.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  {active && (
                    <motion.span
                      layoutId="aud-pill"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-burning-flame"
                    />
                  )}
                  <span className={`relative flex items-center gap-2 transition-colors duration-300 ${active ? "text-abyssal" : "text-palladian/80 hover:text-palladian"}`}>
                    {tabLabel(t)}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                        active ? "bg-abyssal/15 text-abyssal" : "bg-palladian/10 text-oatmeal"
                      }`}
                    >
                      {n}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {activeTheme && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-palladian/80">
                  <span>Showing events to</span>
                  <button
                    type="button"
                    onClick={() => onThemeChange(null)}
                    aria-label={`Clear the ${activeTheme.label} filter`}
                    className="group/x inline-flex items-center gap-2 rounded-full border border-burning-flame/40 bg-burning-flame/15 py-1 pl-3.5 pr-2 text-sm font-semibold text-burning-flame-light transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                  >
                    <activeTheme.Icon className="size-4" aria-hidden="true" />
                    {activeTheme.label}
                    <span className="grid size-5 place-items-center rounded-full bg-abyssal-dark/40">
                      <X className="size-3" aria-hidden="true" />
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ---------- List ---------- */}
        <div ref={listRef} role="tabpanel" id="aud-panel" aria-labelledby={`aud-tab-${TABS.indexOf(tab)}`} className="mt-6 scroll-mt-28">
          <p className="sr-only" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "event" : "events"} found
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`${GLASS} flex flex-col items-center px-6 py-14 text-center`}
              >
                <span className="grid size-14 place-items-center rounded-full border border-burning-flame/30 bg-burning-flame/15">
                  <CalendarX className="size-6 text-burning-flame" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-palladian-light">Nothing scheduled here yet</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-palladian/70">
                  There are no upcoming events for this group right now. New dates are added often, so check back soon.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    pickTab("All");
                    onThemeChange(null);
                  }}
                  className="mt-6 rounded-full border border-burning-flame/50 bg-burning-flame/10 px-5 py-2.5 text-sm font-semibold text-burning-flame-light transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  Show all events
                </button>
              </motion.div>
            ) : (
              <motion.ul
                key={`${tab}|${theme}|${safePage}`}
                variants={list}
                initial="hidden"
                animate="show"
                exit="exit"
                className="space-y-4"
              >
                {pageItems.map((e) => (
                  <EventRow key={e.id} e={e} now={now} onRegister={onRegister} variants={row} />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* ---------- Pagination ---------- */}
        {pages > 1 && (
          <motion.nav variants={rise} aria-label="Event pages" className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goPage(safePage - 1)}
              disabled={safePage === 0}
              aria-label="Previous page"
              className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === safePage ? "page" : undefined}
                className={`grid size-10 place-items-center rounded-full border text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame ${
                  i === safePage
                    ? "border-burning-flame bg-burning-flame text-abyssal"
                    : "border-palladian/15 bg-palladian/5 text-palladian hover:border-burning-flame/60"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goPage(safePage + 1)}
              disabled={safePage === pages - 1}
              aria-label="Next page"
              className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </motion.nav>
        )}
      </motion.div>
    </section>
  );
}