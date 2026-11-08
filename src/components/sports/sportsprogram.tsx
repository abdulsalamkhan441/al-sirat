"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  Bike,
  Dumbbell,
  Flower2,
  Goal,
  HeartHandshake,
  HeartPulse,
  Medal,
  Mountain,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import SportJoinModal, { type JoinSport, type SportSignup } from "./sportsjoinmodel";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Unsplash helper. If an ID ever 404s, the card falls back to a gradient + icon. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

type GroupId = "indoor" | "outdoor" | "community";

const GROUPS: Record<GroupId, { label: string; blurb: string; tone: string }> = {
  indoor: {
    label: "Indoor sports",
    blurb: "Courts, halls and studios where skill, focus and confidence grow, whatever the weather.",
    tone: "from-blue-fantastic-light via-blue-fantastic to-abyssal",
  },
  outdoor: {
    label: "Outdoor sports",
    blurb: "Team games on open fields that build fitness, leadership and sportsmanship.",
    tone: "from-burning-flame-dark/60 via-truffle-dark to-abyssal",
  },
  community: {
    label: "Community recreation",
    blurb: "Relaxed, social activities for the whole family and everyone in the community.",
    tone: "from-gold-accent/60 via-blue-fantastic to-abyssal",
  },
};

type Sport = { id: string; title: string; group: GroupId; Icon: LucideIcon; focus: string[]; photo: string };

const SPORTS: Sport[] = [
  /* Indoor */
  { id: "basketball", title: "Basketball", group: "indoor", Icon: Trophy, focus: ["Coordination", "Teamwork", "Athletic skills"], photo: u("photo-1546519638-68e109498ffc") },
  { id: "volleyball", title: "Volleyball", group: "indoor", Icon: Users, focus: ["Communication", "Teamwork", "Agility", "Fitness"], photo: u("photo-1612872087720-bb876e2e67d1") },
  { id: "gymnastics", title: "Gymnastics", group: "indoor", Icon: Medal, focus: ["Flexibility", "Balance", "Strength", "Confidence"], photo: u("photo-1518611012118-696072aa579a") },
  { id: "karate", title: "Karate", group: "indoor", Icon: Swords, focus: ["Discipline", "Focus", "Self-confidence", "Fitness"], photo: u("photo-1555597673-b21d5c935865") },
  { id: "yoga", title: "Yoga", group: "indoor", Icon: Flower2, focus: ["Wellness", "Flexibility", "Stress management", "Mental well-being"], photo: u("photo-1544367567-0f2fcb009e0b") },
  { id: "table-tennis", title: "Table Tennis", group: "indoor", Icon: Target, focus: ["Concentration", "Coordination", "Reflexes", "Healthy competition"], photo: u("photo-1534158914592-062992fbe900") },
  /* Outdoor */
  { id: "cricket", title: "Cricket", group: "outdoor", Icon: Zap, focus: ["Teamwork", "Sportsmanship", "Technical skills"], photo: u("photo-1531415074968-036ba1b575da") },
  { id: "soccer", title: "Soccer", group: "outdoor", Icon: Goal, focus: ["Fitness", "Teamwork", "Leadership", "Strategic thinking"], photo: u("photo-1431324155629-1a6deb1dec8d") },
  /* Community recreation (focus tags are placeholders) */
  { id: "hiking", title: "Hiking", group: "community", Icon: Mountain, focus: ["Fitness", "Nature", "Friendship"], photo: u("photo-1551632811-561732d1e306") },
  { id: "cycling", title: "Cycling", group: "community", Icon: Bike, focus: ["Endurance", "Healthy living", "Group rides"], photo: u("photo-1541625602330-2277a4c46182") },
  { id: "outdoor-fitness", title: "Outdoor Fitness Programs", group: "community", Icon: Dumbbell, focus: ["Fitness", "Strength", "Fresh air"], photo: u("photo-1476480862126-209bfaa8edc8") },
  { id: "family-days", title: "Family Sports Days", group: "community", Icon: HeartHandshake, focus: ["Family fun", "Teamwork", "All ages"], photo: u("photo-1472162072942-cd5147eb3902") },
  { id: "tournaments", title: "Seasonal Tournaments", group: "community", Icon: Trophy, focus: ["Healthy competition", "Sportsmanship", "Community"], photo: u("photo-1574629810360-7efbbe195018") },
  { id: "wellness", title: "Community Wellness Activities", group: "community", Icon: HeartPulse, focus: ["Wellness", "Balance", "Connection"], photo: u("photo-1506126613408-eca07ce68773") },
];

const TABS: { id: "all" | GroupId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "community", label: "Community recreation" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const toJoin = (s: Sport): JoinSport => ({
  id: s.id,
  title: s.title,
  groupLabel: GROUPS[s.group].label,
  groupBlurb: GROUPS[s.group].blurb,
  tone: GROUPS[s.group].tone,
  Icon: s.Icon,
  focus: s.focus,
  photo: s.photo,
});

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

function SportCard({ s, i, reduce, onJoin }: { s: Sport; i: number; reduce: boolean; onJoin: (s: Sport) => void }) {
  const [bad, setBad] = useState(false);
  const g = GROUPS[s.group];
  return (
    <motion.li
      layout={reduce ? false : "position"}
      initial={{ opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.55, ease: EASE, delay: reduce ? 0 : Math.min(i, 7) * 0.05 } }}
      exit={{ opacity: 0, scale: reduce ? 1 : 0.95, transition: { duration: reduce ? 0 : 0.2 } }}
      whileHover={reduce ? undefined : { y: -6 }}
      onClick={(e) => {
        // the whole card opens the sign-up; focus the button first so focus returns to it on close
        e.currentTarget.querySelector<HTMLElement>("button")?.focus();
        onJoin(s);
      }}
      className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-3xl border border-palladian/[0.12] bg-abyssal-dark shadow-xl shadow-abyssal-dark/40 transition-colors duration-300 hover:border-burning-flame/40"
    >
      <div className={`absolute inset-0 bg-linear-to-br ${g.tone}`}>
        <s.Icon className="absolute left-1/2 top-[38%] size-16 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
        {!bad && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.photo}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setBad(true)}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07] motion-reduce:transition-none"
          />
        )}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark via-abyssal-dark/50 to-abyssal-dark/5" />

      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-palladian/15 bg-abyssal-dark/60 px-2.5 py-1 text-[11px] font-medium text-palladian backdrop-blur-md">
        <s.Icon className="size-3 text-burning-flame" aria-hidden="true" />
        {g.label}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex flex-col p-4 sm:p-5">
        <h3 className="text-xl font-semibold leading-tight tracking-tight text-palladian-light">{s.title}</h3>
        <ul aria-label="Key focus" className="mt-3 flex flex-wrap gap-1.5">
          {s.focus.map((f) => (
            <li key={f} className="rounded-full border border-burning-flame/25 bg-burning-flame/10 px-2.5 py-1 text-[11px] font-medium text-burning-flame-light">
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`Join ${s.title}`}
            className="rounded text-sm font-medium text-palladian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
          >
            Join in
          </button>
          <span className="grid size-10 place-items-center rounded-full border border-palladian/25 bg-abyssal-dark/50 text-palladian transition-all duration-300 group-hover:rotate-45 group-hover:border-burning-flame group-hover:bg-burning-flame group-hover:text-abyssal">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function SportsPrograms({
  onJoin,
}: {
  /** Plug in your API call for the sign-up form. Throw to show the error state. */
  onJoin?: (r: SportSignup) => Promise<void>;
}) {
  const reduce = !!useReducedMotion();
  const [tab, setTab] = useState<"all" | GroupId>("all");
  const [joining, setJoining] = useState<Sport | null>(null);

  const list = useMemo(() => SPORTS.filter((s) => tab === "all" || s.group === tab), [tab]);
  const count = (id: "all" | GroupId) => (id === "all" ? SPORTS.length : SPORTS.filter((s) => s.group === id).length);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  const onKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    let n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = TABS.length - 1;
    if (n < 0) return;
    e.preventDefault();
    setTab(TABS[n].id);
    document.getElementById(`sports-tab-${TABS[n].id}`)?.focus();
  };

  return (
    <section
      id="sports-programs"
      aria-labelledby="sports-list-heading"
      className="relative isolate overflow-hidden py-20 text-palladian sm:py-24 lg:py-28"
    >
      {/* Decorative ghost word. The page background is shared (PageBackground). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="absolute -top-4 right-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent lg:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Play
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {/* Heading */}
          <motion.div variants={rise} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                {SPORTS.length} ways to play
              </div>
              <h2 id="sports-list-heading" className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl">
                Find your sport
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-palladian/75 sm:text-base">
              Team games, martial arts, wellness and family fun. Pick a group to see what is on
              offer, then tell us which one you want to join.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={rise} className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div role="tablist" aria-label="Sport groups" onKeyDown={onKey} className="inline-flex min-w-max rounded-full border border-palladian/15 bg-abyssal-dark/55 p-1 backdrop-blur-md">
              {TABS.map((t) => {
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    id={`sports-tab-${t.id}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="sports-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:text-sm ${
                      on ? "text-abyssal" : "text-palladian hover:text-burning-flame"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="sports-tab-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-burning-flame"
                      />
                    )}
                    <span className="relative">{t.label}</span>
                    <span className={`relative rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${on ? "bg-abyssal/15" : "bg-palladian/10"}`}>
                      {count(t.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Group blurb */}
          <motion.div variants={rise} className="mt-5 min-h-[2.5rem] px-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={tab}
                aria-live="polite"
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
                className="max-w-xl text-sm text-oatmeal"
              >
                {tab === "all" ? "Every sport and activity, from indoor courts to community days out." : GROUPS[tab].blurb}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Grid */}
          <div id="sports-panel" role="tabpanel" aria-labelledby={`sports-tab-${tab}`} className="mt-4">
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout" initial>
                {list.map((s, i) => (
                  <SportCard key={s.id} s={s} i={i} reduce={reduce} onJoin={setJoining} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Blurred-background sign-up modal: sport info on one side, form on the other */}
      <SportJoinModal sport={joining ? toJoin(joining) : null} onClose={() => setJoining(null)} onSubmit={onJoin} />
    </section>
  );
}