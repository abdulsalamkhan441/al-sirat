"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Building2,
  Car,
  GraduationCap,
  HeartHandshake,
  LayoutGrid,
  Sparkles,
  Trees,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (placeholders, swap for real details)                             */
/* -------------------------------------------------------------------------- */

/** Unsplash helper. Swap these for photos of your own facility. A failed image shows a gradient + icon. */
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const FEATURES: { id: string; title: string; Icon: LucideIcon; text: string; photo: string; tone: string }[] = [
  {
    id: "indoor", title: "Large indoor event space", Icon: Building2,
    text: "A big, open hall with room for everything from workshops to large celebrations.",
    photo: u("photo-1519167758481-83f550bb49b3"), tone: "from-blue-fantastic-light via-blue-fantastic to-abyssal",
  },
  {
    id: "outdoor", title: "Outdoor activity areas", Icon: Trees,
    text: "Open-air space for games, festivals and activities when the weather is on your side.",
    photo: u("photo-1431324155629-1a6deb1dec8d"), tone: "from-burning-flame-dark/60 via-truffle-dark to-abyssal",
  },
  {
    id: "training", title: "Training and classroom facilities", Icon: GraduationCap,
    text: "Classrooms and training rooms set up for lessons, courses and professional sessions.",
    photo: u("photo-1427504494785-3a9ca7044f45"), tone: "from-truffle via-truffle-dark to-abyssal",
  },
  {
    id: "sports", title: "Sports and recreational areas", Icon: Trophy,
    text: "Space to play, practise and compete, for teams and families alike.",
    photo: u("photo-1546519638-68e109498ffc"), tone: "from-blue-fantastic-light via-truffle-dark to-abyssal",
  },
  {
    id: "layouts", title: "Flexible event layouts", Icon: LayoutGrid,
    text: "Rows, rounds, open floor or stage: the room adapts to the way your event works.",
    photo: u("photo-1511578314322-379afb476865"), tone: "from-gold-accent/60 via-blue-fantastic to-abyssal",
  },
  {
    id: "parking", title: "Ample parking availability", Icon: Car,
    text: "Plenty of parking close to the entrance, so guests arrive without the stress.",
    photo: u("photo-1506521781263-d8422e82f27a"), tone: "from-blue-fantastic via-abyssal-light to-abyssal",
  },
  {
    id: "community", title: "Community-friendly environment", Icon: HeartHandshake,
    text: "A welcoming, respectful space where families, neighbours and groups feel at home.",
    photo: u("photo-1511632765486-a01980e01a18"), tone: "from-truffle-light/60 via-blue-fantastic to-abyssal",
  },
];

const CYCLE_MS = 5200;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

function Photo({ src, Icon, tone }: { src: string; Icon: LucideIcon; tone: string }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative size-full overflow-hidden bg-linear-to-br ${tone}`}>
      <Icon className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
      {!bad && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" decoding="async" onError={() => setBad(true)} className="absolute inset-0 size-full object-cover" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function FacilityFeatures() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = FEATURES[active];
  const still = paused || reduce;

  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % FEATURES.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, still]);

  const go = (i: number, focus = false) => {
    const n = (i + FEATURES.length) % FEATURES.length;
    setActive(n);
    if (focus) tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); go(active + 1, true); }
    else if (e.key === "ArrowUp") { e.preventDefault(); go(active - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); go(0, true); }
    else if (e.key === "End") { e.preventDefault(); go(FEATURES.length - 1, true); }
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <section
      id="facility-spaces"
      aria-labelledby="features-heading"
      className="relative isolate overflow-hidden py-20 text-palladian sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="absolute -top-4 right-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent xl:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Venue
        </span>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          <motion.div variants={rise} className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
              <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
              Available features
            </div>
            <h2 id="features-heading" className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl">
              Everything your event needs
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-palladian/75 sm:text-base">
              Seven things that make the facility work for gatherings, classes, games and
              celebrations. Pick one to take a closer look.
            </p>
          </motion.div>

          <div
            className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {/* ---------- List ---------- */}
            <motion.div variants={rise} className="order-2 lg:order-1 lg:col-span-4">
              <div role="tablist" aria-label="Facility features" aria-orientation="vertical" onKeyDown={onKey}>
                {FEATURES.map((ft, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={ft.id}
                      ref={(el) => { tabs.current[i] = el; }}
                      id={`feature-tab-${ft.id}`}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="feature-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => setActive(i)}
                      className="group relative flex w-full items-center gap-4 border-b border-palladian/10 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                          on
                            ? "border-burning-flame bg-burning-flame text-abyssal shadow-lg shadow-burning-flame/20"
                            : "border-burning-flame/25 bg-burning-flame/15 text-burning-flame group-hover:bg-burning-flame/25"
                        }`}
                      >
                        <ft.Icon className="size-[18px]" aria-hidden="true" />
                      </span>
                      <span className={`flex-1 text-sm font-semibold leading-snug transition-colors duration-300 sm:text-[15px] ${on ? "text-palladian-light" : "text-palladian/75 group-hover:text-palladian-light"}`}>
                        {ft.title}
                      </span>
                      <span className="text-[11px] tabular-nums text-oatmeal">0{i + 1}</span>
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{ scaleX: on ? 1 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                        className="absolute -bottom-px left-0 h-px w-full origin-left bg-burning-flame"
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* ---------- Circle ---------- */}
            <motion.div variants={rise} className="order-1 lg:order-2 lg:col-span-4">
              <div className="relative mx-auto aspect-square w-full max-w-[420px] p-4">
                <div className="relative size-full">
                  <motion.div
                    aria-hidden="true"
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 90, ease: "linear", repeat: Infinity }}
                    className="absolute -inset-3 rounded-full border border-dashed border-palladian/10"
                  />
                  <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90 overflow-visible">
                    <circle cx="50" cy="50" r="50" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" className="stroke-palladian/15" />
                    <motion.circle
                      key={`${active}-${paused}`}
                      cx="50" cy="50" r="50" fill="none" strokeWidth="2" strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="stroke-burning-flame"
                      initial={{ pathLength: still ? 1 : 0, opacity: still ? 0.35 : 1 }}
                      animate={{ pathLength: 1, opacity: still ? 0.35 : 1 }}
                      transition={{ duration: still ? 0.3 : CYCLE_MS / 1000, ease: "linear" }}
                    />
                  </svg>
                  <div className="absolute inset-[5%] overflow-hidden rounded-full border border-palladian/[0.12] bg-abyssal-dark shadow-2xl shadow-abyssal-dark/60">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, scale: reduce ? 1 : 1.15 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
                        className="absolute inset-0"
                      >
                        <Photo src={f.photo} Icon={f.Icon} tone={f.tone} />
                      </motion.div>
                    </AnimatePresence>
                    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-abyssal-dark/70 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ---------- Detail ---------- */}
            <motion.div variants={rise} className="order-3 lg:col-span-4">
              <div id="feature-panel" role="tabpanel" aria-labelledby={`feature-tab-${f.id}`} className="rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-6 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                    transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-full border border-burning-flame/30 bg-burning-flame/15 text-burning-flame">
                        <f.Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span className="text-xs tabular-nums text-oatmeal">0{active + 1} / 0{FEATURES.length}</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-palladian-light">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-palladian/75">{f.text}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-6 flex gap-1.5" aria-hidden="true">
                  {FEATURES.map((ft, i) => (
                    <span key={ft.id} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i === active ? "bg-burning-flame" : "bg-palladian/15"}`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}