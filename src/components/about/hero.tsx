"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import AnnouncementBar from "@/components/home/announcemnetbar";
import Navbar from "@/components/common/navbar";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

type Pillar = {
  label: string;
  Icon: LucideIcon;
};

// Static pillars list (no images or buttons needed)
const PILLARS: Pillar[] = [
  {
    label: "Education",
    Icon: GraduationCap,
  },
  {
    label: "Professional development",
    Icon: Briefcase,
  },
  {
    label: "Sports",
    Icon: Trophy,
  },
  {
    label: "Social engagement",
    Icon: HeartHandshake,
  },
];

// Floating light motes: [left %, top %, size px, duration s, delay s]
const MOTES = [
  [8, 62, 4, 9, 0],
  [16, 34, 3, 11, 2],
  [24, 78, 5, 10, 4],
  [33, 48, 3, 12, 1],
  [42, 70, 4, 9, 5],
  [51, 28, 3, 13, 3],
  [60, 64, 5, 10, 6],
  [68, 40, 3, 11, 2],
  [76, 76, 4, 12, 0],
  [84, 52, 3, 9, 4],
  [91, 30, 5, 13, 1],
  [96, 68, 3, 10, 5],
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function AboutHero() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.25,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.75, ease: EASE },
    },
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <section
        aria-labelledby="about-hero-heading"
        className="relative isolate flex min-h-[calc(100svh-2.5rem)] w-full flex-col overflow-hidden bg-abyssal-dark text-palladian"
      >
        <style>{`
          @keyframes hero-beam {
            0%, 100% { opacity: 0.45; translate: 0 0; }
            50% { opacity: 1; translate: 48px 0; }
          }
          @keyframes hero-mote {
            0%, 100% { opacity: 0.15; translate: 0 0; }
            50% { opacity: 0.9; translate: 14px -30px; }
          }
        `}</style>

        {/* ---------- Background (Single Static Image) ---------- */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0">
            <Image
              src="/about/2.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Keep the centred copy readable */}
          <div className="absolute inset-0 bg-abyssal-dark/55" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 42%, color-mix(in oklab, var(--color-abyssal-dark) 70%, transparent), transparent 75%)",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-abyssal-dark/80 via-transparent to-abyssal-dark/60" />

          {/* Star lattice, faint, fading out from the top centre */}
          <svg
            className="absolute inset-0 size-full text-palladian opacity-[0.07]"
            style={{
              maskImage:
                "radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent 80%)",
            }}
          >
            <defs>
              <pattern
                id="about-hero-lattice"
                width="96"
                height="96"
                patternUnits="userSpaceOnUse"
              >
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
            <rect width="100%" height="100%" fill="url(#about-hero-lattice)" />
          </svg>

          {/* Slow light beams */}
          <div className="absolute inset-0 overflow-hidden mix-blend-screen">
            <div className="absolute -top-1/4 left-[10%] h-[150%] w-36 -rotate-[24deg] animate-[hero-beam_9s_ease-in-out_infinite] bg-linear-to-b from-burning-flame/25 via-burning-flame/10 to-transparent blur-2xl motion-reduce:animate-none" />
            <div className="absolute -top-1/4 left-[56%] h-[150%] w-56 -rotate-[24deg] animate-[hero-beam_12s_ease-in-out_infinite] bg-linear-to-b from-palladian/15 via-palladian/5 to-transparent blur-3xl [animation-delay:-4s] motion-reduce:animate-none" />
            <div className="absolute -top-1/4 left-[80%] h-[150%] w-24 -rotate-[24deg] animate-[hero-beam_10s_ease-in-out_infinite] bg-linear-to-b from-burning-flame/15 via-burning-flame/5 to-transparent blur-2xl [animation-delay:-7s] motion-reduce:animate-none" />
          </div>

          {/* Drifting motes */}
          <div className="motion-reduce:hidden">
            {MOTES.map(([l, t, s, d, delay], i) => (
              <span
                key={i}
                className="absolute rounded-full bg-burning-flame-light blur-[1px]"
                style={{
                  left: `${l}%`,
                  top: `${t}%`,
                  width: s,
                  height: s,
                  animation: `hero-mote ${d}s ease-in-out infinite`,
                  animationDelay: `-${delay}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ---------- Copy ---------- */}
        <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 pb-44 pt-32 text-center sm:px-6 sm:pb-48 lg:px-8 lg:pb-52 lg:pt-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
            >
              <BadgeCheck className="size-4 text-burning-flame" aria-hidden="true" />
              Registered non-profit organization
            </motion.div>

            <motion.h1
              id="about-hero-heading"
              variants={item}
              className="mt-6 text-[2.75rem] font-medium leading-[1.05] tracking-tight text-palladian-light sm:text-6xl lg:text-7xl"
            >
              About
              <span className="block text-burning-flame">Al Sirat Academy</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-palladian/80 sm:text-lg"
            >
              Building community well-being through education, professional
              development, sports and social engagement.
            </motion.p>

            <motion.div variants={item} className="mt-8">
              <Link
                href="/services"
                className="group inline-flex items-center gap-4 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
              >
                Explore Our Programs
                <span className="grid size-10 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>

            {/* Pillar chips: Converted to static non-interactive tags */}
            <motion.div
              variants={item}
              role="region"
              aria-label="Our four focus areas"
              className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
            >
              {PILLARS.map(({ label, Icon }) => {
                return (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 overflow-hidden rounded-full border border-palladian/15 bg-abyssal-dark/45 px-4 py-2 text-sm font-medium text-palladian/85 backdrop-blur-md"
                  >
                    <Icon className="size-4 text-burning-flame" aria-hidden="true" />
                    {label}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- Trust strip ---------- */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 1, ease: EASE }}
          className="absolute inset-x-0 bottom-14 z-20 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 text-xs text-palladian/85 sm:bottom-16 sm:text-[13px] lg:bottom-20"
        >
          <span className="flex items-center gap-2">
            <span className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="grid size-5 place-items-center rounded-md bg-burning-flame text-abyssal"
                >
                  <Star className="size-3 fill-abyssal" aria-hidden="true" />
                </span>
              ))}
            </span>
            1000+ community members
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-palladian/25 sm:block" />
          <span>95% satisfied families</span>
        </motion.div>

        {/* ---------- Torn-paper edge ---------- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-px leading-none"
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="block h-10 w-full text-abyssal-dark sm:h-14 lg:h-[72px]"
            fill="currentColor"
          >
            <path
              opacity="0.35"
              d="M0 120V66C90 50 170 78 290 60S500 46 620 66 850 84 980 58 1120 52 1200 64V120Z"
            />
            <path d="M0 120V84l30-6 28 8 34-8 40 10 46-10 38 9 52-6 44 10 60-8 40 8 58-10 50 9 62-7 44 8 70-5 52 7 66-10 48 9 64-6 42 8 68-10 50 7 60-9H1200V120Z" />
          </svg>
        </div>
      </section>
    </>
  );
}