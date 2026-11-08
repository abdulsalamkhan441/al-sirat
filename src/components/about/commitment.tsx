"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HandHelping,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Lightbulb,
  Network,
  ShieldCheck,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import Footer from "../common/footer";

/* -------------------------------------------------------------------------- */
/* Content                                                                   */
/* -------------------------------------------------------------------------- */

type Commitment = { title: string; text: string; Icon: LucideIcon };

const ITEMS: Commitment[] = [
  {
    title: "Education for all ages",
    text: "Accessible educational opportunities for learners of every age.",
    Icon: GraduationCap,
  },
  {
    title: "Career development",
    text: "Support for career development and workforce readiness.",
    Icon: Briefcase,
  },
  {
    title: "Healthy lifestyles",
    text: "Healthy living promoted through sports and recreation.",
    Icon: HeartPulse,
  },
  {
    title: "Community engagement",
    text: "Community engagement and volunteerism, encouraged every day.",
    Icon: HandHelping,
  },
  {
    title: "Leadership and confidence",
    text: "Leadership, confidence and lifelong learning, fostered in everyone.",
    Icon: Sprout,
  },
  {
    title: "Everyone is welcome",
    text: "An inclusive environment where everyone feels welcome and valued.",
    Icon: HeartHandshake,
  },
];

// The three ideas in the closing statement
const PILLARS: { title: string; sub: string; Icon: LucideIcon }[] = [
  { title: "Collaboration", sub: "Working side by side", Icon: Handshake },
  { title: "Innovation", sub: "Fresh ideas, real impact", Icon: Lightbulb },
  { title: "Partnerships", sub: "Stronger together", Icon: Network },
];

const N = ITEMS.length;
const STEP = 360 / N;
const AUTOPLAY_MS = 5500;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const GLASS =
  "rounded-2xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl";

/* -------------------------------------------------------------------------- */
/* One orbiting node. It rides the wheel but counter-rotates to stay upright. */
/* -------------------------------------------------------------------------- */

function OrbitNode({
  item,
  i,
  rot,
  isActive,
  onSelect,
}: {
  item: Commitment;
  i: number;
  rot: MotionValue<number>;
  isActive: boolean;
  onSelect: () => void;
}) {
  const upright = useTransform(rot, (v) => -(v + i * STEP));
  const { Icon } = item;

  return (
    <div
      className="absolute left-1/2 top-1/2 size-0"
      style={{ transform: `rotate(${i * STEP}deg)` }}
    >
      <div
        className="absolute left-0 top-0"
        style={{ transform: "translateY(calc(var(--Rn) * -1))" }}
      >
        <motion.div style={{ rotate: upright }} className="-translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={onSelect}
            aria-label={`Commitment ${i + 1}: ${item.title}`}
            aria-current={isActive}
            className={`relative grid h-[var(--ns)] w-[var(--ns)] place-items-center rounded-full border-2 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark ${
              isActive
                ? "scale-110 border-burning-flame bg-burning-flame text-abyssal shadow-[0_0_44px_-6px_var(--color-burning-flame)]"
                : "border-palladian/25 bg-abyssal text-palladian hover:border-burning-flame/70 hover:bg-blue-fantastic"
            }`}
          >
            <Icon className="size-[40%]" aria-hidden="true" />
            <span
              aria-hidden="true"
              className={`absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full border text-[10px] font-semibold ${
                isActive
                  ? "border-burning-flame bg-abyssal-dark text-burning-flame"
                  : "border-palladian/25 bg-abyssal-dark text-oatmeal"
              }`}
            >
              {i + 1}
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function Commitments() {
  const reduce = useReducedMotion();
  const [turn, setTurn] = useState(0); // keeps growing or shrinking, so the wheel never unwinds
  const [paused, setPaused] = useState(false);
  const rot = useMotionValue(0);

  const active = ((turn % N) + N) % N;
  const cur = ITEMS[active];

  // Turn the wheel so the active commitment sits at 12 o'clock
  useEffect(() => {
    const c = animate(
      rot,
      -turn * STEP,
      reduce ? { duration: 0 } : { duration: 1.2, ease: EASE },
    );
    return () => c.stop();
  }, [turn, reduce, rot]);

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setTurn((t) => t + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduce]);

  // Shortest route to the chosen commitment
  const goTo = (i: number) => {
    const delta = ((i - active + N + N / 2) % N) - N / 2;
    if (delta !== 0) setTurn((t) => t + delta);
  };

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.11,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.8, ease: EASE },
    },
  };
  const wheelIn: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.9, rotate: reduce ? 0 : -12 },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: reduce ? 0 : 1.2, ease: EASE },
    },
  };

  // Sizes all derive from the wheel's own width (100cqw)
  const wheelVars = {
    "--ns": "17cqw", // node diameter
    "--Rn": "37.5cqw", // orbit radius: middle of the band
  } as CSSProperties;

  const bandMask =
    "radial-gradient(circle closest-side, transparent 49.6%, #000 50%, #000 99.4%, transparent 100%)";
  const topMask = "radial-gradient(ellipse 30% 16% at 50% 0%, black, transparent)";

  return (
    <section
      aria-labelledby="commitments-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-blue-fantastic-dark via-abyssal-dark to-abyssal-dark pt-18 text-palladian sm:pt-18 lg:pt-18"
    >
      {/* ---------- Background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.05]"
          style={{
            maskImage: "radial-gradient(ellipse 70% 60% at 70% 50%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 70% 50%, black, transparent 78%)",
          }}
        >
          <defs>
            <pattern id="cm-lattice" width="96" height="96" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="28" y="28" width="40" height="40" />
                <rect x="28" y="28" width="40" height="40" transform="rotate(45 48 48)" />
                <path d="M48 0V19.7M48 76.3V96M0 48H19.7M76.3 48H96" />
                <path d="M0 -7L7 0L0 7L-7 0Z" />
                <path d="M96 -7L103 0L96 7L89 0Z" />
                <path d="M0 89L7 96L0 103L-7 96Z" />
                <path d="M96 89L103 96L96 103L89 96Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cm-lattice)" />
        </svg>
        <div className="absolute -right-20 top-1/2 size-[36rem] -translate-y-1/2 rounded-full bg-blue-fantastic-light/20 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 size-[26rem] rounded-full bg-burning-flame/10 blur-[110px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto grid max-w-7xl items-center gap-14 px-8 sm:px-12 lg:grid-cols-2 lg:gap-12 lg:px-16"
      >
        {/* ====================== Left: copy ====================== */}
        <div>
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-palladian/[0.06] px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
          >
            <ShieldCheck className="size-4 text-burning-flame" aria-hidden="true" />
            Our commitment
          </motion.div>

          <motion.h2
            id="commitments-heading"
            variants={rise}
            className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-palladian-light sm:text-5xl lg:text-[3.4rem]"
          >
            Six promises.
            <span className="block text-burning-flame">One shared mission.</span>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-6 max-w-md text-base leading-relaxed text-palladian/75"
          >
            Collaboration, innovation and community partnerships to strengthen
            individuals, families and the wider community.
          </motion.p>

          <motion.ul variants={rise} className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {PILLARS.map(({ title, sub, Icon }) => (
              <li
                key={title}
                className={`group relative p-4 transition-all duration-300 hover:-translate-y-1 hover:border-burning-flame/40 motion-reduce:hover:translate-y-0 ${GLASS}`}
              >
                <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-lg bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <p className="mt-7 text-lg font-semibold leading-tight text-palladian-light">
                  {title}
                </p>
                <p className="mt-1 text-xs text-oatmeal">{sub}</p>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={rise} className="mt-8">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-xl border border-palladian/15 bg-palladian/[0.06] px-5 py-3 text-sm font-medium text-palladian shadow-lg shadow-abyssal-dark/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-burning-flame/50 hover:bg-palladian/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark motion-reduce:hover:translate-y-0"
            >
              Get involved
              <ArrowRight
                className="size-4 text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>

        {/* ====================== Right: wheel ====================== */}
        <div className="flex flex-col items-center">
          <motion.div
            variants={wheelIn}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="w-full max-w-[34rem] [container-type:inline-size]"
          >
            <div className="relative aspect-square w-full" style={wheelVars}>
              {/* outer glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full shadow-[0_0_90px_-30px_var(--color-burning-flame)]"
              />

              {/* the donut band */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(140deg, color-mix(in oklab, var(--color-blue-fantastic) 60%, transparent), color-mix(in oklab, var(--color-abyssal) 90%, transparent))",
                  maskImage: bandMask,
                  WebkitMaskImage: bandMask,
                }}
              />
              {/* fine texture on the band */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, color-mix(in oklab, var(--color-palladian) 45%, transparent) 0.8px, transparent 1.4px)",
                  backgroundSize: "9px 9px",
                  opacity: 0.18,
                  maskImage: bandMask,
                  WebkitMaskImage: bandMask,
                }}
              />

              {/* rims */}
              <div aria-hidden="true" className="absolute inset-0 rounded-full border border-palladian/25" />
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-burning-flame"
                style={{ maskImage: topMask, WebkitMaskImage: topMask }}
              />
              <div aria-hidden="true" className="absolute inset-[25%] rounded-full border border-palladian/20" />

              {/* hole */}
              <div
                aria-hidden="true"
                className="absolute inset-[25%] rounded-full bg-abyssal-dark shadow-[inset_0_0_40px_color-mix(in_oklab,var(--color-abyssal-dark)_90%,transparent)]"
              />

              {/* rotating nodes */}
              <motion.div style={{ rotate: rot }} className="absolute inset-0">
                {ITEMS.map((item, i) => (
                  <OrbitNode
                    key={item.title}
                    item={item}
                    i={i}
                    rot={rot}
                    isActive={i === active}
                    onSelect={() => goTo(i)}
                  />
                ))}
              </motion.div>

              {/* hub: the active commitment */}
              <div
                aria-live={paused ? "polite" : "off"}
                className="absolute left-1/2 top-1/2 z-10 w-[40%] -translate-x-1/2 -translate-y-1/2 text-center"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: reduce ? 0 : 12, filter: reduce ? "none" : "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                    transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-[11px] font-semibold tabular-nums text-burning-flame">
                      {String(active + 1).padStart(2, "0")}
                      <span className="text-oatmeal"> / {String(N).padStart(2, "0")}</span>
                    </p>
                    <h3
                      className="mt-1.5 font-semibold leading-tight tracking-tight text-palladian-light"
                      style={{ fontSize: "clamp(0.95rem, 4.4cqw, 1.5rem)" }}
                    >
                      {cur.title}
                    </h3>
                    <p
                      className="mt-2 hidden leading-snug text-palladian/70 md:block"
                      style={{ fontSize: "clamp(0.7rem, 2.3cqw, 0.8125rem)" }}
                    >
                      {cur.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Description under the wheel on small screens */}
          <motion.div
            variants={rise}
            className={`mt-8 w-full max-w-md p-5 text-left md:hidden ${GLASS}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.3 }}
                className="text-sm leading-relaxed text-palladian/80"
              >
                {cur.text}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <motion.div
            variants={rise}
            role="group"
            aria-label="Choose a commitment"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="mt-8 flex items-center gap-4"
          >
            <button
              type="button"
              onClick={() => setTurn((t) => t - 1)}
              aria-label="Previous commitment"
              className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex items-center gap-1">
              {ITEMS.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show commitment ${i + 1}: ${item.title}`}
                  aria-current={i === active}
                  className="grid h-6 w-6 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === active
                        ? "h-2.5 w-6 bg-burning-flame"
                        : "size-2 bg-palladian/30 hover:bg-palladian/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setTurn((t) => t + 1)}
              aria-label="Next commitment"
              className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
            >
              <ChevronRight className="size-5" />
            </button>
          </motion.div>
        </div>
      </motion.div>
      <Footer/>
    </section>
  );
}