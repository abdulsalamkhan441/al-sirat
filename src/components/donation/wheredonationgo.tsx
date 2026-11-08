"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  CalendarHeart,
  Check,
  GraduationCap,
  HandHeart,
  Sprout,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

type Area = {
  id: string;
  Icon: LucideIcon;
  title: string;
  short: string;
  text: string;
  funds: string[];
};

const AREAS: Area[] = [
  {
    id: "education",
    Icon: GraduationCap,
    title: "Educational programs",
    short: "Learning for every age",
    text: "Classes and learning opportunities that help students and community members build knowledge and confidence.",
    funds: ["Class materials and learning resources", "Tutoring and study support", "Workshops and guest instructors"],
  },
  {
    id: "youth",
    Icon: Sprout,
    title: "Youth development initiatives",
    short: "Growing tomorrow's leaders",
    text: "Programs that give young people mentorship, skills and a positive place to grow.",
    funds: ["Mentorship and leadership programs", "Skill-building activities", "Safe, welcoming spaces for youth"],
  },
  {
    id: "sports",
    Icon: Trophy,
    title: "Sports activities",
    short: "Play, fitness and teamwork",
    text: "Sports that bring people together, keep them active and teach teamwork.",
    funds: ["Equipment and gear", "Leagues, games and tournaments", "Facility time and coaching"],
  },
  {
    id: "events",
    Icon: CalendarHeart,
    title: "Community events",
    short: "Moments that connect us",
    text: "Gatherings and celebrations that bring neighbours together and strengthen community bonds.",
    funds: ["Event setup and supplies", "Community gatherings and celebrations", "Programs open to everyone"],
  },
  {
    id: "support",
    Icon: HandHeart,
    title: "Support services",
    short: "Help for individuals and families",
    text: "Services that give individuals and families the support they need, when they need it.",
    funds: ["Assistance for families in need", "Referrals and community resources", "Care and outreach"],
  },
];

/** Swap for the donation portal link when it is ready (keep in sync with DonateHero). */
const DONATE_HREF = "#support";

/* Glass system shared with the rest of the site */
const GLASS =
  "relative rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function WhereDonationsGo() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const touched = useRef(false);

  function select(next: number, focus = false) {
    const n = (next + AREAS.length) % AREAS.length;
    touched.current = true;
    setDir(n >= active ? 1 : -1);
    setActive(n);
    const el = tabs.current[n];
    if (focus) el?.focus();
    // keep the active tab visible in the horizontal scroller on small screens
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "center" });
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        select(active + 1, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        select(active - 1, true);
        break;
      case "Home":
        e.preventDefault();
        select(0, true);
        break;
      case "End":
        e.preventDefault();
        select(AREAS.length - 1, true);
        break;
    }
  }

  const header: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  const panel: Variants = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 40 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: reduce ? 0 : 0.45, ease: EASE, staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.05 },
    },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -40, transition: { duration: reduce ? 0 : 0.22, ease: EASE } }),
  };
  const item: Variants = {
    enter: { opacity: 0, y: reduce ? 0 : 14 },
    center: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: EASE } },
  };

  const current = AREAS[active];
  const CurrentIcon = current.Icon;

  return (
    <section
      id="where-donations-go"
      aria-labelledby="where-heading"
      className="relative isolate py-16 text-palladian sm:py-20 lg:py-24"
    >
    <div className="absolute -right-40 top-1/4 size-[34rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
    <div className="absolute -left-40 bottom-0 size-[36rem] rounded-full bg-burning-flame/10 blur-3xl" />
    <span
        className="absolute -top-4 left-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent xl:block"
        style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
    >
        Impact
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
            <div className="inline-flex items-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/50 px-3.5 py-1.5 text-[13px] font-medium text-palladian backdrop-blur-md">
              <HandHeart className="size-4 text-burning-flame" aria-hidden="true" />
              Your impact
            </div>
          </motion.div>
          <motion.h2
            id="where-heading"
            variants={rise}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl"
          >
            Where your <span className="text-burning-flame">donations go.</span>
          </motion.h2>
          <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/80 sm:text-base">
            Your generosity reaches five areas of community life. Explore each one to see what it
            helps make possible.
          </motion.p>
        </motion.div>

        {/* ================= Tabs + panel ================= */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.1 }}
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-12 lg:gap-8"
        >
          {/* tab list */}
          <LayoutGroup id="impact-tabs">
            <div
              role="tablist"
              aria-label="Areas your donations support"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:col-span-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {AREAS.map((a, k) => {
                const on = k === active;
                const Icon = a.Icon;
                return (
                  <button
                    key={a.id}
                    ref={(el) => {
                      tabs.current[k] = el;
                    }}
                    id={`tab-${a.id}`}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls="impact-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(k)}
                    className={`group relative shrink-0 snap-start overflow-hidden rounded-full border px-4 py-3 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame lg:w-full lg:rounded-3xl lg:px-5 lg:py-4 ${
                      on
                        ? "border-burning-flame text-abyssal"
                        : "border-palladian/[0.16] bg-abyssal-dark/40 text-palladian shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl hover:border-burning-flame/60"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="impact-active"
                        aria-hidden="true"
                        className="absolute inset-0 bg-burning-flame"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative flex items-center gap-3">
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                          on
                            ? "border-abyssal/20 bg-abyssal/10 text-abyssal"
                            : "border-burning-flame/25 bg-burning-flame/15 text-burning-flame group-hover:bg-burning-flame group-hover:text-abyssal"
                        }`}
                      >
                        <Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block whitespace-nowrap text-sm font-semibold lg:whitespace-normal">{a.title}</span>
                        <span className={`mt-0.5 hidden text-xs lg:block ${on ? "text-abyssal/70" : "text-oatmeal"}`}>{a.short}</span>
                      </span>
                      <span aria-hidden="true" className={`ml-auto hidden text-xs font-semibold tabular-nums lg:block ${on ? "text-abyssal/60" : "text-oatmeal-dark"}`}>
                        0{k + 1}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          {/* panel */}
          <div className="min-w-0 lg:col-span-7">
            <div className={`${GLASS} overflow-hidden`}>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full text-palladian opacity-[0.07]"
                style={{
                  maskImage: "radial-gradient(ellipse 70% 50% at 100% 0%, black, transparent 80%)",
                  WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 100% 0%, black, transparent 80%)",
                }}
              >
                <rect width="100%" height="100%" fill="url(#dw-lattice)" />
              </svg>
              {/* blueprint corners */}
              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 size-6 rounded-tl-lg border-l-2 border-t-2 border-burning-flame/70 sm:left-5 sm:top-5" />
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 size-6 rounded-tr-lg border-r-2 border-t-2 border-burning-flame/70 sm:right-5 sm:top-5" />

              {/* ghost number */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`n-${current.id}`}
                  aria-hidden="true"
                  initial={{ opacity: 0, y: reduce ? 0 : 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                  className="pointer-events-none absolute -bottom-6 right-4 select-none text-[9rem] font-semibold leading-none tracking-tight text-transparent sm:text-[12rem]"
                  style={{ WebkitTextStroke: "1px rgba(238,233,223,0.08)" }}
                >
                  0{active + 1}
                </motion.span>
              </AnimatePresence>

              <div
                id="impact-panel"
                role="tabpanel"
                aria-labelledby={`tab-${current.id}`}
                tabIndex={0}
                className="relative min-h-[22rem] p-6 pt-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:min-h-[24rem] sm:p-10 sm:pt-16"
              >
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.div
                    key={current.id}
                    custom={dir}
                    variants={panel}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <motion.div variants={item} className="flex items-center gap-4">
                      <span className="grid size-14 place-items-center rounded-full border border-burning-flame/25 bg-burning-flame/15 text-burning-flame sm:size-16">
                        <motion.span
                          initial={{ rotate: reduce ? 0 : -25, scale: reduce ? 1 : 0.6 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                          className="grid place-items-center"
                        >
                          <CurrentIcon className="size-6 sm:size-7" aria-hidden="true" />
                        </motion.span>
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-oatmeal">
                        Area {active + 1} of {AREAS.length}
                      </span>
                    </motion.div>

                    <motion.h3 variants={item} className="mt-6 max-w-md text-2xl font-semibold leading-tight tracking-tight text-palladian-light sm:text-4xl">
                      {current.title}
                    </motion.h3>
                    <motion.p variants={item} className="mt-3 max-w-lg text-sm leading-relaxed text-palladian/80 sm:text-base">
                      {current.text}
                    </motion.p>

                    <motion.p variants={item} className="mt-6 text-xs font-medium uppercase tracking-wider text-burning-flame">
                      What it helps fund
                    </motion.p>
                    <ul className="mt-3 grid max-w-md gap-2">
                      {current.funds.map((f) => (
                        <motion.li
                          key={f}
                          variants={item}
                          className="flex items-start gap-3 text-sm text-palladian"
                        >
                          <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-burning-flame/20 text-burning-flame">
                            <Check className="size-3" />
                          </span>
                          {f}
                        </motion.li>
                      ))}
                    </ul>

                    <motion.div variants={item} className="mt-8">
                      <a
                        href={DONATE_HREF}
                        className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark"
                      >
                        Give to our community
                        <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </span>
                      </a>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}