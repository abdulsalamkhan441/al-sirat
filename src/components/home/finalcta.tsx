"use client";

import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CTASection() {
  const reduce = useReducedMotion();

  // Cursor-following light inside the panel (mouse only)
  const mx = useMotionValue(50);
  const my = useMotionValue(60);
  const sx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.6 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx}% ${sy}%, rgba(255,177,98,0.16), transparent 70%)`;

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 },
    },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="cta-heading"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onPointerLeave={() => {
        mx.set(50);
        my.set(60);
      }}
      className="relative isolate overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-abyssal-dark px-4 py-16 text-palladian sm:px-6 sm:py-20 lg:px-8 lg:py-32"
    >
      {/* ---------- Section background (same lattice + diagonal light) ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.05]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent 78%)",
          }}
        >
          <defs>
            <pattern
              id="cta-star-lattice"
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
          <rect width="100%" height="100%" fill="url(#cta-star-lattice)" />
        </svg>
        <div className="absolute -left-48 -top-24 size-[40rem] rounded-full bg-blue-fantastic-light/30 blur-[130px]" />
        <div className="absolute -bottom-32 -right-40 size-[40rem] rounded-full bg-truffle/25 blur-[130px]" />
        {/* warm glow rising from the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-burning-flame/12 via-truffle/8 to-transparent" />
        {/* cursor light */}
        <motion.div
          style={{ background: spotlight }}
          className="absolute inset-0"
        />
        {/* concentric arcs echo the community arc section */}
        <svg
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 size-full text-palladian opacity-[0.07]"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 80% at 50% 100%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 50% 100%, black, transparent 80%)",
          }}
        >
          {[180, 260, 340, 420].map((r) => (
            <circle
              key={r}
              cx="400"
              cy="470"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="mx-auto max-w-5xl">
        {/* No box: content sits directly on the section */}
        <div className="text-center">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={rise}
              className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
            >
              <Sparkles
                className="size-4 text-burning-flame"
                aria-hidden="true"
              />
              Open to everyone
            </motion.div>

            <motion.h2
              variants={rise}
              id="cta-heading"
              className="mx-auto mt-6 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-palladian-light sm:text-4xl lg:text-5xl"
            >
              Come and find your place in our community
            </motion.h2>

            <motion.p
              variants={rise}
              className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-palladian/75 sm:text-base"
            >
              Join a class, volunteer your time, or just stop by for tea. There
              is a seat for you and your family.
            </motion.p>

            <motion.div
              variants={rise}
              className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
              {/* Primary */}
              <Link
                href="/join"
                className="group inline-flex items-center justify-between gap-4 rounded-full bg-burning-flame py-2 pl-6 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow,transform] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal"
              >
                Join us today
                <span className="grid size-10 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>

              {/* Secondary */}
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-palladian/15 bg-palladian/5 px-6 py-3.5 text-sm font-medium text-palladian backdrop-blur-md transition-all duration-300 hover:border-burning-flame/50 hover:bg-palladian/10 hover:text-burning-flame active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
              >
                Learn more
                <ArrowRight
                  className="size-3.5 text-oatmeal transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-burning-flame"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}