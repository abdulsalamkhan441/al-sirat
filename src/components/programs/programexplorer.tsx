"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  Award,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

type Format = "online" | "in-person";

const PROGRAMS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  line: string;
  online: string;
  inPerson: string;
  badge: string;
}[] = [
  {
    id: "educational",
    label: "Educational",
    Icon: GraduationCap,
    line: "Structured courses that build knowledge step by step.",
    online: "Live and recorded lessons",
    inPerson: "Classroom sessions at the center",
    badge: "Certificate available",
  },
  {
    id: "professional",
    label: "Professional",
    Icon: Briefcase,
    line: "Practical training for the skills employers look for.",
    online: "Flexible evening cohorts",
    inPerson: "Hands-on workshops with mentors",
    badge: "Certificate available",
  },
  {
    id: "personal",
    label: "Personal development",
    Icon: Sprout,
    line: "Habits, confidence and focus you can use every day.",
    online: "Guided online series",
    inPerson: "Small group sessions",
    badge: "Certificate available",
  },
  {
    id: "community",
    label: "Community",
    Icon: HeartHandshake,
    line: "Workshops and circles open to families and neighbours.",
    online: "Open online gatherings",
    inPerson: "Drop-in friendly evenings",
    badge: "Open to everyone",
  },
];

const FORMATS: { id: Format; label: string }[] = [
  { id: "online", label: "Online" },
  { id: "in-person", label: "In person" },
];

const CYCLE_MS = 5500;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function ProgramsExplorer() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [format, setFormat] = useState<Format>("online");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Auto-advance. Paused on hover/focus, and off for reduced motion. */
  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % PROGRAMS.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduce]);

  const go = (i: number, focus = false) => {
    const n = (i + PROGRAMS.length) % PROGRAMS.length;
    setActive(n);
    if (focus) tabs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(active + 1, true); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(active - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); go(0, true); }
    else if (e.key === "End") { e.preventDefault(); go(PROGRAMS.length - 1, true); }
  };

  /* Soft pointer tilt (mouse only) */
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const untilt = () => { rx.set(0); ry.set(0); };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  const p = PROGRAMS[active];
  const still = paused || !!reduce;

  return (
    <section
      id="programs-explorer"
      aria-labelledby="explorer-heading"
      className="relative isolate overflow-hidden py-20 text-palladian sm:py-24 lg:py-28"
    >
      {/* Decorative ghost word. The page background is shared (PageBackground). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="absolute -bottom-6 left-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent lg:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Learn
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10"
        >
          {/* ================= Left: intro + controls ================= */}
          <div className="flex flex-col lg:col-span-5">
            <motion.div variants={rise}>
              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                Our programs
              </div>
              <h2
                id="explorer-heading"
                className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
              >
                Find the program that fits you
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-palladian/75 sm:text-base">
                Educational, professional, personal development and community programs, all in one
                place. Choose how you want to learn, then look at each type.
              </p>
            </motion.div>

            <motion.div variants={rise} className="mt-7 flex flex-wrap items-center gap-3">
              <span id="format-label" className="text-xs font-medium text-oatmeal">
                How would you like to learn?
              </span>
              <div
                role="radiogroup"
                aria-labelledby="format-label"
                className="relative inline-flex rounded-full border border-palladian/15 bg-abyssal-dark/55 p-1 backdrop-blur-md"
              >
                {FORMATS.map((f) => {
                  const on = format === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setFormat(f.id)}
                      className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame ${
                        on ? "text-abyssal" : "text-palladian hover:text-burning-flame"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="format-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-full bg-burning-flame"
                        />
                      )}
                      <span className="relative">{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Legend list, mirrors the dial so labels are always visible */}
            <motion.ul variants={rise} className="mt-8 space-y-2.5">
              {PROGRAMS.map((pr, i) => {
                const on = i === active;
                return (
                  <li key={pr.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => go(i)}
                      className={`group flex w-full items-center gap-4 rounded-3xl border p-3.5 text-left backdrop-blur-xl transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame ${
                        on
                          ? "border-burning-flame/40 bg-burning-flame/10"
                          : "border-palladian/10 bg-linear-to-br from-palladian/[0.08] to-palladian/[0.02] hover:border-burning-flame/35"
                      }`}
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                          on
                            ? "border-burning-flame bg-burning-flame text-abyssal"
                            : "border-burning-flame/25 bg-burning-flame/15 text-burning-flame"
                        }`}
                      >
                        <pr.Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-palladian-light">{pr.label}</span>
                        <span className="block truncate text-xs text-oatmeal">
                          {format === "online" ? pr.online : pr.inPerson}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          </div>

          {/* ================= Right: program dial ================= */}
          <motion.div variants={rise} className="lg:col-span-7">
            <div
              className="relative mx-auto w-full max-w-[540px] px-4 py-4 sm:px-8"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => { setPaused(false); untilt(); }}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              onPointerMove={tilt}
            >
              <motion.div
                style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
                className="relative aspect-square w-full"
              >
                <motion.div
                  aria-hidden="true"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 80, ease: "linear", repeat: Infinity }}
                  className="absolute -inset-3 rounded-full border border-dashed border-palladian/10 sm:-inset-5"
                />

                <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90 overflow-visible">
                  <circle cx="50" cy="50" r="50" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" className="stroke-palladian/15" />
                  <motion.circle
                    key={`${active}-${paused}`}
                    cx="50"
                    cy="50"
                    r="50"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="stroke-burning-flame"
                    initial={{ pathLength: still ? 1 : 0, opacity: still ? 0.35 : 1 }}
                    animate={{ pathLength: 1, opacity: still ? 0.35 : 1 }}
                    transition={{ duration: still ? 0.3 : CYCLE_MS / 1000, ease: "linear" }}
                  />
                </svg>

                {/* centre panel */}
                <div className="absolute inset-[13%] grid place-items-center overflow-hidden rounded-full border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.1] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/60 backdrop-blur-xl">
                  <div aria-hidden="true" className="absolute -right-10 -top-10 size-40 rounded-full bg-burning-flame/15 blur-3xl" />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`${p.id}-${format}`}
                      id="program-panel"
                      role="tabpanel"
                      aria-labelledby={`program-tab-${p.id}`}
                      initial={{ opacity: 0, y: reduce ? 0 : 14, filter: reduce ? "none" : "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                      transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                      className="relative flex max-w-[78%] flex-col items-center text-center"
                    >
                      <span className="grid size-10 place-items-center rounded-full border border-burning-flame/30 bg-burning-flame/15 text-burning-flame sm:size-14">
                        <p.Icon className="size-5 sm:size-7" aria-hidden="true" />
                      </span>
                      <h3 className="mt-2.5 text-base font-semibold leading-tight tracking-tight text-palladian-light sm:mt-4 sm:text-2xl">
                        {p.label}
                      </h3>
                      <p className="mt-1.5 text-[11px] leading-snug text-palladian/75 sm:mt-2 sm:text-sm sm:leading-relaxed">
                        {p.line}
                      </p>
                      <p className="mt-2 text-[11px] font-medium text-burning-flame-light sm:mt-3 sm:text-xs">
                        {format === "online" ? p.online : p.inPerson}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-burning-flame/25 bg-burning-flame/10 px-2.5 py-1 text-[10px] font-medium text-burning-flame-light sm:mt-3 sm:text-[11px]">
                        <Award className="size-3" aria-hidden="true" />
                        {p.badge}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* nodes */}
                <div role="tablist" aria-label="Program types" onKeyDown={onKey} className="absolute inset-0">
                  {PROGRAMS.map((pr, i) => {
                    const a = (-90 + i * 90) * (Math.PI / 180);
                    const on = i === active;
                    return (
                      <button
                        key={pr.id}
                        ref={(el) => { tabs.current[i] = el; }}
                        id={`program-tab-${pr.id}`}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-controls="program-panel"
                        aria-label={pr.label}
                        tabIndex={on ? 0 : -1}
                        onClick={() => go(i)}
                        style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
                        className="group/node absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal"
                      >
                        <motion.span
                          whileHover={reduce ? undefined : { scale: 1.1 }}
                          whileTap={{ scale: 0.94 }}
                          animate={{ scale: on ? 1.12 : 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`grid size-12 place-items-center rounded-full border backdrop-blur-md transition-colors duration-300 sm:size-14 ${
                            on
                              ? "border-burning-flame bg-burning-flame text-abyssal shadow-lg shadow-burning-flame/25"
                              : "border-palladian/20 bg-abyssal-light/80 text-palladian hover:border-burning-flame/60 hover:text-burning-flame"
                          }`}
                        >
                          <pr.Icon className="size-5 sm:size-6" aria-hidden="true" />
                        </motion.span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}