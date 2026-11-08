"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BellRing,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Star,
  Trophy,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Unsplash helper. Swap for photos of your own events. A failed image shows a gradient + icon. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const KINDS: { id: string; title: string; Icon: LucideIcon; line: string; photo: string; tone: string }[] = [
  {
    id: "workshops", title: "Workshops", Icon: Wrench,
    line: "Hands-on sessions to learn something new.",
    photo: u("photo-1552664730-d307ca884978"), tone: "from-truffle via-truffle-dark to-abyssal",
  },
  {
    id: "sports", title: "Sports activities", Icon: Trophy,
    line: "Games, leagues and open play for every age.",
    photo: u("photo-1546519638-68e109498ffc"), tone: "from-burning-flame-dark/60 via-truffle-dark to-abyssal",
  },
  {
    id: "gatherings", title: "Community gatherings", Icon: HeartHandshake,
    line: "Meals, celebrations and evenings spent together.",
    photo: u("photo-1511632765486-a01980e01a18"), tone: "from-gold-accent/60 via-blue-fantastic to-abyssal",
  },
  {
    id: "training", title: "Training sessions", Icon: GraduationCap,
    line: "Skill-building courses led by experienced trainers.",
    photo: u("photo-1427504494785-3a9ca7044f45"), tone: "from-blue-fantastic-light via-blue-fantastic to-abyssal",
  },
  {
    id: "special", title: "Special programs", Icon: Star,
    line: "Seasonal and one-off events worth marking in the calendar.",
    photo: u("photo-1492684223066-81342ee5ff30"), tone: "from-blue-fantastic-light via-truffle-dark to-abyssal",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const pad = (n: number) => String(n).padStart(2, "0");

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

function CoverPhoto({ k, className = "" }: { k: (typeof KINDS)[number]; className?: string }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative size-full overflow-hidden bg-linear-to-br ${k.tone} ${className}`}>
      <k.Icon className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
      {!bad && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={k.photo} alt="" decoding="async" draggable={false} onError={() => setBad(true)} className="absolute inset-0 size-full select-none object-cover" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function EventsHero() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(2);
  const [ready, setReady] = useState(false);
  const last = KINDS.length - 1;
  const a = KINDS[active];

  /* the fan-out entrance only delays cards the first time */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1600);
    return () => clearTimeout(t);
  }, []);

  const go = (i: number) => setActive(Math.min(last, Math.max(0, i)));

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(last); }
  };
  const onPanEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(active + 1);
    else if (info.offset.x > 50) go(active - 1);
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.2 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };
  const line: Variants = {
    hidden: { y: reduce ? "0%" : "110%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };

  const arrow =
    "grid size-11 shrink-0 place-items-center rounded-full border border-palladian/15 bg-abyssal-dark/50 text-palladian backdrop-blur-md transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame disabled:pointer-events-none disabled:opacity-30";

  return (
    <section
      id="events-hero"
      aria-labelledby="events-heading"
      className="relative isolate overflow-hidden pb-16 pt-32 text-palladian sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40"
    >
      {/* Background photo follows the selected card, and dissolves into the shared page background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent)] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
            className="absolute inset-0"
          >
            <CoverPhoto k={a} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-abyssal-dark/75" />
        <div className="absolute inset-0 bg-linear-to-b from-abyssal-dark/90 via-abyssal-dark/30 to-abyssal-dark/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent,rgba(17,26,36,0.7))]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
          {/* ---------- Message ---------- */}
          <motion.div variants={rise}>
            <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
              <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
              Events &amp; Community Activities
            </div>
          </motion.div>

          <h1
            id="events-heading"
            className="mt-6 text-center text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-palladian-light sm:text-6xl lg:text-7xl"
          >
            <span className="block overflow-hidden pb-1.5">
              <motion.span variants={line} className="block">There is always</motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={line} className="block text-burning-flame">something happening.</motion.span>
            </span>
          </h1>

          <motion.p variants={rise} className="mt-5 max-w-xl text-center text-sm leading-relaxed text-palladian/80 sm:text-base">
            Workshops, sports, gatherings and training, all in one place. Stay informed about what
            is coming up at Al Sirat and find a way to take part.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href="#upcoming-events"
              className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:min-w-[230px]"
            >
              See upcoming events
              <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/40 px-6 py-3.5 text-sm font-medium text-palladian backdrop-blur-md transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
            >
              <BellRing className="size-4" aria-hidden="true" />
              Get event updates
            </a>
          </motion.div>

          {/* ---------- Curved card rail ---------- */}
          <motion.div variants={rise} className="mt-12 w-full sm:mt-14">
            <div
              role="group"
              aria-roledescription="carousel"
              aria-label="Types of events"
              onKeyDown={onKey}
              className="relative mx-auto h-[290px] w-full max-w-[1100px] sm:h-[360px] lg:h-[440px]"
            >
              <motion.div onPanEnd={onPanEnd} className="absolute inset-0 cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y", perspective: 1400 }}>
                {KINDS.map((k, i) => {
                  const off = i - active;
                  const abs = Math.abs(off);
                  const far = abs > 2;
                  const on = off === 0;
                  return (
                    <motion.button
                      key={k.id}
                      type="button"
                      onClick={() => go(i)}
                      tabIndex={far ? -1 : 0}
                      aria-hidden={far}
                      aria-current={on}
                      aria-label={`${k.title}, ${i + 1} of ${KINDS.length}`}
                      initial={{ x: "0%", scale: 0.5, opacity: 0, rotateY: 0 }}
                      animate={{
                        x: `${off * 72}%`,
                        rotateY: off * -30,
                        scale: on ? 1 : abs === 1 ? 0.84 : abs === 2 ? 0.7 : 0.55,
                        opacity: far ? 0 : on ? 1 : abs === 1 ? 0.9 : 0.6,
                      }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 130, damping: 20, delay: ready ? 0 : 0.5 + abs * 0.1 }
                      }
                      style={{ zIndex: 10 - abs, transformStyle: "preserve-3d" }}
                      className={`absolute left-1/2 top-1/2 aspect-[3/4] w-[178px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border text-left shadow-2xl shadow-abyssal-dark/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:w-[230px] lg:w-[290px] ${
                        on ? "border-burning-flame/50" : "border-palladian/15"
                      }`}
                    >
                      <CoverPhoto k={k} />
                      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/90 via-abyssal-dark/10 to-transparent" />
                      <span className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 sm:inset-x-4 sm:bottom-4">
                        <span className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 sm:size-10 ${on ? "bg-burning-flame text-abyssal" : "bg-abyssal-dark/70 text-burning-flame backdrop-blur-md"}`}>
                          <k.Icon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold leading-tight text-palladian-light sm:text-base">{k.title}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* caption + controls */}
            <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
              <button type="button" aria-label="Previous event type" disabled={active === 0} onClick={() => go(active - 1)} className={arrow}>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <div className="min-h-[4.5rem] w-full max-w-sm text-center" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                  >
                    <p className="text-lg font-semibold text-palladian-light">{a.title}</p>
                    <p className="mt-1 text-sm text-palladian/75">{a.line}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <button type="button" aria-label="Next event type" disabled={active === last} onClick={() => go(active + 1)} className={arrow}>
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="text-xs tabular-nums text-oatmeal">{pad(active + 1)}</span>
              <div className="flex gap-1.5" aria-hidden="true">
                {KINDS.map((k, i) => (
                  <span key={k.id} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-burning-flame" : "w-3 bg-palladian/20"}`} />
                ))}
              </div>
              <span className="text-xs tabular-nums text-oatmeal">{pad(KINDS.length)}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}