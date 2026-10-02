"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BookOpen, HeartHandshake, MoonStar } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const ABOUT_IMAGE = "/4.jpg";
const ABOUT_ALT = "Members of the Al Sirat Community Center";
// Shift the focal point if the face sits off-centre (e.g. "50% 30%")
const IMAGE_POSITION = "50% 50%";

const PILLARS = [
  {
    Icon: MoonStar,
    title: "Spiritual growth",
    text: "Prayer, reflection and guidance for every age.",
  },
  {
    Icon: BookOpen,
    title: "Education",
    text: "Classes and youth programs that build knowledge.",
  },
  {
    Icon: HeartHandshake,
    title: "Community",
    text: "Outreach and support for families in need.",
  },
];

const LOGOS = [
  { name: "Partner 1", src: "/logo1.png" },
  { name: "Partner 2", src: "/logo2.png" },
  { name: "Partner 3", src: "/logo3.png" },
  { name: "Partner 4", src: "/logo4.png" },
  { name: "Partner 5", src: "/logo5.png" },
  { name: "Partner 6", src: "/logo6.png" },
  { name: "Partner 7", src: "/logo7.png" },
  { name: "Partner 8", src: "/logo8.png" },
  { name: "Partner 9", src: "/logo9.png" },
];

const BADGE_TEXT = "Faith • Learning • Community • Service • ";
const MARQUEE_SECONDS = 38;

/* -------------------------------------------------------------------------- */
/*  Sliced-pill geometry (1000 x 1000 box)                                    */
/*  One photo, three capsule windows leaning at ANGLE. The photo stays        */
/*  upright, so it reads as a single picture cut by diagonal slits.           */
/* -------------------------------------------------------------------------- */

const ANGLE = 28;
const W = 230;

const PILLS = [
  { id: "about-pill-left", cx: 230, cy: 590, len: 572, dx: "-11px", dy: "6px" },
  { id: "about-pill-center", cx: 480, cy: 520, len: 904, dx: "0px", dy: "0px" },
  { id: "about-pill-right", cx: 710, cy: 410, len: 720, dx: "11px", dy: "-6px" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function AboutSection() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const pill: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : -36, y: reduce ? 0 : -68 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: reduce ? 0 : 0.9, ease: EASE },
    },
  };

  const draw: Variants = {
    hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: reduce ? 0 : 1.8, ease: "easeInOut", delay: reduce ? 0 : 0.5 },
    },
  };

  const pop: Variants = {
    hidden: { opacity: 0, scale: reduce ? 1 : 0.6 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: reduce ? 0 : 0.8, ease: EASE, delay: reduce ? 0 : 0.8 },
    },
  };

  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-blue-fantastic-dark py-20 text-palladian sm:py-24 lg:py-32"
    >
      {/* Keyframes kept local so this file is self-contained */}
      <style>{`
        @keyframes about-spin { to { transform: rotate(360deg); } }
        @keyframes about-marquee { to { transform: translateX(-50%); } }
      `}</style>

      {/* ---------- Background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Eight-point star lattice, faded toward the edges */}
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.07]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 70% at 28% 42%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 28% 42%, black, transparent 75%)",
          }}
        >
          <defs>
            <pattern
              id="about-star-lattice"
              width="96"
              height="96"
              patternUnits="userSpaceOnUse"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="28" y="28" width="40" height="40" />
                <rect
                  x="28"
                  y="28"
                  width="40"
                  height="40"
                  transform="rotate(45 48 48)"
                />
                <path d="M48 0V19.7M48 76.3V96M0 48H19.7M76.3 48H96" />
                <path d="M0 -7L7 0L0 7L-7 0Z" />
                <path d="M96 -7L103 0L96 7L89 0Z" />
                <path d="M0 89L7 96L0 103L-7 96Z" />
                <path d="M96 89L103 96L96 103L89 96Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-star-lattice)" />
        </svg>

        {/* Soft light pools */}
        <div className="absolute -left-32 top-0 size-[32rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 size-[36rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
      </div>

      {/* Clip-paths for the three pills */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute"
      >
        <defs>
          {PILLS.map((p) => (
            <clipPath key={p.id} id={p.id} clipPathUnits="objectBoundingBox">
              <rect
                x={p.cx - W / 2}
                y={p.cy - p.len / 2}
                width={W}
                height={p.len}
                rx={W / 2}
                transform={`scale(0.001) rotate(${-ANGLE} ${p.cx} ${p.cy})`}
              />
            </clipPath>
          ))}
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* ---------- Photo + copy ---------- */}
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left: sliced photo with orbit rings, outline echo and badge */}
            <div className="group relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[500px] lg:mx-0 lg:max-w-[540px]">
              {/* warm glow behind the photo */}
              <div
                aria-hidden="true"
                className="absolute inset-[14%] rounded-full bg-burning-flame/15 blur-3xl"
              />

              {/* Orbit rings */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute -inset-[10%] size-[120%] animate-[about-spin_90s_linear_infinite] motion-reduce:animate-none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  strokeWidth="0.25"
                  strokeDasharray="0.6 2.2"
                  className="stroke-palladian/40"
                />
                <circle cx="50" cy="1" r="1.3" className="fill-burning-flame" />
              </svg>
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute -inset-[2%] size-[104%] animate-[about-spin_140s_linear_infinite_reverse] motion-reduce:animate-none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  strokeWidth="0.2"
                  className="stroke-burning-flame/25"
                />
                <circle
                  cx="97.5"
                  cy="62"
                  r="1.1"
                  strokeWidth="0.35"
                  className="fill-abyssal stroke-burning-flame"
                />
              </svg>

              {/* Outline echo of the pills, drawn on after the photo lands */}
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 1000"
                className="absolute inset-0 size-full overflow-visible"
              >
                {PILLS.map((p) => (
                  <g
                    key={p.id}
                    transform={`translate(26 26) rotate(${-ANGLE} ${p.cx} ${p.cy})`}
                  >
                    <motion.rect
                      variants={draw}
                      x={p.cx - W / 2}
                      y={p.cy - p.len / 2}
                      width={W}
                      height={p.len}
                      rx={W / 2}
                      strokeWidth="2"
                      className="fill-none stroke-burning-flame/60"
                    />
                  </g>
                ))}
              </svg>

              {/* The sliced photo */}
              {PILLS.map((p, i) => (
                <div
                  key={p.id}
                  style={{ "--dx": p.dx, "--dy": p.dy } as CSSProperties}
                  className="absolute inset-0 transition-transform duration-500 ease-out motion-safe:group-hover:[transform:translate(var(--dx),var(--dy))]"
                >
                  <motion.div
                    variants={pill}
                    className="absolute inset-0"
                    style={{ clipPath: `url(#${p.id})` }}
                  >
                    <Image
                      src={ABOUT_IMAGE}
                      alt={i === 0 ? ABOUT_ALT : ""}
                      aria-hidden={i === 0 ? undefined : true}
                      fill
                      sizes="(min-width: 1024px) 540px, (min-width: 640px) 500px, 90vw"
                      className="object-cover"
                      style={{ objectPosition: IMAGE_POSITION }}
                    />
                  </motion.div>
                </div>
              ))}

              {/* Rotating text badge */}
              <motion.div
                variants={pop}
                aria-hidden="true"
                className="absolute -bottom-2 -left-1 size-28 sm:size-32 lg:-left-4"
              >
                <div className="relative size-full rounded-full border border-palladian/10 bg-abyssal-dark shadow-xl shadow-abyssal-dark/50">
                  <svg
                    viewBox="0 0 120 120"
                    className="absolute inset-0 size-full animate-[about-spin_26s_linear_infinite] motion-reduce:animate-none"
                  >
                    <defs>
                      <path
                        id="about-badge-circle"
                        d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                      />
                    </defs>
                    <text className="fill-palladian text-[10.5px] font-semibold">
                      <textPath
                        href="#about-badge-circle"
                        textLength={2 * Math.PI * 44 - 2}
                        lengthAdjust="spacing"
                      >
                        {BADGE_TEXT}
                      </textPath>
                    </text>
                  </svg>
                  <span className="absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-burning-flame text-abyssal sm:size-14">
                    <MoonStar className="size-5 sm:size-6" />
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right: copy */}
            <div className="max-w-xl lg:max-w-lg">
              <motion.h2
                id="about-heading"
                variants={rise}
                className="text-4xl font-bold tracking-tight text-palladian-light sm:text-5xl"
              >
                About Us
              </motion.h2>

              {/* star ornament, echoes the lattice */}
              <motion.div
                variants={rise}
                aria-hidden="true"
                className="mt-5 flex items-center gap-3 text-burning-flame"
              >
                <span className="h-px w-16 bg-burning-flame/60" />
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="5" width="14" height="14" />
                  <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
                </svg>
                <span className="h-px w-8 bg-burning-flame/30" />
              </motion.div>

              <motion.p
                variants={rise}
                className="mt-6 text-base leading-relaxed text-palladian/75 sm:text-lg"
              >
                Al Sirat Community Center is dedicated to fostering spiritual
                growth, educational excellence, and community engagement. Since
                our inception, we have served families and individuals through
                comprehensive programs, youth initiatives, and outreach
                activities aimed at building a compassionate and connected
                community.
              </motion.p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {PILLARS.map(({ Icon, title, text }) => (
                  <motion.li
                    key={title}
                    variants={rise}
                    className="group/card rounded-2xl border border-palladian/10 bg-blue-fantastic/30 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-burning-flame/40 hover:bg-blue-fantastic/50 motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover/card:bg-burning-flame group-hover/card:text-abyssal">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-palladian">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-palladian/65">
                      {text}
                    </p>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={rise} className="mt-8">
                <Link
                  href="/who-we-are"
                  className="group inline-flex items-center gap-4 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
                >
                  Read our story
                  <span className="grid size-10 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* ---------- Partner logos: endless loop ---------- */}
          <motion.div variants={rise} className="mt-20 lg:mt-28">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px flex-1 bg-palladian/10" />
              <p className="text-sm text-oatmeal">
                Proudly working alongside our partners
              </p>
              <span aria-hidden="true" className="h-px flex-1 bg-palladian/10" />
            </div>

            <ul className="sr-only">
              {LOGOS.map((l) => (
                <li key={l.name}>{l.name}</li>
              ))}
            </ul>

            <div
              aria-hidden="true"
              className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
            >
              <div
                style={{ animationDuration: `${MARQUEE_SECONDS}s` }}
                className="flex w-max animate-[about-marquee_38s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none"
              >
                {[0, 1].map((group) => (
                  <div
                    key={group}
                    className="flex shrink-0 items-center gap-16 pr-16"
                  >
                    {[...LOGOS, ...LOGOS].map((logo, i) => (
                      <div
                        key={`${group}-${i}`}
                        className="relative h-8 w-28 shrink-0 opacity-60 brightness-0 invert transition-opacity duration-300 hover:opacity-100 sm:h-10 sm:w-36"
                      >
                        <Image
                          src={logo.src}
                          alt=""
                          fill
                          sizes="144px"
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}