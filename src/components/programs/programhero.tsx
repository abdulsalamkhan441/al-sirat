"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowDown,
  Award,
  Compass,
  MessageCircle,
  Rocket,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Put your photo in /public/images/ and update this path. */
const HERO_IMAGE = "/images/programs-hero.jpg";

const KEY_DETAILS: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Wrench, title: "Practical skills", text: "Learn by doing, not just listening." },
  { Icon: Compass, title: "Career opportunities", text: "Training shaped around real job paths." },
  { Icon: Rocket, title: "Ready for what's next", text: "Confidence for work, study and life." },
  { Icon: Award, title: "Certificates", text: "For completing eligible programs." },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function ProgramsHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* Image drifts slower than the page, and eases out as you scroll */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -50]);
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
    hidden: { y: reduce ? "0%" : "108%" },
    show: { y: "0%", transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };

  return (
    <section
      ref={ref}
      id="programs-hero"
      aria-labelledby="programs-heading"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden text-palladian"
    >
      {/* Image + overlays dissolve into the shared page background */}
      <div className="absolute inset-0 -z-10 [-webkit-mask-image:linear-gradient(to_bottom,black_62%,transparent)] [mask-image:linear-gradient(to_bottom,black_62%,transparent)]">
      {/* ---------- Image ---------- */}
      <motion.div
        aria-hidden="true"
        style={{ y: imgY }}
        className="absolute inset-x-0 -top-[8%] -z-10 h-[116%]"
      >
        <motion.div
          initial={{ scale: reduce ? 1 : 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduce ? 0 : 2.2, ease: EASE }}
          className="relative size-full bg-linear-to-br from-blue-fantastic via-abyssal to-truffle-dark"
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_center] sm:object-center"
          />
        </motion.div>
      </motion.div>

      {/* Overlays: keep text readable and blend into the next section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-abyssal-dark/35" />
        <div className="absolute inset-0 bg-linear-to-r from-abyssal-dark/85 via-abyssal-dark/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-abyssal-dark/80 to-transparent" />
        <div className="absolute -left-40 bottom-20 size-[34rem] rounded-full bg-truffle/20 blur-[130px]" />
      </div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-36 sm:px-6 sm:pb-10 lg:px-8"
      >
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="flex items-end justify-between gap-8">
            {/* ---------- Message ---------- */}
            <motion.div style={{ y: textY }} className="max-w-2xl">
              <motion.div variants={rise}>
                <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                  <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                  Programs &amp; Courses at Al Sirat Academy
                </div>
              </motion.div>

              <h1
                id="programs-heading"
                className="mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-palladian-light sm:text-6xl lg:text-7xl"
              >
                <span className="block overflow-hidden pb-1.5">
                  <motion.span variants={line} className="block">Learn a skill.</motion.span>
                </span>
                <span className="block overflow-hidden pb-1.5">
                  <motion.span variants={line} className="block">Build a future.</motion.span>
                </span>
              </h1>

              <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/80 sm:text-base">
                Flexible training for students, job seekers and families. Study online from home or
                join us in person at the center, at a pace that fits your life.
              </motion.p>

              <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#programs-explorer"
                  className="group inline-flex items-center justify-between gap-3 rounded-full bg-burning-flame py-2 pl-7 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal sm:min-w-[220px]"
                >
                  Explore programs
                  <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-y-0.5">
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/40 px-6 py-3.5 text-sm font-medium text-palladian backdrop-blur-md transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Talk to an advisor
                </a>
              </motion.div>
            </motion.div>

            {/* ---------- Rotating badge ---------- */}
            <motion.a
              variants={rise}
              href="#programs-explorer"
              aria-label="Scroll to programs"
              className="group relative mb-2 hidden size-36 shrink-0 place-items-center rounded-full border border-palladian/15 bg-abyssal-dark/40 backdrop-blur-md transition-colors hover:border-burning-flame/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame md:grid lg:size-40"
            >
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 120 120"
                className="absolute inset-0 size-full text-palladian"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 28, ease: "linear", repeat: Infinity }}
              >
                <defs>
                  <path id="programs-badge-path" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1 -90 0" />
                </defs>
                <text fill="currentColor" fontSize="9.6" letterSpacing="2.2">
                  <textPath href="#programs-badge-path">Online • In person • Flexible • Practical •</textPath>
                </text>
              </motion.svg>
              <span className="grid size-14 place-items-center rounded-full bg-burning-flame text-abyssal transition-transform duration-300 group-hover:scale-105">
                <ArrowDown className="size-5" aria-hidden="true" />
              </span>
            </motion.a>
          </div>

          {/* ---------- Key details bar ---------- */}
          <motion.ul
            variants={rise}
            className="mt-10 grid grid-cols-2 gap-2.5 rounded-3xl border border-palladian/[0.12] bg-abyssal-dark/55 p-2.5 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl sm:mt-12 lg:grid-cols-4"
          >
            {KEY_DETAILS.map(({ Icon, title, text }) => (
              <li
                key={title}
                className="group flex items-center gap-3 rounded-2xl p-3 transition-colors duration-300 hover:bg-palladian/[0.06] sm:items-start sm:p-4"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-burning-flame/25 bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold leading-snug text-palladian-light sm:text-sm">{title}</span>
                  <span className="mt-0.5 hidden text-xs leading-relaxed text-oatmeal sm:block">{text}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </section>
  );
}