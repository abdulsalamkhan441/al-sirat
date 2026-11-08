"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  CalendarHeart,
  ChevronDown,
  GraduationCap,
  HandHeart,
  Heart,
  Sparkles,
  Sprout,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Where the Donate Now button goes. Swap for the donation portal link when it is ready. */
const DONATE_HREF = "#support";

/** Replace with a real photo of your community. If it fails to load, a gradient shows instead. */
const PILL_PHOTO =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=75";

/** PLACEHOLDER figure for the Your Impact card. Replace with a real, verified number. */
const IMPACT = { value: 1200, suffix: "+", label: "People supported" };

/**
 * PLACEHOLDER shares for the Top Causes bars. Replace with real allocations
 * (or remove the percentages) before launch. The five areas come from the brief.
 */
const CAUSES: { Icon: LucideIcon; label: string; pct: number }[] = [
  { Icon: GraduationCap, label: "Educational programs", pct: 30 },
  { Icon: Sprout, label: "Youth development", pct: 25 },
  { Icon: Trophy, label: "Sports activities", pct: 15 },
  { Icon: CalendarHeart, label: "Community events", pct: 15 },
  { Icon: HandHeart, label: "Support services", pct: 15 },
];
const MAX_PCT = Math.max(...CAUSES.map((c) => c.pct));

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Glass system shared with the rest of the site */
const GLASS =
  "relative rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent";

const OVERLAY_GLASS =
  "rounded-2xl border border-palladian/[0.16] bg-abyssal-dark/40 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl";

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function DonateHero() {
  const reduce = !!useReducedMotion();
  const [bad, setBad] = useState(false);
  const gid = useId().replace(/:/g, "");

  /* Impact count-up, starts when the card scrolls into view */
  const impactRef = useRef<HTMLDivElement>(null);
  const inView = useInView(impactRef, { once: true, amount: 0.4 });
  const mv = useMotionValue(reduce ? IMPACT.value : 0);
  const shown = useTransform(mv, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    if (reduce) {
      mv.set(IMPACT.value);
      return;
    }
    if (!inView) return;
    const c = animate(mv, IMPACT.value, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView, mv, reduce]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.2 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <section
      id="support"
      aria-labelledby="support-heading"
      className="relative isolate pb-16 pt-32 text-palladian sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40"
    >
      <div className="absolute -left-40 top-1/4 size-[34rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <motion.div
          className="absolute -right-40 bottom-0 size-[36rem] rounded-full bg-burning-flame/10 blur-3xl"
          animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="absolute -bottom-6 left-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent xl:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Give
        </span>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* ================= Headline ================= */}
          <div className="text-center">
            <motion.div variants={rise} className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/50 px-3.5 py-1.5 text-[13px] font-medium text-palladian backdrop-blur-md">
                <motion.span
                  aria-hidden="true"
                  className="grid place-items-center"
                  animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="size-4 fill-burning-flame text-burning-flame" />
                </motion.span>
                Donate
              </div>
            </motion.div>

            <div className="relative mt-8">
              <h1
                id="support-heading"
                className="text-[clamp(2.75rem,11vw,9rem)] font-extrabold leading-[0.95] tracking-tight text-palladian-light"
              >
                <span className="sr-only">Support our community.</span>
                <span aria-hidden="true" className="block">
                  <span className="-mb-[0.12em] block overflow-hidden pb-[0.2em]">
                    <motion.span
                      className="block whitespace-nowrap"
                      initial={{ y: reduce ? "0%" : "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: 0.25 }}
                    >
                      Supp
                      {/* photo pill stands in for the "o" */}
                      <motion.span
                        initial={{ scaleX: reduce ? 1 : 0.2, opacity: reduce ? 1 : 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: 0.8 }}
                        className="relative mx-[0.03em] inline-block h-[0.72em] w-[1.75em] origin-center overflow-hidden rounded-full border-2 border-burning-flame align-[-0.02em] shadow-xl shadow-abyssal-dark/60"
                      >
                        <span className="absolute inset-0 bg-linear-to-br from-blue-fantastic-light via-blue-fantastic to-truffle-dark" />
                        <Users className="absolute left-1/2 top-1/2 size-[0.4em] -translate-x-1/2 -translate-y-1/2 text-palladian/30" />
                        {!bad && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={PILL_PHOTO}
                            alt=""
                            decoding="async"
                            onError={() => setBad(true)}
                            className="absolute inset-0 size-full object-cover"
                          />
                        )}
                      </motion.span>
                      rt Our
                    </motion.span>
                  </span>
                  <span className="-mb-[0.12em] block overflow-hidden pb-[0.22em]">
                    <motion.span
                      className="block text-burning-flame"
                      initial={{ y: reduce ? "0%" : "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: 0.38 }}
                    >
                      Community
                    </motion.span>
                  </span>
                </span>
              </h1>

              {/* floating chip: sits under the headline on phones, overlaps it from sm up */}
              <motion.div
                variants={rise}
                className="pointer-events-none relative mx-auto mt-4 w-fit sm:absolute sm:left-[53%] sm:top-[50%] sm:z-10 sm:mt-0 sm:-translate-x-1/2 sm:-translate-y-1/2"
              >
                <motion.div
                  animate={reduce ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className={`flex items-center gap-3 px-4 py-3 text-left ${OVERLAY_GLASS}`}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-burning-flame text-abyssal">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-burning-flame">Every gift counts</span>
                    <span className="block text-[11px] leading-snug text-oatmeal">Programs, youth, sports and more</span>
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* ================= Bottom row ================= */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
            {/* ---- left: impact + join ---- */}
            <div className="flex flex-col gap-4 lg:col-span-4">
              <motion.div ref={impactRef} variants={rise} className={`${GLASS} flex-1 p-5 sm:p-6`}>
                <p className="text-sm font-semibold text-palladian-light">Your impact</p>

                <svg
                  viewBox="0 0 300 110"
                  role="img"
                  aria-label="Chart showing impact growing over time"
                  className="mt-3 h-auto w-full overflow-visible"
                >
                  <defs>
                    <linearGradient id={`${gid}-fill`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-burning-flame)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--color-burning-flame)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 92 C30 90 45 72 75 74 S120 52 150 56 S205 40 230 32 S275 20 300 10 L300 110 L0 110 Z"
                    fill={`url(#${gid}-fill)`}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : undefined}
                    transition={{ duration: reduce ? 0 : 1.2, ease: EASE, delay: 0.6 }}
                  />
                  <motion.path
                    d="M0 92 C30 90 45 72 75 74 S120 52 150 56 S205 40 230 32 S275 20 300 10"
                    fill="none"
                    stroke="var(--color-burning-flame)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={inView ? { pathLength: 1 } : undefined}
                    transition={{ duration: reduce ? 0 : 1.8, ease: EASE }}
                  />
                  <motion.circle
                    cx="300"
                    cy="10"
                    r="5"
                    fill="var(--color-palladian-light)"
                    stroke="var(--color-burning-flame)"
                    strokeWidth="2.5"
                    initial={{ opacity: 0, scale: reduce ? 1 : 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : undefined}
                    transition={{ duration: reduce ? 0 : 0.4, ease: EASE, delay: reduce ? 0 : 1.7 }}
                  />
                </svg>

                <p className="mt-3 text-3xl font-semibold tabular-nums text-palladian-light sm:text-4xl">
                  <motion.span>{shown}</motion.span>
                  <span className="text-burning-flame">{IMPACT.suffix}</span>
                </p>
                <p className="mt-0.5 text-xs text-oatmeal">{IMPACT.label}</p>
              </motion.div>

              <motion.div
                variants={rise}
                className="flex items-center gap-3 rounded-full border border-palladian/[0.16] bg-abyssal-dark/40 p-2 pr-5 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl"
              >
                <span aria-hidden="true" className="flex shrink-0 -space-x-3">
                  <span className="grid size-10 place-items-center rounded-full border-2 border-abyssal bg-blue-fantastic-light text-palladian">
                    <Users className="size-4" />
                  </span>
                  <span className="grid size-10 place-items-center rounded-full border-2 border-abyssal bg-truffle text-palladian">
                    <Heart className="size-4" />
                  </span>
                  <span className="grid size-10 place-items-center rounded-full border-2 border-abyssal bg-burning-flame text-abyssal">
                    <span className="text-lg font-semibold leading-none">+</span>
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-palladian-light">Join our community</span>
                  <span className="block truncate text-xs text-oatmeal">Supporters make it possible</span>
                </span>
              </motion.div>
            </div>

            {/* ---- middle: top causes ---- */}
            <motion.div variants={rise} className={`${GLASS} p-5 sm:p-6 lg:col-span-4`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-palladian-light">Top causes</p>
                <a
                  href="#where-donations-go"
                  className="text-xs font-medium text-oatmeal transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  See where it goes
                </a>
              </div>

              <ul className="mt-4 space-y-1">
                {CAUSES.map(({ Icon, label, pct }, k) => (
                  <li
                    key={label}
                    className="group/row flex items-center gap-3 rounded-2xl border border-transparent px-2.5 py-2 transition-colors duration-300 hover:border-palladian/10 hover:bg-palladian/5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover/row:bg-burning-flame group-hover/row:text-abyssal">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3 text-xs">
                        <span className="truncate font-medium text-palladian">{label}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-palladian-light">{pct}%</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={label}
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="mt-1.5 h-2 overflow-hidden rounded-full bg-palladian/10"
                      >
                        <motion.div
                          className="h-full origin-left rounded-full bg-burning-flame"
                          style={{ width: `${(pct / MAX_PCT) * 100}%` }}
                          initial={{ scaleX: reduce ? 1 : 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: reduce ? 0 : 1, ease: EASE, delay: reduce ? 0 : 0.7 + k * 0.1 }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ---- right: message + CTA ---- */}
            <motion.div variants={rise} className="flex flex-col justify-between gap-8 md:col-span-2 lg:col-span-4 lg:pl-4">
              <div>
                <p className="max-w-sm text-sm leading-relaxed text-palladian/80 sm:text-base">
                  Your donation supports Al Sirat Academy&apos;s community work, helps sustain our
                  programs and initiatives, and creates opportunities for those who need them.
                </p>
                <a
                  href={DONATE_HREF}
                  className="group mt-6 inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:min-w-[230px]"
                >
                  Donate now
                  <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </a>
              </div>

              <a
                href="#where-donations-go"
                className="hidden items-center gap-2 self-end text-[11px] font-semibold uppercase tracking-widest text-oatmeal transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame md:inline-flex"
              >
                Scroll down
                <motion.span
                  aria-hidden="true"
                  animate={reduce ? undefined : { y: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="size-4" />
                </motion.span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}