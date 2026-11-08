"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Dumbbell,
  HeartPulse,
  MessageCircle,
  Smile,
  Sparkles,
  Trees,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Unsplash helper. If an ID ever 404s, the image falls back to a gradient. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=70`;

type Venue = "indoor" | "outdoor";

const VENUES: { id: Venue; label: string; Icon: LucideIcon; note: string; photo: string; tone: string }[] = [
  {
    id: "indoor",
    label: "Indoor",
    Icon: Dumbbell,
    note: "Courts, halls and gyms",
    photo: u("photo-1546519638-68e109498ffc"),
    tone: "from-blue-fantastic-light via-blue-fantastic to-abyssal",
  },
  {
    id: "outdoor",
    label: "Outdoor",
    Icon: Trees,
    note: "Fields, parks and open air",
    photo: u("photo-1431324155629-1a6deb1dec8d"),
    tone: "from-burning-flame-dark/60 via-truffle-dark to-abyssal",
  },
];

const LANES: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Smile, title: "Children", text: "Play, learn the basics and make friends." },
  { Icon: Zap, title: "Youth", text: "Build skill, confidence and leadership." },
  { Icon: HeartPulse, title: "Adults", text: "Stay active and connect with neighbours." },
];

const VALUES = ["Fitness", "Teamwork", "Leadership", "Confidence", "Community", "Healthy living"];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function SportsHero() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [venue, setVenue] = useState<Venue>("indoor");
  const [failed, setFailed] = useState<Partial<Record<Venue, boolean>>>({});
  const v = VENUES.find((x) => x.id === venue)!;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0.2]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.25 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };
  const line: Variants = {
    hidden: { y: reduce ? "0%" : "112%", skewY: reduce ? 0 : 6 },
    show: { y: "0%", skewY: 0, transition: { duration: reduce ? 0 : 0.95, ease: EASE } },
  };

  return (
    <section
      ref={ref}
      id="sports-hero"
      aria-labelledby="sports-heading"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden text-palladian"
    >
      {/* Image + overlays dissolve into the shared page background */}
      <div className="absolute inset-0 -z-10 [-webkit-mask-image:linear-gradient(to_bottom,black_62%,transparent)] [mask-image:linear-gradient(to_bottom,black_62%,transparent)]">
      {/* ---------- Image (crossfades with the venue switch) ---------- */}
      <motion.div aria-hidden="true" style={{ y: imgY }} className="absolute inset-x-0 -top-[8%] -z-10 h-[116%]">
        <AnimatePresence initial={false}>
          <motion.div
            key={v.id}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 1.1, ease: EASE }}
            className={`absolute inset-0 bg-linear-to-br ${v.tone}`}
          >
            {!failed[v.id] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={v.photo}
                alt=""
                decoding="async"
                onError={() => setFailed((f) => ({ ...f, [v.id]: true }))}
                className="absolute inset-0 size-full object-cover object-[60%_center] sm:object-center"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-abyssal-dark/40" />
        <div className="absolute inset-0 bg-linear-to-r from-abyssal-dark/90 via-abyssal-dark/50 to-abyssal-dark/10" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-abyssal-dark/80 to-transparent" />
        <div className="absolute -left-40 top-1/3 size-[32rem] rounded-full bg-truffle/20 blur-[130px]" />
      </div>
      </div>

      {/* ---------- Content ---------- */}
      <motion.div
        style={{ opacity: fade }}
        className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-end px-4 pb-10 pt-36 sm:px-6 lg:px-8"
      >
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-8">
            <motion.div variants={rise}>
              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                Sports &amp; Recreation
              </div>
            </motion.div>

            <h1
              id="sports-heading"
              className="mt-6 text-[2.9rem] font-semibold leading-[1.02] tracking-tight text-palladian-light sm:text-7xl lg:text-8xl"
            >
              <span className="block overflow-hidden pb-1.5">
                <motion.span variants={line} className="block origin-left">Move together.</motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  variants={line}
                  className="block origin-left text-transparent"
                  style={{ WebkitTextStroke: "1.5px var(--color-palladian)" }}
                >
                  Grow stronger.
                </motion.span>
              </span>
            </h1>

            <motion.span
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: reduce ? 0 : 0.8, ease: EASE } } }}
              aria-hidden="true"
              className="mt-2 block h-1 w-20 origin-left rounded-full bg-burning-flame"
            />

            <motion.p variants={rise} className="mt-6 max-w-xl text-sm leading-relaxed text-palladian/80 sm:text-base">
              Indoor and outdoor sports for children, youth and adults. Stay fit, build confidence
              and learn teamwork and leadership alongside your community.
            </motion.p>

            {/* Venue switch */}
            <motion.div variants={rise} className="mt-7 flex flex-wrap items-center gap-3">
              <span id="venue-label" className="text-xs font-medium text-oatmeal">Where do you want to play?</span>
              <div role="radiogroup" aria-labelledby="venue-label" className="inline-flex rounded-full border border-palladian/15 bg-abyssal-dark/55 p-1 backdrop-blur-md">
                {VENUES.map((o) => {
                  const on = venue === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setVenue(o.id)}
                      className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame ${
                        on ? "text-abyssal" : "text-palladian hover:text-burning-flame"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="venue-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-full bg-burning-flame"
                        />
                      )}
                      <o.Icon className="relative size-3.5" aria-hidden="true" />
                      <span className="relative">{o.label}</span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={v.id}
                  aria-live="polite"
                  initial={{ opacity: 0, x: reduce ? 0 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                  className="text-xs text-palladian/75"
                >
                  {v.note}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#sports-programs"
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:min-w-[220px]"
              >
                Explore sports
                <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/40 px-6 py-3.5 text-sm font-medium text-palladian backdrop-blur-md transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Ask about joining
              </a>
            </motion.div>
          </div>

          {/* Age lanes */}
          <motion.ul variants={rise} className="grid grid-cols-3 gap-2.5 lg:col-span-4 lg:grid-cols-1">
            {LANES.map(({ Icon, title, text }) => (
              <li
                key={title}
                className="group flex flex-col items-start gap-2.5 rounded-3xl border border-palladian/[0.12] bg-abyssal-dark/55 p-3.5 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl transition-colors duration-300 hover:border-burning-flame/40 sm:p-4 lg:flex-row lg:items-center lg:gap-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-burning-flame/25 bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-palladian-light">{title}</span>
                  <span className="mt-0.5 hidden text-xs leading-relaxed text-oatmeal sm:block">{text}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* ---------- Values ribbon ---------- */}
      <div className="relative border-t border-palladian/10 bg-abyssal-dark/70 py-4 backdrop-blur-md">
        <p className="sr-only">What you build through sport: {VALUES.join(", ")}.</p>
        <div aria-hidden="true" className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <motion.div
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
            className="flex w-max shrink-0 items-center"
          >
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {VALUES.map((t) => (
                  <span key={`${k}-${t}`} className="flex items-center text-lg font-semibold tracking-tight text-palladian/80 sm:text-xl">
                    <span className="px-6 sm:px-8">{t}</span>
                    <Sparkles className="size-4 text-burning-flame" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}