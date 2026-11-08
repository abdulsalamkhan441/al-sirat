"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Maximize2,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Replace with a photo of your own facility. If it fails to load, a gradient shows instead. */
const HERO_PHOTO =
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=75";

const SQ_FT = 24000;

/** Each rotating word matches one event type chip on the photo. */
const USES = [
  { word: "gathering.", chip: "Community" },
  { word: "class.", chip: "Educational" },
  { word: "game.", chip: "Recreational" },
  { word: "celebration.", chip: "Private events" },
];

const FEATURES: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Maximize2, title: "Spacious facility", text: "Over 24,000 sq. ft. under one roof." },
  { Icon: CalendarCheck, title: "Community & private bookings", text: "Open to groups, families and organizations." },
  { Icon: Users, title: "Events of every size", text: "Flexible setups for small to large gatherings." },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function FacilityHero() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [bad, setBad] = useState(false);

  /* Rotating use-case word, in step with the chips on the photo */
  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % USES.length), 2800);
    return () => clearTimeout(t);
  }, [i, paused, reduce]);

  /* Square-footage count-up */
  const mv = useMotionValue(reduce ? SQ_FT : 0);
  const shown = useTransform(mv, (v) => Math.round(v).toLocaleString("en-US"));
  useEffect(() => {
    if (reduce) { mv.set(SQ_FT); return; }
    const c = animate(mv, SQ_FT, { duration: 2.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [mv, reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "10%"]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.2 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };
  const draw: Variants = {
    hidden: { scaleX: reduce ? 1 : 0 },
    show: { scaleX: 1, transition: { duration: reduce ? 0 : 1.1, ease: EASE, delay: reduce ? 0 : 0.5 } },
  };

  const corner = "absolute size-6 border-burning-flame/70";

  return (
    <section
      ref={ref}
      id="facility-hero"
      aria-labelledby="facility-heading"
      className="relative isolate overflow-hidden pb-16 pt-32 text-palladian sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40"
    >
      {/* ghost word (page background is shared) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="absolute -bottom-6 left-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent xl:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Space
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* ================= Left: message ================= */}
            <div className="lg:col-span-6">
              <motion.div variants={rise}>
                <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                  <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                  Facility rental
                </div>
              </motion.div>

              <h1
                id="facility-heading"
                className="mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-palladian-light sm:text-6xl lg:text-7xl"
              >
                <span className="sr-only">A space for every gathering, class, game and celebration.</span>
                <span aria-hidden="true" className="block">
                  <span className="block overflow-hidden pb-1">
                    <motion.span
                      className="block"
                      initial={{ y: reduce ? "0%" : "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: 0.25 }}
                    >
                      A space for every
                    </motion.span>
                  </span>
                  <span className="relative block h-[1.15em] overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={USES[i].word}
                        initial={{ y: reduce ? "0%" : "100%", opacity: reduce ? 1 : 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: reduce ? "0%" : "-100%", opacity: reduce ? 0 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                        className="absolute inset-x-0 top-0 block whitespace-nowrap text-burning-flame"
                      >
                        {USES[i].word}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h1>

              <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/80 sm:text-base">
                Al Sirat&apos;s facility spans more than 24,000 square feet and is open for community
                and private bookings. From classes to tournaments to celebrations, there is room
                for your event.
              </motion.p>

              <motion.div variants={rise} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href="#booking"
                  className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:min-w-[230px]"
                >
                  Check availability
                  <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </a>
                <a
                  href="#facility-spaces"
                  className="group relative self-start py-1 text-sm font-medium text-palladian transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:self-auto"
                >
                  Explore the space
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-palladian/40 transition-colors group-hover:bg-burning-flame" />
                </a>
              </motion.div>
            </div>

            {/* ================= Right: photo ================= */}
            <motion.div variants={rise} className="lg:col-span-6">
              <div className="relative">
                <div className="relative aspect-[4/4.4] overflow-hidden rounded-[2rem] border border-palladian/[0.12] bg-abyssal-dark shadow-2xl shadow-abyssal-dark/60 sm:aspect-[5/4] lg:aspect-[4/4.4] lg:rounded-[2.5rem]">
                  <motion.div
                    style={{ y: imgY }}
                    className="absolute -inset-x-0 -top-[6%] h-[112%]"
                  >
                    <motion.div
                      initial={{ scale: reduce ? 1 : 1.15 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: reduce ? 0 : 2, ease: EASE }}
                      className="relative size-full bg-linear-to-br from-blue-fantastic-light via-blue-fantastic to-truffle-dark"
                    >
                      <Building2 className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-palladian/20" aria-hidden="true" />
                      {!bad && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={HERO_PHOTO}
                          alt="Large open event hall set up for a gathering"
                          decoding="async"
                          onError={() => setBad(true)}
                          className="absolute inset-0 size-full object-cover"
                        />
                      )}
                    </motion.div>
                  </motion.div>
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/85 via-abyssal-dark/10 to-abyssal-dark/30" />

                  {/* blueprint corners */}
                  <div aria-hidden="true" className="pointer-events-none absolute inset-4 sm:inset-5">
                    <motion.span initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.5 }} className={`${corner} left-0 top-0 rounded-tl-lg border-l-2 border-t-2`} />
                    <motion.span initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.6 }} className={`${corner} right-0 top-0 rounded-tr-lg border-r-2 border-t-2`} />
                  </div>

                  {/* event-type chips */}
                  <div
                    role="group"
                    aria-label="Event types"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                    className="absolute inset-x-5 top-5 flex flex-wrap gap-1.5 sm:inset-x-8 sm:top-8"
                  >
                    {USES.map((u, k) => {
                      const on = k === i;
                      return (
                        <button
                          key={u.chip}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setI(k)}
                          className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:text-xs ${
                            on
                              ? "border-burning-flame bg-burning-flame text-abyssal"
                              : "border-palladian/20 bg-abyssal-dark/55 text-palladian hover:border-burning-flame/60 hover:text-burning-flame"
                          }`}
                        >
                          {u.chip}
                        </button>
                      );
                    })}
                  </div>

                  {/* measurement line with the count-up */}
                  <div className="absolute inset-x-5 bottom-5 flex items-center gap-2 sm:inset-x-8 sm:bottom-8" role="img" aria-label="Over 24,000 square feet">
                    <span aria-hidden="true" className="h-3 w-px bg-burning-flame" />
                    <motion.span variants={draw} aria-hidden="true" className="h-px flex-1 origin-right bg-burning-flame/70" />
                    <span className="rounded-full border border-burning-flame/40 bg-abyssal-dark/70 px-4 py-2 text-sm font-semibold tabular-nums text-palladian-light backdrop-blur-md sm:text-base">
                      <motion.span>{shown}</motion.span>
                      <span className="text-burning-flame">+</span> sq. ft.
                    </span>
                    <motion.span variants={draw} aria-hidden="true" className="h-px flex-1 origin-left bg-burning-flame/70" />
                    <span aria-hidden="true" className="h-3 w-px bg-burning-flame" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= Key details ================= */}
          <motion.ul
            variants={rise}
            className="mt-14 grid grid-cols-1 gap-3 rounded-3xl border border-palladian/[0.12] bg-abyssal-dark/55 p-2.5 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl sm:mt-16 md:grid-cols-3"
          >
            {FEATURES.map(({ Icon, title, text }) => (
              <li key={title} className="group flex items-start gap-3.5 rounded-2xl p-4 transition-colors duration-300 hover:bg-palladian/[0.06]">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-burning-flame/25 bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-palladian-light">{title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-oatmeal">{text}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}