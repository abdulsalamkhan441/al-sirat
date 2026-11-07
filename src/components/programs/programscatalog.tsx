"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Award,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Monitor,
  Presentation,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Unsplash helper. If an ID ever 404s, the image falls back to a gradient + icon. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=70`;

const OPTIONS: {
  id: string;
  title: string;
  Icon: LucideIcon;
  text: string;
  where: string;
  bestFor: string;
  pace: string;
  photo: string;
  tone: string;
}[] = [
  {
    id: "classroom",
    title: "In-Person Classroom Learning",
    Icon: GraduationCap,
    text: "Learn face to face with your teacher and classmates at the center, with help close at hand.",
    where: "At the center",
    bestFor: "Hands-on learning",
    pace: "Set class times",
    photo: u("photo-1523240795612-9a054b0db644"),
    tone: "from-blue-fantastic-light via-blue-fantastic to-abyssal",
  },
  {
    id: "online",
    title: "Online Virtual Learning",
    Icon: Monitor,
    text: "Join live sessions from home with a laptop, tablet or phone, and keep learning around your schedule.",
    where: "From home",
    bestFor: "Busy schedules",
    pace: "Live sessions",
    photo: u("photo-1516321318423-f06f85e504b3"),
    tone: "from-truffle via-truffle-dark to-abyssal",
  },
  {
    id: "weekend",
    title: "Weekend Workshops",
    Icon: CalendarDays,
    text: "Focused, practical sessions on weekends for people who work or study during the week.",
    where: "At the center",
    bestFor: "Working adults",
    pace: "Weekends",
    photo: u("photo-1552664730-d307ca884978"),
    tone: "from-burning-flame-dark/70 via-truffle-dark to-abyssal",
  },
  {
    id: "community",
    title: "Community Training Sessions",
    Icon: HeartHandshake,
    text: "Relaxed neighbourhood sessions that welcome families, newcomers and friends to learn together.",
    where: "In the community",
    bestFor: "Families & newcomers",
    pace: "Drop-in friendly",
    photo: u("photo-1511632765486-a01980e01a18"),
    tone: "from-gold-accent/60 via-blue-fantastic to-abyssal",
  },
  {
    id: "seminars",
    title: "Professional Development Seminars",
    Icon: Presentation,
    text: "Expert-led talks on leadership, workplace skills and career growth, with time for your questions.",
    where: "Center or online",
    bestFor: "Career growth",
    pace: "Single sessions",
    photo: u("photo-1540575467063-178a50c2df87"),
    tone: "from-blue-fantastic-light via-truffle-dark to-abyssal",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

function Photo({ src, Icon, tone }: { src: string; Icon: LucideIcon; tone: string }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative size-full overflow-hidden bg-linear-to-br ${tone}`}>
      <Icon className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
      {!bad && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          decoding="async"
          onError={() => setBad(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function LearningOptions() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const heads = useRef<(HTMLButtonElement | null)[]>([]);
  const o = OPTIONS[active];

  const go = (i: number, focus = false) => {
    const n = (i + OPTIONS.length) % OPTIONS.length;
    setActive(n);
    if (focus) heads.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); go(active + 1, true); }
    else if (e.key === "ArrowUp") { e.preventDefault(); go(active - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); go(0, true); }
    else if (e.key === "End") { e.preventDefault(); go(OPTIONS.length - 1, true); }
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame";

  return (
    <section
      id="learning-options"
      aria-labelledby="options-heading"
      className="relative isolate overflow-hidden py-20 text-palladian sm:py-24 lg:py-28"
    >
      {/* Decorative ghost word. The page background is shared (PageBackground). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="absolute -bottom-6 right-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent lg:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Flexible
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            {/* ================= Left: heading + image ================= */}
            <div className="lg:col-span-5">
              <motion.div variants={rise}>
                <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                  <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                  Learning &amp; delivery options
                </div>
                <h2 id="options-heading" className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl">
                  Learn the way that suits you
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-palladian/75 sm:text-base">
                  Five ways to take part, from a classroom seat to a seminar from your sofa.
                  Pick the one that fits your week.
                </p>
              </motion.div>

              <motion.div variants={rise} className="relative mt-10">
                {/* arch image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-palladian/[0.12] bg-abyssal-dark shadow-2xl shadow-abyssal-dark/50 sm:aspect-[16/10] lg:aspect-[4/5] lg:rounded-t-[14rem]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, scale: reduce ? 1 : 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
                      className="absolute inset-0"
                    >
                      <Photo src={o.photo} Icon={o.Icon} tone={o.tone} />
                    </motion.div>
                  </AnimatePresence>
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/85 via-abyssal-dark/10 to-transparent" />

                  <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={o.id}
                        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                        className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-palladian/15 bg-abyssal-dark/60 p-2.5 pr-4 backdrop-blur-xl"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-burning-flame text-abyssal">
                          <o.Icon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 text-sm font-semibold leading-snug text-palladian-light">{o.title}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* rotating certificate badge */}
                <div className="absolute -right-2 -top-5 grid size-28 place-items-center rounded-full border border-palladian/15 bg-abyssal/85 shadow-xl shadow-abyssal-dark/50 backdrop-blur-xl sm:-right-5 sm:-top-7 sm:size-32">
                  <motion.svg
                    aria-hidden="true"
                    viewBox="0 0 120 120"
                    className="absolute inset-0 size-full text-palladian"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                  >
                    <defs>
                      <path id="options-badge-path" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1 -92 0" />
                    </defs>
                    <text fill="currentColor" fontSize="9">
                      <textPath href="#options-badge-path" textLength="285" lengthAdjust="spacing">
                        Certificate of completion • For eligible programs •
                      </textPath>
                    </text>
                  </motion.svg>
                  <span className="grid size-12 place-items-center rounded-full bg-burning-flame text-abyssal sm:size-14">
                    <Award className="size-6" aria-hidden="true" />
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ================= Right: options ================= */}
            <div className="flex flex-col lg:col-span-7">
              <motion.div variants={rise} className="mb-2 flex items-center justify-between gap-4 lg:justify-end">
                <p className="text-xs text-oatmeal lg:mr-4" aria-live="polite">
                  {active + 1} of {OPTIONS.length} ways to learn
                </p>
                <div className="flex gap-2.5">
                  <button type="button" onClick={() => go(active - 1)} aria-label="Previous option" className={arrow}>
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => go(active + 1)} aria-label="Next option" className={arrow}>
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>

              <motion.ul variants={rise} onKeyDown={onKey} className="flex-1">
                {OPTIONS.map((opt, i) => {
                  const on = i === active;
                  return (
                    <li key={opt.id} className="relative border-b border-palladian/10">
                      <button
                        ref={(el) => { heads.current[i] = el; }}
                        id={`option-head-${opt.id}`}
                        type="button"
                        aria-expanded={on}
                        aria-controls={`option-panel-${opt.id}`}
                        onClick={() => setActive(i)}
                        className="group flex w-full items-center gap-4 rounded-2xl py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:gap-5 sm:py-6"
                      >
                        <span
                          className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 sm:size-12 ${
                            on
                              ? "border-burning-flame bg-burning-flame text-abyssal shadow-lg shadow-burning-flame/20"
                              : "border-burning-flame/25 bg-burning-flame/15 text-burning-flame group-hover:bg-burning-flame/25"
                          }`}
                        >
                          <opt.Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span
                          className={`flex-1 text-base font-semibold leading-snug tracking-tight transition-colors duration-300 sm:text-lg ${
                            on ? "text-palladian-light" : "text-palladian/80 group-hover:text-palladian-light"
                          }`}
                        >
                          {opt.title}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className={`size-4 shrink-0 text-burning-flame transition-all duration-300 ${on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.div
                            id={`option-panel-${opt.id}`}
                            role="region"
                            aria-labelledby={`option-head-${opt.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="pb-6 pl-0 sm:pl-[68px]">
                              <p className="max-w-lg text-sm leading-relaxed text-palladian/75">{opt.text}</p>
                              <dl className="mt-4 grid max-w-lg grid-cols-3 gap-2">
                                {[
                                  ["Where", opt.where],
                                  ["Best for", opt.bestFor],
                                  ["Pace", opt.pace],
                                ].map(([k, v]) => (
                                  <div key={k} className="rounded-2xl border border-palladian/10 bg-palladian/[0.05] px-3 py-2.5">
                                    <dt className="text-[11px] text-oatmeal">{k}</dt>
                                    <dd className="mt-0.5 text-xs font-medium leading-snug text-palladian-light">{v}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* active underline sweep */}
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{ scaleX: on ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                        className="absolute -bottom-px left-0 h-px w-full origin-left bg-burning-flame"
                      />
                    </li>
                  );
                })}
              </motion.ul>
            </div>
          </div>

          {/* ---------- Certificate strip ---------- */}
          <motion.div
            variants={rise}
            className="mt-14 flex flex-col gap-5 rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-5 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-burning-flame/25 bg-burning-flame/15 text-burning-flame">
                <Award className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-palladian-light">Certificate of completion</h3>
                <p className="mt-0.5 text-sm text-palladian/75">Available for eligible programs, in any format.</p>
              </div>
            </div>
            <a
              href="#programs-list"
              className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-6 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal"
            >
              See eligible programs
              <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}