"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ChevronsRight, Users } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Photos fan out along the arc automatically — add or remove entries and the
 * spacing recalculates. 7 gives the layout in the reference.
 * Names and quotes are placeholders: replace with real members' words.
 */
const PEOPLE = [
  {
    name: "Amina",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    quote: "My kids look forward to every class.",
  },
  {
    name: "Daniel",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    quote: "I found friends in my first week.",
  },
  {
    name: "Maria",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    quote: "Everyone made me feel welcome.",
  },
  {
    name: "Yusuf",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    quote: "It feels like family here.",
  },
  {
    name: "Fatima",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    quote: "Peaceful, kind and always open.",
  },
  {
    name: "Omar",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
    quote: "I learn something new every visit.",
  },
  {
    name: "Sara",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    quote: "A place I can bring my parents.",
  },
];

const STATS = [
  { to: 10, suffix: "+", label: "Years of service" },
  { to: 1000, suffix: "+", label: "Community members" },
  { to: 4000, suffix: "+", label: "Programs completed" },
  { to: 95, suffix: "%", label: "Satisfied families" },
];

const STEP = 19; // degrees between photos on the arc

/* -------------------------------------------------------------------------- */
/*  Responsive dial geometry                                                  */
/*  Everything scales from the section width (cqw) so the arc keeps its       */
/*  proportions; on phones it floors at 20rem and the outer photos crop.      */
/* -------------------------------------------------------------------------- */

const DIAL_VARS = {
  "--R": "clamp(20rem, 56.4cqw, 46rem)", // radius the photos sit on
  "--Rt": "calc(var(--R) * 0.805)", // radius of the tick ring
  "--cw": "clamp(5.75rem, 12.6cqw, 10rem)", // photo width
  "--ch": "calc(var(--cw) * 1.2)", // photo height
  "--cy": "calc(var(--R) + var(--ch) / 2)", // dial centre, from top
  "--tick": "clamp(14px, 2.3cqw, 26px)", // tick length
} as CSSProperties;

const TICKS = (color: string) =>
  `repeating-conic-gradient(from -0.15deg, var(${color}) 0deg 0.3deg, transparent 0.3deg 1deg)`;

// A true circular band: clear inside, ticks from (edge - tick) to the edge, clear outside.
const RING_MASK =
  "radial-gradient(closest-side, transparent calc(100% - var(--tick)), #000 calc(100% - var(--tick)), #000 calc(100% - 0.5px), transparent 100%)";

const SWEEP_MASK =
  "conic-gradient(from var(--dial-sweep), transparent 0deg, #000 38deg, transparent 76deg)";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Count-up                                                                  */
/* -------------------------------------------------------------------------- */

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 2.2,
      ease: "easeOut",
      delay: 0.3,
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref}>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {Math.round(value)}
        <span className="text-burning-flame">{suffix}</span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function EveryoneSection() {
  const reduce = useReducedMotion();
  const mid = (PEOPLE.length - 1) / 2;

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.1,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  // Photos open like a hand of cards: from straight up to their place on the arc
  const fan: Variants = {
    hidden: ({ angle }: { angle: number }) => ({
      rotate: reduce ? angle : 0,
      opacity: reduce ? 1 : 0,
    }),
    show: ({ angle, order }: { angle: number; order: number }) => ({
      rotate: angle,
      opacity: 1,
      transition: {
        duration: reduce ? 0 : 1.2,
        ease: EASE,
        delay: reduce ? 0 : 0.1 + order * 0.07,
      },
    }),
  };

  const fade: Variants = {
    hidden: { opacity: reduce ? 1 : 0 },
    show: {
      opacity: 1,
      transition: { duration: reduce ? 0 : 1.4, ease: "easeOut" },
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
      aria-labelledby="everyone-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-blue-fantastic-dark via-abyssal to-abyssal-dark pb-16 pt-12 text-palladian sm:pb-20 lg:pb-24 lg:pt-16"
    >
      <style>{`
        @property --dial-sweep { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        @keyframes dial-sweep { to { --dial-sweep: 360deg; } }
        @keyframes dial-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ---------- Background (same family as About) ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.06]"
          style={{
            maskImage:
              "radial-gradient(ellipse 85% 75% at 50% 38%, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 75% at 50% 38%, black, transparent 78%)",
          }}
        >
          <defs>
            <pattern
              id="everyone-star-lattice"
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
          <rect width="100%" height="100%" fill="url(#everyone-star-lattice)" />
        </svg>
        <div className="absolute -right-32 top-10 size-[30rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <div className="absolute -left-40 bottom-0 size-[34rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
      </div>

      {/* Width container: cqw units inside resolve against this */}
      <div className="w-full [container-type:inline-size]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative"
          style={DIAL_VARS}
        >
          {/* ---------- Dial: dashed track + orbiting dot ---------- */}
          <motion.div
            variants={fade}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 overflow-hidden"
            style={{
              top: "calc(var(--cy) - var(--R))",
              width: "calc(var(--R) * 2)",
              height: "calc(var(--R) * 1.25)",
            }}
          >
            <div className="aspect-square w-full rounded-full border border-dashed border-palladian/15" />
            <div
              className="absolute left-1/2 size-0 animate-[dial-spin_70s_linear_infinite] motion-reduce:hidden"
              style={{ top: "var(--R)" }}
            >
              <span
                className="absolute left-0 top-0 size-2.5 rounded-full bg-burning-flame shadow-[0_0_14px_var(--color-burning-flame)]"
                style={{ translate: "-50% calc(-50% - var(--R))" }}
              />
            </div>
          </motion.div>

          {/* ---------- Dial: tick ring with sweeping glow ---------- */}
          <motion.div
            variants={fade}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 overflow-hidden"
            style={{
              top: "calc(var(--cy) - var(--Rt))",
              width: "calc(var(--Rt) * 2)",
              height: "calc(var(--Rt) * 1.25)",
            }}
          >
            <div className="relative aspect-square w-full">
              {/* darker "dial face" so the copy sits calmly */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in oklab, var(--color-abyssal-dark) 65%, transparent), transparent)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{ maskImage: RING_MASK, WebkitMaskImage: RING_MASK }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: TICKS("--color-palladian") }}
                />
                <div
                  className="absolute inset-0 animate-[dial-sweep_16s_linear_infinite] motion-reduce:hidden"
                  style={{
                    backgroundImage: TICKS("--color-burning-flame"),
                    maskImage: SWEEP_MASK,
                    WebkitMaskImage: SWEEP_MASK,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* ---------- Photos on the arc ---------- */}
          {PEOPLE.map((p, i) => {
            const angle = (i - mid) * STEP;
            return (
              <motion.div
                key={p.name}
                custom={{ angle, order: Math.abs(i - mid) }}
                variants={fan}
                className="absolute left-1/2 size-0"
                style={{ top: "var(--cy)" }}
              >
                <div
                  className="absolute left-0 top-0"
                  style={{ transform: "translateY(calc(var(--R) * -1))" }}
                >
                  <figure
                    tabIndex={0}
                    className="group/card absolute h-[var(--ch)] w-[var(--cw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.1rem] border border-palladian/15 bg-blue-fantastic shadow-xl shadow-abyssal-dark/50 transition-transform duration-500 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame motion-reduce:transition-none motion-reduce:hover:scale-100"
                  >
                    <Image
                      src={p.src}
                      alt={`${p.name}, a member of our community`}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-abyssal-dark/95 via-abyssal-dark/70 to-transparent px-2 pb-2 pt-8 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100 motion-reduce:transition-none">
                      <p className="hidden text-[11px] leading-snug text-palladian sm:block">
                        “{p.quote}”
                      </p>
                      <p className="text-[11px] font-semibold text-burning-flame sm:mt-1">
                        {p.name}
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </motion.div>
            );
          })}

          {/* ---------- Copy ---------- */}
          <div
            className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 text-center sm:px-6"
            style={{
              paddingTop:
                "calc(var(--cy) - var(--Rt) + clamp(2.5rem, 7cqw, 5rem))",
            }}
          >
            <motion.div
              variants={rise}
              className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
            >
              <Users className="size-4 text-burning-flame" aria-hidden="true" />
              Everyone is welcome
            </motion.div>

            <motion.h2
              id="everyone-heading"
              variants={rise}
              className="mt-6 font-medium leading-[1.08] tracking-tight text-palladian-light"
              style={{ fontSize: "clamp(1.875rem, 4.4cqw, 3.5rem)" }}
            >
              A community where everyone belongs and feels at home
            </motion.h2>

            <motion.p
              variants={rise}
              className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/75 sm:text-base"
            >
              Families, students, newcomers and elders. All are welcome here,
              and more than a thousand members have already found their place
              with us.
            </motion.p>

            <motion.div variants={rise} className="mt-8">
              <Link
                href="/join"
                className="group inline-flex items-center gap-4 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
              >
                Join Our Community
                <span className="grid size-10 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover:translate-x-0.5">
                  <ChevronsRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* ---------- Stats ---------- */}
          <motion.dl
            variants={rise}
            className="relative z-10 mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-y-8 px-4 sm:grid-cols-4 sm:px-6 lg:mt-20"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center border-l border-palladian/10 px-2 text-center first:border-l-0 max-sm:odd:border-l-0"
              >
                <dd className="order-1 text-3xl font-semibold tracking-tight text-palladian-light sm:text-4xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </dd>
                <dt className="order-2 mt-2 text-xs font-medium text-oatmeal sm:text-sm">
                  {s.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}