"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, User, Users } from "lucide-react";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function SportsClosing() {
  const reduce = !!useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  /* Each outcome has its own small animation that draws in when scrolled into view */
  const view = { once: true, amount: 0.6 } as const;

  const OUTCOMES: { title: string; text: string; visual: ReactNode }[] = [
    {
      title: "Stay active",
      text: "Regular movement for every age, from first games to weekly practice.",
      visual: (
        <svg viewBox="0 0 200 80" className="size-full" fill="none" aria-hidden="true">
          <path d="M0 40H200" className="stroke-palladian/10" strokeWidth="1" strokeDasharray="3 5" />
          <motion.path
            d="M0 40H48L60 40L70 12L84 68L94 26L102 40H200"
            className="stroke-burning-flame"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={view}
            transition={{ duration: reduce ? 0 : 2.2, ease: "easeInOut", repeat: reduce ? 0 : Infinity, repeatDelay: 1.2 }}
          />
        </svg>
      ),
    },
    {
      title: "Build friendships",
      text: "Teammates, parents and neighbours who show up for each other.",
      visual: (
        <svg viewBox="0 0 200 80" className="size-full" fill="none" aria-hidden="true">
          {[
            { cx: 72, from: -34, cls: "stroke-palladian/60 fill-palladian/5" },
            { cx: 100, from: 0, cls: "stroke-burning-flame fill-burning-flame/15" },
            { cx: 128, from: 34, cls: "stroke-palladian/60 fill-palladian/5" },
          ].map((c, i) => (
            <motion.circle
              key={i}
              cx={c.cx}
              cy="40"
              r="24"
              strokeWidth="2"
              className={c.cls}
              initial={{ x: reduce ? 0 : c.from, opacity: reduce ? 1 : 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={view}
              transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: reduce ? 0 : i * 0.1 }}
            />
          ))}
        </svg>
      ),
    },
    {
      title: "Develop lifelong healthy habits",
      text: "Routines and confidence that carry well beyond the season.",
      visual: (
        <svg viewBox="0 0 200 80" className="size-full" fill="none" aria-hidden="true">
          {[14, 22, 30, 38, 48, 58, 70].map((h, i) => (
            <motion.rect
              key={i}
              x={16 + i * 26}
              y={76 - h}
              width="16"
              height={h}
              rx="8"
              className={i === 6 ? "fill-burning-flame" : "fill-palladian/20"}
              style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
              initial={{ scaleY: reduce ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={view}
              transition={{ duration: reduce ? 0 : 0.7, ease: EASE, delay: reduce ? 0 : 0.1 + i * 0.09 }}
            />
          ))}
        </svg>
      ),
    },
  ];

  return (
    <section
      id="sports-closing"
      aria-labelledby="sports-closing-heading"
      className="relative isolate overflow-hidden py-20 text-palladian sm:py-24 lg:py-28"
    >
      {/* Decorative ghost word. The page background is shared (PageBackground). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 select-none whitespace-nowrap text-[13rem] font-semibold leading-none tracking-tight text-transparent lg:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Together
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          {/* Message */}
          <motion.div variants={rise} className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
              <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
              Sport for individuals
              <User className="size-3.5 text-burning-flame" aria-hidden="true" />
              and families
              <Users className="size-3.5 text-burning-flame" aria-hidden="true" />
            </div>
            <h2 id="sports-closing-heading" className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl">
              Sport opens the door to a healthier life
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-palladian/75 sm:text-base">
              When you play, you are not only training your body. Sport creates opportunities for
              individuals and families to:
            </p>
          </motion.div>

          {/* Outcomes */}
          <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {OUTCOMES.map((o) => (
              <motion.li
                key={o.title}
                variants={rise}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-5 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl transition-colors duration-300 before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent hover:border-burning-flame/35 sm:p-6"
              >
                <div className="h-24 rounded-2xl border border-palladian/10 bg-abyssal-dark/50 p-3 sm:h-28">{o.visual}</div>
                <h3 className="mt-6 text-xl font-semibold leading-snug tracking-tight text-palladian-light">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-palladian/75">{o.text}</p>
              </motion.li>
            ))}
          </ul>

          {/* CTAs */}
          <motion.div variants={rise} className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:min-w-[220px]"
            >
              Join a sport today
              <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-palladian/15 bg-palladian/5 px-6 py-3.5 text-sm font-medium text-palladian transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Talk to our team
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}