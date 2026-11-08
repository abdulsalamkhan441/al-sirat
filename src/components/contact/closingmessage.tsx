"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

import { Backdrop, EASE, GLASS, Label, Lattice, OVERLAY_GLASS } from "./contactshared";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const WORDS = ["Connect.", "Learn.", "Grow.", "Together."];

const TAGLINE = ["Building Opportunities", "Strengthening Communities", "Inspiring Success"];

const MARQUEE = "Al Sirat Academy  •  Building Opportunities  •  Strengthening Communities  •  Inspiring Success  •  ";

/* -------------------------------------------------------------------------- */
/*  Section 4: Closing message                                                */
/* -------------------------------------------------------------------------- */

export default function ClosingMessage() {
  const reduce = !!useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.14, delayChildren: 0.1 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };
  const word: Variants = {
    hidden: { y: reduce ? "0%" : "110%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };
  const underline: Variants = {
    hidden: { scaleX: reduce ? 1 : 0 },
    show: { scaleX: 1, transition: { duration: reduce ? 0 : 0.9, ease: EASE, delay: reduce ? 0 : 0.3 } },
  };

  return (
    <section
      id="closing"
      aria-labelledby="closing-heading"
      className="relative isolate py-16 text-palladian sm:py-20 lg:py-24"
    >
      <Backdrop />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className={`${GLASS} overflow-hidden px-5 pb-0 pt-14 text-center sm:px-10 sm:pt-20`}
        >
          <Lattice
            className="opacity-[0.07]"
            mask="radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 80%)"
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-burning-flame/15 blur-3xl"
            animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <motion.div variants={rise} className="flex justify-center">
              <Label Icon={Sparkles}>Al Sirat Academy</Label>
            </motion.div>

            {/* headline */}
            <h2
              id="closing-heading"
              className="mt-8 flex flex-wrap justify-center gap-x-[0.28em] text-[clamp(2.75rem,10.5vw,8rem)] font-extrabold leading-[1] tracking-tight text-palladian-light"
            >
              <span className="sr-only">Connect. Learn. Grow. Together.</span>
              {WORDS.map((w, k) => {
                const last = k === WORDS.length - 1;
                return (
                  <span key={w} aria-hidden="true" className="relative inline-block">
                    <span className="-mb-[0.1em] block overflow-hidden pb-[0.2em]">
                      <motion.span variants={word} className={`block ${last ? "text-burning-flame" : ""}`}>
                        {w}
                      </motion.span>
                    </span>
                    {last && (
                      <motion.span
                        variants={underline}
                        className="absolute inset-x-0 bottom-[0.02em] h-[0.06em] origin-left rounded-full bg-burning-flame/70"
                      />
                    )}
                  </span>
                );
              })}
            </h2>

            {/* tagline */}
            <motion.ul variants={rise} className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-oatmeal sm:text-base">
              {TAGLINE.map((t, k) => (
                <li key={t} className="flex items-center gap-4">
                  {k > 0 && (
                    <span aria-hidden="true" className="hidden text-burning-flame sm:inline">
                      •
                    </span>
                  )}
                  {t}
                </li>
              ))}
            </motion.ul>

            {/* actions */}
            <motion.div variants={rise} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <a
                href="#contact-form"
                className="group inline-flex w-full items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:w-auto sm:min-w-[230px]"
              >
                Send us a message
                <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </a>
              <Link
                href="/donate"
                className={`group inline-flex w-full items-center justify-center gap-2 rounded-full border border-palladian/[0.16] bg-abyssal-dark/40 px-7 py-3.5 text-sm font-semibold text-palladian shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl transition-colors duration-300 hover:border-burning-flame hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:w-auto`}
              >
                <Heart className="size-4 text-burning-flame" aria-hidden="true" />
                Support our community
              </Link>
            </motion.div>

            {/* marquee (decorative) */}
            <motion.div
              variants={rise}
              aria-hidden="true"
              className="relative mt-14 overflow-hidden sm:mt-16"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              }}
            >
              <motion.div
                className="flex w-max"
                animate={reduce ? undefined : { x: ["0%", "-50%"] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              >
                {[0, 1].map((k) => (
                  <span
                    key={k}
                    className="shrink-0 select-none whitespace-pre pb-4 text-5xl font-semibold leading-none tracking-tight text-transparent sm:text-7xl"
                    style={{ WebkitTextStroke: "1px rgba(238,233,223,0.16)" }}
                  >
                    {MARQUEE}
                    {MARQUEE}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}