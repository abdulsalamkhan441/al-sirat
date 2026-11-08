"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Heart, Inbox, MessageCircle, Send, type LucideIcon } from "lucide-react";

import { CATEGORIES } from "./contactdata";
import { Backdrop, EASE, GLASS, Label, OVERLAY_GLASS } from "./contactshared";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const DETAILS: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Heart, title: "Friendly and accessible", text: "Reach out in whatever way feels easiest. We're glad to help." },
  { Icon: MessageCircle, title: "Ask us anything", text: "Questions and inquiries are always welcome." },
  { Icon: Inbox, title: "Every kind of inquiry", text: "Programs, rentals, volunteering, partnerships and more." },
];

/* -------------------------------------------------------------------------- */
/*  Section 1: Contact introduction                                           */
/* -------------------------------------------------------------------------- */

export default function ContactIntro() {
  const reduce = !!useReducedMotion();
  const [i, setI] = useState(0);

  /* Rotating topic word */
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % CATEGORIES.length), 2600);
    return () => clearTimeout(t);
  }, [i, reduce]);

  const word = CATEGORIES[i].label.toLowerCase();

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
      id="contact-intro"
      aria-labelledby="contact-heading"
      className="relative isolate pb-16 pt-32 text-palladian sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40"
    >
      <Backdrop ghost="Hello" ghostSide="left" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-8">
            {/* ---- headline ---- */}
            <div className="min-w-0 lg:col-span-8">
              <motion.div variants={rise}>
                <Label Icon={Send}>Contact us</Label>
              </motion.div>

              <h1
                id="contact-heading"
                className="mt-6 text-[clamp(2.25rem,8.5vw,6rem)] font-semibold leading-[1.02] tracking-tight text-palladian-light"
              >
                <span className="sr-only">We would love to hear from you.</span>
                <span aria-hidden="true" className="block">
                  <span className="-mb-[0.1em] block overflow-hidden pb-[0.15em]">
                    <motion.span
                      className="block"
                      initial={{ y: reduce ? "0%" : "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: 0.25 }}
                    >
                      We would love
                    </motion.span>
                  </span>
                  <span className="-mb-[0.1em] block overflow-hidden pb-[0.15em]">
                    <motion.span
                      className="block text-burning-flame"
                      initial={{ y: reduce ? "0%" : "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: reduce ? 0 : 0.9, ease: EASE, delay: 0.38 }}
                    >
                      to hear from you
                    </motion.span>
                  </span>
                </span>
              </h1>
            </div>

            {/* ---- supporting text ---- */}
            <motion.div variants={rise} className="min-w-0 lg:col-span-4">
              <p className="max-w-sm text-sm leading-relaxed text-palladian/80 sm:text-base">
                Whether you have a question, an idea or a way to help, our team is happy to hear
                from you and will respond as soon as possible.
              </p>

              {/* rotating topic chip (decorative; full list is read out below) */}
              <p className="sr-only">
                Ask us about programs, facility rentals, volunteer opportunities, partnerships,
                sponsorships and community events.
              </p>
              <div
                aria-hidden="true"
                className={`mt-6 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5 text-[13px] ${OVERLAY_GLASS} rounded-full`}
              >
                <span className="text-oatmeal">Ask us about</span>
                <span className="relative block h-5 w-44 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={word}
                      initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 1 : 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: reduce ? 0 : "-100%", opacity: reduce ? 0 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                      className="absolute inset-0 block whitespace-nowrap font-semibold text-burning-flame"
                    >
                      {word}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href="#contact-form"
                  className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:min-w-[220px]"
                >
                  Send a message
                  <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </a>
                <a
                  href="#inquiries"
                  className="group relative self-start py-1 text-sm font-medium text-palladian transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:self-auto"
                >
                  Browse topics
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-palladian/40 transition-colors group-hover:bg-burning-flame" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ---- key details ---- */}
          <motion.ul
            variants={rise}
            className={`${GLASS} mt-14 grid grid-cols-1 gap-3 p-2.5 sm:mt-16 md:grid-cols-3`}
          >
            {DETAILS.map(({ Icon, title, text }) => (
              <li
                key={title}
                className="group flex items-start gap-3.5 rounded-2xl p-4 transition-colors duration-300 hover:bg-palladian/[0.06]"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
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