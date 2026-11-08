"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  Compass,
  Eye,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import Commitments from "./commitment";

/* -------------------------------------------------------------------------- */
/*  Content — numbers, stage programs and photos are placeholders             */
/* -------------------------------------------------------------------------- */

const VISION_IMAGE = "/about/6.jpg";

const VISION_TRAITS: { label: string; Icon: LucideIcon }[] = [
  { label: "Inclusive", Icon: Users },
  { label: "Educated", Icon: GraduationCap },
  { label: "Empowered", Icon: Sparkles },
];

const MISSION_ROWS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Educational programs", href: "/services/education", Icon: GraduationCap },
  { label: "Skill development", href: "/services", Icon: Briefcase },
  { label: "Sports", href: "/services/youth-family", Icon: Trophy },
  { label: "Community services", href: "/services/community-support", Icon: HeartHandshake },
];

const MISSION_OUTCOMES = ["Leadership", "Well-being", "Social inclusion"];

const STAGES = [
  {
    label: "Children",
    ages: "Ages 5 to 12",
    image: "/about/8.jpg",
    sessions: 6,
    blurb: "Curious minds learn best when learning feels like play.",
    points: [
      "Quran and Arabic foundations",
      "Play-based learning and games",
      "Weekend sports and crafts",
    ],
  },
  {
    label: "Teens",
    ages: "Ages 13 to 18",
    image: "/about/9.jpg",
    sessions: 5,
    blurb: "A safe space to find direction, friends and a voice.",
    points: [
      "Mentoring and leadership circles",
      "Study support and exam prep",
      "Football and fitness clubs",
    ],
  },
  {
    label: "Adults",
    ages: "Ages 19 to 59",
    image: "/about/10.jpg",
    sessions: 8,
    blurb: "Skills, purpose and community alongside work and family.",
    points: [
      "Career workshops and CV clinics",
      "Evening classes and skills training",
      "Volunteering and community projects",
    ],
  },
  {
    label: "Seniors",
    ages: "Ages 60 and over",
    image: "/about/11.jpg",
    sessions: 4,
    blurb: "Wisdom is shared, and no one eats or walks alone.",
    points: [
      "Social mornings and shared meals",
      "Gentle fitness and health talks",
      "Mentoring the next generation",
    ],
  },
];

const PATH_NODES = ["Lifelong learning", "Healthy living", "Personal growth"];

const GLASS =
  "relative rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent";

const OVERLAY_GLASS =
  "rounded-2xl border border-palladian/[0.16] bg-abyssal-dark/40 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function useCountUp(to: number, delay = 0.4) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setV(to);
      return;
    }
    const c = animate(0, to, { duration: 2, ease: "easeOut", delay, onUpdate: setV });
    return () => c.stop();
  }, [inView, reduce, to, delay]);

  return [ref, v] as const;
}

/** 270-degree arc gauge with a travelling end dot, like the reference dial. */
function Gauge({ value }: { value: number }) {
  const pct = value / 100;
  const rad = ((135 + pct * 270) * Math.PI) / 180;
  const dx = 50 + 40 * Math.cos(rad);
  const dy = 50 + 40 * Math.sin(rad);
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      <circle
        cx="50" cy="50" r="40" fill="none" pathLength={100}
        strokeWidth="6" strokeLinecap="round" strokeDasharray="75 100"
        transform="rotate(135 50 50)"
        className="stroke-palladian/15"
      />
      <circle
        cx="50" cy="50" r="40" fill="none" pathLength={100}
        strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${Math.max(pct * 75, 0.01)} 100`}
        transform="rotate(135 50 50)"
        className="stroke-burning-flame"
      />
      <circle cx={dx} cy={dy} r="4.5" className="fill-palladian stroke-burning-flame" strokeWidth="2" />
    </svg>
  );
}

function Label({ children, Icon }: { children: ReactNode; Icon: LucideIcon }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/50 px-3.5 py-1.5 text-[13px] font-medium text-palladian backdrop-blur-md">
      <Icon className="size-4 text-burning-flame" aria-hidden="true" />
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function VisionMission() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [shown, setShown] = useState(STAGES[0].sessions);
  const [gaugeRef, gauge] = useCountUp(95);

  // Tween the sessions ring/number when the stage changes
  const shownRef = useRef(STAGES[0].sessions);
  useEffect(() => {
    const target = STAGES[stage].sessions;
    if (reduce) {
      shownRef.current = target;
      setShown(target);
      return;
    }
    const c = animate(shownRef.current, target, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => {
        shownRef.current = v;
        setShown(v);
      },
    });
    return () => c.stop();
  }, [stage, reduce]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 36 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.8, ease: EASE } },
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % STAGES.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + STAGES.length) % STAGES.length;
    else return;
    e.preventDefault();
    setStage(n);
    document.getElementById(`stage-tab-${n}`)?.focus();
  };

  const cur = STAGES[stage];

  return (
    <section
      aria-labelledby="vision-mission-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-blue-fantastic-dark py-20 text-palladian sm:py-24 lg:py-28"
    >
      <style>{`
        @keyframes vm-dot { from { left: 0%; } to { left: 100%; } }
        @keyframes vm-lit-a { 0%,16% { background: var(--color-burning-flame); border-color: var(--color-burning-flame); color: var(--color-abyssal); } 24%,100% { background: var(--color-abyssal-dark); border-color: color-mix(in oklab, var(--color-palladian) 30%, transparent); color: var(--color-palladian); } }
        @keyframes vm-lit-b { 0%,40% { background: var(--color-abyssal-dark); border-color: color-mix(in oklab, var(--color-palladian) 30%, transparent); color: var(--color-palladian); } 46%,60% { background: var(--color-burning-flame); border-color: var(--color-burning-flame); color: var(--color-abyssal); } 68%,100% { background: var(--color-abyssal-dark); border-color: color-mix(in oklab, var(--color-palladian) 30%, transparent); color: var(--color-palladian); } }
        @keyframes vm-lit-c { 0%,84% { background: var(--color-abyssal-dark); border-color: color-mix(in oklab, var(--color-palladian) 30%, transparent); color: var(--color-palladian); } 92%,100% { background: var(--color-burning-flame); border-color: var(--color-burning-flame); color: var(--color-abyssal); } }
      `}</style>

      {/* ---------- Background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.06]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 55% at 50% 12%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 55% at 50% 12%, black, transparent 78%)",
          }}
        >
          <defs>
            <pattern id="vm-lattice" width="96" height="96" patternUnits="userSpaceOnUse">
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
          <rect width="100%" height="100%" fill="url(#vm-lattice)" />
        </svg>
        <div className="absolute -left-40 top-1/4 size-[34rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 size-[36rem] rounded-full bg-burning-flame/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ====================== BLOCK 1: Vision + Mission ====================== */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="flex flex-col items-center text-center">
            <motion.div variants={rise}>
              <Label Icon={Compass}>Vision and mission</Label>
            </motion.div>
            <motion.h2
              id="vision-mission-heading"
              variants={rise}
              className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
            >
              A straight path to a stronger community
            </motion.h2>
            <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/75 sm:text-base">
              Where we are heading, and how we get there.
            </motion.p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            {/* ---- Vision (photo + glass) ---- */}
            <motion.article
              variants={rise}
              className="group relative min-h-[34rem] overflow-hidden rounded-3xl border border-palladian/[0.12] shadow-2xl shadow-abyssal-dark/50 lg:col-span-7"
            >
              <Image
                src={VISION_IMAGE}
                alt=""
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-blue-fantastic/40 mix-blend-multiply" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark via-abyssal-dark/30 to-abyssal-dark/10" />

              <div className="absolute left-5 top-5">
                <Label Icon={Eye}>Our Vision</Label>
              </div>

              {/* Gauge */}
              <div
                ref={gaugeRef}
                className={`absolute right-5 top-5 grid size-32 place-items-center sm:size-36 ${OVERLAY_GLASS} rounded-full`}
              >
                <div className="absolute inset-2.5">
                  <Gauge value={gauge} />
                </div>
                <div className="relative text-center">
                  <p className="text-2xl font-semibold tabular-nums text-palladian-light sm:text-3xl">
                    <span aria-hidden="true">{Math.round(gauge)}</span>
                    <span className="sr-only">95</span>
                    <span className="text-burning-flame">%</span>
                  </p>
                  <p className="mt-0.5 text-[10px] leading-tight text-oatmeal">satisfied<br />families</p>
                </div>
              </div>

              <div className={`absolute inset-x-4 bottom-4 p-5 sm:inset-x-5 sm:bottom-5 sm:p-7 ${OVERLAY_GLASS}`}>
                <h3 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-palladian-light sm:text-3xl">
                  An inclusive, educated and empowered community.
                </h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {VISION_TRAITS.map(({ label, Icon }, i) => (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 + i * 0.12, ease: EASE }}
                      className="group/chip inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-palladian/10 px-3.5 py-1.5 text-sm font-medium text-palladian transition-colors duration-300 hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal"
                    >
                      <Icon className="size-4 text-burning-flame transition-colors group-hover/chip:text-abyssal" aria-hidden="true" />
                      {label}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.article>

            {/* ---- Mission (glass) ---- */}
            <motion.div variants={rise} className="lg:col-span-5">
              <div className={`${GLASS} flex h-full flex-col overflow-hidden p-6 sm:p-8`}>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full text-palladian opacity-[0.07]"
                  style={{
                    maskImage: "radial-gradient(ellipse 70% 50% at 100% 0%, black, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 100% 0%, black, transparent 80%)",
                  }}
                >
                  <rect width="100%" height="100%" fill="url(#vm-lattice)" />
                </svg>

                <div className="relative flex h-full flex-col">
                  <Label Icon={Target}>Our Mission</Label>
                  <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-palladian-light sm:text-3xl">
                    Programs and services that build people up
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-palladian/70">
                    Educational programs, skill development, sports and
                    community services, designed to grow leadership,
                    well-being and social inclusion.
                  </p>

                  <p className="mt-7 text-xs font-medium text-oatmeal">What we do</p>
                  <ul className="mt-2 space-y-1">
                    {MISSION_ROWS.map(({ label, href, Icon }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="group/row flex items-center gap-3 rounded-2xl border border-transparent px-2.5 py-2 transition-colors duration-300 hover:border-palladian/10 hover:bg-palladian/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                        >
                          <span className="grid size-10 place-items-center rounded-full bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover/row:bg-burning-flame group-hover/row:text-abyssal">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <span className="flex-1 text-sm font-medium text-palladian">{label}</span>
                          <ArrowUpRight className="size-4 -translate-x-1 text-burning-flame opacity-0 transition-all duration-300 group-hover/row:translate-x-0 group-hover/row:opacity-100" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-medium text-oatmeal">What it builds</p>
                      <span aria-hidden="true" className="h-px flex-1 bg-linear-to-r from-palladian/20 to-transparent" />
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {MISSION_OUTCOMES.map((o) => (
                        <li
                          key={o}
                          className="rounded-full border border-burning-flame/25 bg-burning-flame/15 px-3.5 py-1.5 text-sm font-medium text-burning-flame-light"
                        >
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ====================== BLOCK 2: Every stage of life ====================== */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-5 grid gap-5 lg:grid-cols-12"
        >
          {/* Left: glass text panel */}
          <motion.div variants={rise} className="lg:col-span-5">
            <div className={`${GLASS} flex h-full flex-col p-6 sm:p-8`}>
              <p className="text-xs font-medium text-burning-flame">A lifelong journey</p>
              <h3 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-palladian-light sm:text-4xl">
                Opportunities for every stage of life
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-palladian/70 sm:text-base">
                Our vision doesn&apos;t stop at any age. Pick a stage to see how
                we learn, move and grow together.
              </p>

              <div
                role="tablist"
                aria-label="Life stage"
                className="relative mt-6 grid grid-cols-2 gap-1 rounded-3xl border border-palladian/10 bg-abyssal-dark/40 p-1 sm:grid-cols-4 sm:rounded-full"
              >
                {STAGES.map((s, i) => {
                  const active = i === stage;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      role="tab"
                      id={`stage-tab-${i}`}
                      aria-selected={active}
                      aria-controls="stage-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setStage(i)}
                      onKeyDown={(e) => onTabKey(e, i)}
                      className="relative rounded-full px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      {active && (
                        <motion.span
                          layoutId="stage-pill"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                          className="absolute inset-0 rounded-full bg-burning-flame"
                        />
                      )}
                      <span className={`relative transition-colors duration-300 ${active ? "text-abyssal" : "text-palladian/80 hover:text-palladian"}`}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div role="tabpanel" id="stage-panel" aria-labelledby={`stage-tab-${stage}`} className="mt-6 min-h-[11.5rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                  >
                    <p className="text-base font-medium leading-snug text-palladian-light">{cur.blurb}</p>
                    <ul className="mt-4 space-y-3">
                      {cur.points.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-sm text-palladian/80">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-burning-flame/20 text-burning-flame">
                            <Check className="size-3" aria-hidden="true" />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              <Link
                href="/programs"
                className="group mt-8 inline-flex w-fit items-center gap-4 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal motion-reduce:transition-colors motion-reduce:hover:translate-y-0 lg:mt-auto"
              >
                Find your program
                <span className="grid size-10 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Right: photo with glass overlays */}
          <motion.div
            variants={rise}
            className="relative min-h-[32rem] overflow-hidden rounded-3xl border border-palladian/[0.12] shadow-2xl shadow-abyssal-dark/50 lg:col-span-7"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={stage}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 1, ease: "easeOut" }}
              >
                <Image
                  src={cur.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden="true" className="absolute inset-0 bg-blue-fantastic/35 mix-blend-multiply" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/90 via-abyssal-dark/20 to-abyssal-dark/10" />

            {/* stage chip */}
            <div className={`absolute left-5 top-5 flex items-center gap-2 px-4 py-2.5 text-sm ${OVERLAY_GLASS} rounded-full`}>
              <Users className="size-4 text-burning-flame" aria-hidden="true" />
              <span className="font-semibold text-palladian-light">{cur.label}</span>
              <span className="text-oatmeal">{cur.ages}</span>
            </div>

            {/* growth path card */}
            <div className={`absolute inset-x-4 bottom-4 p-5 sm:right-auto sm:w-[23rem] ${OVERLAY_GLASS}`}>
              <p className="text-sm font-semibold text-palladian-light">One path, at every age</p>
              <div className="relative mt-5 px-3">
                <div aria-hidden="true" className="absolute inset-x-3 top-3 h-px bg-palladian/20">
                  <span
                    className="absolute -top-[3px] size-[7px] -translate-x-1/2 rounded-full bg-burning-flame shadow-[0_0_10px_var(--color-burning-flame)] motion-reduce:hidden"
                    style={{ animation: "vm-dot 6s linear infinite" }}
                  />
                </div>
                <ol className="relative flex justify-between">
                  {PATH_NODES.map((n, i) => (
                    <li key={n} className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className="grid size-6 place-items-center rounded-full border border-palladian/30 bg-abyssal-dark text-[10px] font-bold text-palladian motion-reduce:border-burning-flame motion-reduce:bg-burning-flame motion-reduce:text-abyssal"
                        style={{ animation: `vm-lit-${"abc"[i]} 6s linear infinite` }}
                      >
                        {i + 1}
                      </span>
                      <span className="mt-2 whitespace-nowrap text-[11px] font-medium text-palladian/85">{n}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* sessions ring */}
            <div className={`absolute bottom-4 right-4 hidden items-center gap-3 p-4 sm:flex ${OVERLAY_GLASS}`}>
              <div className="relative size-14">
                <svg viewBox="0 0 64 64" className="size-full -rotate-90" aria-hidden="true">
                  <circle cx="32" cy="32" r="26" fill="none" strokeWidth="5" className="stroke-palladian/15" />
                  <circle
                    cx="32" cy="32" r="26" fill="none" strokeWidth="5" strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray={`${(shown / 10) * 100} 100`}
                    className="stroke-burning-flame"
                  />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-lg font-semibold tabular-nums text-palladian-light">
                  {Math.round(shown)}
                </span>
              </div>
              <p className="text-xs leading-tight text-oatmeal">
                weekly<br />sessions
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>   
    </section>
  );
}