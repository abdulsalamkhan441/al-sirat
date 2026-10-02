"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Quote,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content — all names, quotes and numbers are placeholders                  */
/*  Photos reuse the member images from the Everyone section.                 */
/* -------------------------------------------------------------------------- */

// Unsplash avatar collection
const AVATARS = {
  1: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800", // Amina
  2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", // Daniel
  3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800", // Maria
  4: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800", // Yusuf
  5: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", // Fatima
  6: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800", // Omar
  7: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800", // Sara
};

const STORIES = [
  {
    name: "Amina Khalid",
    role: "Parent of three",
    avatar: AVATARS[1],
    headline: "My kids found their second home here.",
    sub: "Classes, friends and mentors, all in one place.",
  },
  {
    name: "Daniel Reyes",
    role: "New to the neighbourhood",
    avatar: AVATARS[2],
    headline: "I arrived knowing no one and left with friends.",
    sub: "Within a week I was invited to dinner.",
  },
  {
    name: "Fatima Noor",
    role: "Teacher and volunteer",
    avatar: AVATARS[5],
    headline: "Giving back here gave me so much more.",
    sub: "The warmth of this community is real.",
  },
];

const A = {
  handle: "@AminaKhalid",
  headline: "My children can't wait for Saturday class!",
  tags: ["Warm welcome", "Great teachers"],
  img: AVATARS[1],
};

const B = {
  names: "Daniel & Sara",
  when: "2 days ago",
  score: "5.0/5.0",
  avatars: [AVATARS[2], AVATARS[7]],
  text: "We moved here last year and knew nobody. Within a month, the community center felt like our second home.",
  more: "The Friday dinners and the neighbours we met there made all the difference.",
};

const C = {
  text: "Visited for the first time and was greeted like an old friend. The tea and conversation afterwards made my week.",
  name: "Maria Santos",
  avatar: AVATARS[3],
};

const D = {
  date: "26 Mar 2026",
  title: "A true lifeline",
  text: "The food drive carried our family through a hard month.",
  img: AVATARS[5],
};

const H = {
  handle: "@OmarHaddad · 12h",
  title: "Programs for every age",
  text: "From the youth club to evening Quran circles, there is something for each of us, and everyone is made to feel included.",
};

const I = {
  avatar: AVATARS[6],
  title: "A place for everyone",
  text: "No matter your background, you are welcome here.",
  hearts: 1914,
  views: "21.7k",
};

const J = {
  text: "I started volunteering for one weekend and never stopped. The people here make every task feel worthwhile and every visitor feel valued.",
  tag: "Great community",
  name: "Yusuf Ali",
  role: "Volunteer since 2019",
  avatar: AVATARS[4],
};
/* -------------------------------------------------------------------------- */
/*  Scatter layout (design canvas 1200 x 720, used from xl and up)            */
/* -------------------------------------------------------------------------- */

const DESIGN_W = 1200;
const DESIGN_H = 720;

type SlotId =
  | "featured" | "a" | "b" | "c" | "d" | "f" | "g" | "h" | "i" | "j" | "k";

// x/y/w in canvas px · d = parallax depth · f = float period (s) · o = float offset (s)
const LAYOUT: Record<SlotId, { x: number; y: number; w: number; d: number; f: number; o: number }> = {
  featured: { x: 282, y: 264, w: 372, d: 1.6, f: 9, o: 0 },
  a: { x: 40, y: 105, w: 210, d: 0.6, f: 8, o: 2 },
  b: { x: 282, y: 40, w: 312, d: 1.2, f: 7, o: 4 },
  c: { x: 628, y: 56, w: 240, d: 0.8, f: 8.5, o: 1 },
  d: { x: 900, y: 80, w: 280, d: 1, f: 9.5, o: 3 },
  f: { x: 692, y: 240, w: 196, d: 1.4, f: 6.5, o: 5 },
  g: { x: 692, y: 350, w: 236, d: 1.1, f: 7.5, o: 2 },
  h: { x: 692, y: 410, w: 216, d: 0.7, f: 9, o: 6 },
  i: { x: 944, y: 338, w: 236, d: 1.2, f: 8, o: 1 },
  j: { x: 60, y: 520, w: 410, d: 0.9, f: 7, o: 4 },
  k: { x: 490, y: 540, w: 184, d: 1.3, f: 6, o: 3 },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

const PointerCtx = createContext<{ x: MotionValue<number>; y: MotionValue<number> } | null>(null);

/** Moves a card against the pointer; deeper cards move more. */
function Float({ depth, children }: { depth: number; children: ReactNode }) {
  const ctx = useContext(PointerCtx)!;
  const x = useTransform(ctx.x, (v) => v * depth * -26);
  const y = useTransform(ctx.y, (v) => v * depth * -20);
  return <motion.div style={{ x, y }}>{children}</motion.div>;
}

/** Positions a card on the scatter canvas (xl+) or lets it flow in the grid. */
function Slot({ id, className = "", children }: { id: SlotId; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const L = LAYOUT[id];
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.94 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.85, ease: EASE } },
  };
  return (
    <motion.div
      variants={rise}
      style={{ "--x": `${L.x}px`, "--y": `${L.y}px`, "--w": `${L.w}px` } as CSSProperties}
      className={`xl:absolute xl:left-[var(--x)] xl:top-[var(--y)] xl:w-[var(--w)] ${className}`}
    >
      <Float depth={L.d}>
        <div
          style={{ animationDuration: `${L.f}s`, animationDelay: `-${L.o}s` }}
          className="xl:animate-[tcard-float_7s_ease-in-out_infinite] motion-reduce:animate-none"
        >
          {children}
        </div>
      </Float>
    </motion.div>
  );
}

function Glass({
  children,
  className = "",
  dim = false,
  hit = false,
  clip = true,
}: {
  children: ReactNode;
  className?: string;
  dim?: boolean;
  hit?: boolean;
  clip?: boolean;
}) {
  return (
    <div
      className={`relative rounded-3xl border bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl transition-all duration-500 before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent ${
        clip ? "overflow-hidden" : ""
      } ${
        hit
          ? "border-burning-flame/50 ring-1 ring-burning-flame/40"
          : "border-palladian/[0.12]"
      } ${dim ? "scale-[0.97] opacity-30 saturate-50" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Stars({ size = "size-3.5" }: { size?: string }) {
  return (
    <span className="flex gap-0.5" aria-label="5 out of 5 stars" role="img">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`${size} fill-burning-flame text-burning-flame`} aria-hidden="true" />
      ))}
    </span>
  );
}

function Avatar({ src, name, size = 28 }: { src: string; name: string; size?: number }) {
  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover ring-2 ring-abyssal-dark"
    />
  );
}

const chip =
  "rounded-full border border-burning-flame/25 bg-burning-flame/15 px-3 py-1 text-xs font-medium text-burning-flame-light";

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function TestimonialsSection() {
  const reduce = useReducedMotion();

  const [story, setStory] = useState(0);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [feel, setFeel] = useState(92);
  const [scale, setScale] = useState(1);

  const wrapRef = useRef<HTMLDivElement>(null);

  // Scale the 1200px design canvas to the container
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setScale(Math.min(1, e.contentRect.width / DESIGN_W)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Featured-story autoplay
  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setStory((s) => (s + 1) % STORIES.length), 7000);
    return () => clearInterval(id);
  }, [paused, reduce]);

  // Pointer parallax (mouse only, xl+)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 });

  const cur = STORIES[story];
  const go = (dir: number) => setStory((s) => (s + dir + STORIES.length) % STORIES.length);

  // Search: matching cards glow, the rest dim
  const q = query.trim().toLowerCase();
  const hay = {
    featured: `${cur.name} ${cur.role} ${cur.headline} ${cur.sub}`,
    a: `${A.handle} ${A.headline} ${A.tags.join(" ")}`,
    b: `${B.names} ${B.text} ${B.more}`,
    c: `${C.name} ${C.text}`,
    d: `${D.title} ${D.text}`,
    h: `${H.handle} ${H.title} ${H.text}`,
    i: `${I.title} ${I.text}`,
    j: `${J.name} ${J.role} ${J.tag} ${J.text}`,
  };
  type Key = keyof typeof hay;
  const keys = Object.keys(hay) as Key[];
  const matches = (k: Key) => hay[k].toLowerCase().includes(q);
  const st = (k: Key) => ({ dim: !!q && !matches(k), hit: !!q && matches(k) });
  const matchCount = q ? keys.filter(matches).length : keys.length;

  const feelLabel =
    feel >= 90 ? "Like family" : feel >= 65 ? "Welcome" : feel >= 35 ? "Getting there" : "Tell us why";

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-abyssal-dark py-20 text-palladian sm:py-24 lg:py-28"
    >
      <style>{`
        @keyframes tcard-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -8px; }
        }
      `}</style>

      {/* ---------- Background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.05]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 55%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 55%, black, transparent 78%)",
          }}
        >
          <defs>
            <pattern id="testi-star-lattice" width="96" height="96" patternUnits="userSpaceOnUse">
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
          <rect width="100%" height="100%" fill="url(#testi-star-lattice)" />
        </svg>
        {/* diagonal light, like the reference: cool top-left, warm bottom-right */}
        <div className="absolute -left-48 -top-24 size-[44rem] rounded-full bg-blue-fantastic-light/35 blur-[130px]" />
        <div className="absolute -bottom-24 -right-48 size-[44rem] rounded-full bg-truffle/30 blur-[130px]" />
        <div className="absolute -right-10 bottom-10 size-[24rem] rounded-full bg-burning-flame/15 blur-[110px]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ---------- Header ---------- */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
            <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
            Kind words
          </div>
          <h2
            id="testimonials-heading"
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
          >
            Loved by the people who call it home
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/75 sm:text-base">
            Real stories from families, students and neighbours who found their
            place with us. Try the search to find the ones that sound like you.
          </p>
        </div>

        {/* ---------- Canvas ---------- */}
        <PointerCtx.Provider value={{ x: sx, y: sy }}>
          <div
            ref={wrapRef}
            onPointerMove={(e) => {
              if (reduce || e.pointerType !== "mouse") return;
              if (!window.matchMedia("(min-width: 1280px)").matches) return;
              const r = e.currentTarget.getBoundingClientRect();
              px.set((e.clientX - r.left) / r.width - 0.5);
              py.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onPointerLeave={() => {
              px.set(0);
              py.set(0);
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative mt-14 xl:h-[var(--dh)]"
            style={{ "--dh": `${DESIGN_H * scale}px`, "--s": scale } as CSSProperties}
          >
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:block xl:absolute xl:left-1/2 xl:top-0 xl:h-[720px] xl:w-[1200px] xl:-translate-x-1/2 xl:origin-top xl:scale-[var(--s)]"
            >
              {/* Featured story (carousel) */}
              <Slot id="featured" className="sm:col-span-2 lg:col-span-2">
                <Glass {...st("featured")} className="p-6 xl:h-[236px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={story}
                      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduce ? 0 : -14 }}
                      transition={{ duration: reduce ? 0 : 0.35 }}
                      className="flex h-full flex-col"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={cur.avatar} name={cur.name} size={48} />
                          <div>
                            <h3 className="text-sm font-bold text-palladian-light">{cur.name}</h3>
                            <p className="text-xs text-oatmeal">{cur.role}</p>
                          </div>
                        </div>
                        <span className="rounded-full border border-burning-flame/25 bg-burning-flame/15 px-3 py-1.5">
                          <Stars size="size-3" />
                        </span>
                      </div>
                      <h3 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-palladian-light sm:text-[1.7rem]">
                        {cur.headline}
                      </h3>
                      <p className="mt-2 text-sm text-palladian/65">{cur.sub}</p>
                    </motion.div>
                  </AnimatePresence>
                </Glass>
              </Slot>

              {/* A: tall photo review */}
              <Slot id="a">
                <Glass {...st("a")} className="flex flex-col p-5 xl:min-h-[340px]">
                  <div className="flex items-center justify-between">
                    <Stars />
                    <BadgeCheck className="size-4 text-burning-flame/70" aria-label="Verified member" />
                  </div>
                  <p className="mt-4 text-lg font-semibold leading-snug text-palladian-light">
                    {A.headline}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {A.tags.map((t) => (
                      <span key={t} className={chip}>{t}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-oatmeal">{A.handle}</p>
                  <div className="relative mt-4 h-28 w-full overflow-hidden rounded-2xl border border-palladian/10 xl:mt-auto">
                    <Image src={A.img} alt="" fill sizes="220px" className="object-cover" />
                  </div>
                </Glass>
              </Slot>

              {/* B: pair review with read more */}
              <Slot id="b">
                <Glass {...st("b")} className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex -space-x-2">
                        {B.avatars.map((src, i) => (
                          <Avatar key={i} src={src} name="" size={28} />
                        ))}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-palladian-light">{B.names}</h4>
                        <p className="text-[11px] text-oatmeal">{B.when}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-burning-flame">
                      <Star className="size-3.5 fill-burning-flame" aria-hidden="true" />
                      {B.score}
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-palladian/75">
                    {B.text}
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {" "}{B.more}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </p>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                    className="mt-2 inline-flex items-center gap-1 rounded text-[11px] font-medium text-oatmeal transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                  >
                    {open ? "Show less" : "Read more"}
                    <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                </Glass>
              </Slot>

              {/* C: short quote */}
              <Slot id="c">
                <Glass {...st("c")} className="flex flex-col p-5">
                  <Quote className="size-5 text-burning-flame/70" aria-hidden="true" />
                  <p className="mt-2 text-xs leading-relaxed text-palladian/80">{C.text}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Stars size="size-3" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-oatmeal">{C.name}</span>
                      <Avatar src={C.avatar} name={C.name} size={22} />
                    </div>
                  </div>
                </Glass>
              </Slot>

              {/* D: split image review */}
              <Slot id="d" className="sm:col-span-1">
                <Glass {...st("d")} className="grid min-h-[170px] grid-cols-[1fr_38%]">
                  <div className="flex flex-col p-5">
                    <span className="text-[11px] text-oatmeal">{D.date}</span>
                    <h4 className="mt-2 text-xl font-bold leading-tight text-palladian-light">{D.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-palladian/65">{D.text}</p>
                    <div className="mt-auto pt-3"><Stars size="size-3" /></div>
                  </div>
                  <div className="relative">
                    <Image src={D.img} alt="" fill sizes="120px" className="object-cover" />
                    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-abyssal/60 to-transparent" />
                  </div>
                </Glass>
              </Slot>

              {/* F: rating pill with badge */}
              <Slot id="f">
                <Glass clip={false} className="px-4 py-3.5">
                  <p className="text-sm font-semibold text-palladian-light">Community Rating</p>
                  <p className="mt-0.5 text-[11px] text-oatmeal">★ 4.9 from 400+ members</p>
                  <span
                    aria-label="99+ new reviews"
                    className="absolute -right-2 -top-3 rounded-full bg-burning-flame px-2.5 py-1 text-[10px] font-bold text-abyssal shadow-lg shadow-abyssal-dark/50"
                  >
                    99+
                    <span aria-hidden="true" className="absolute -bottom-1 left-3 size-2 rotate-45 bg-burning-flame" />
                  </span>
                </Glass>
              </Slot>

              {/* G: search, filters the cards live */}
              <Slot id="g" className="sm:col-span-2 lg:col-span-1">
                <div
                  className={`flex items-center gap-2 rounded-full border bg-linear-to-r from-palladian/[0.1] to-palladian/[0.04] py-1.5 pl-4 pr-1.5 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl transition-colors ${
                    q ? "border-burning-flame/50" : "border-palladian/[0.15]"
                  }`}
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Try “friends”"
                    aria-label="Search client reviews"
                    className="min-w-0 flex-1 bg-transparent text-xs text-palladian placeholder:text-oatmeal focus-visible:outline-none"
                  />
                  {q && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="grid size-6 place-items-center rounded-full text-oatmeal transition-colors hover:text-palladian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-burning-flame text-abyssal">
                    <Search className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
                <p className="sr-only" aria-live="polite">
                  {q ? `${matchCount} reviews match` : ""}
                </p>
              </Slot>

              {/* H: tall review */}
              <Slot id="h">
                <Glass {...st("h")} className="flex flex-col p-5 xl:min-h-[240px]">
                  <p className="text-[11px] text-oatmeal">{H.handle}</p>
                  <h4 className="mt-2 text-xl font-bold leading-tight text-palladian-light">{H.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-palladian/65">{H.text}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <Stars size="size-3" />
                    <span className="text-[11px] text-oatmeal">(5.0) Community score</span>
                  </div>
                </Glass>
              </Slot>

              {/* I: profile card with like */}
              <Slot id="i">
                <Glass {...st("i")} className="flex flex-col items-center p-5 text-center">
                  <div className="absolute inset-0 bg-linear-to-b from-burning-flame/10 to-transparent" aria-hidden="true" />
                  <div className="relative flex flex-col items-center">
                    <Image
                      src={I.avatar}
                      alt="A member of our community"
                      width={64}
                      height={64}
                      className="size-16 rounded-full object-cover ring-2 ring-burning-flame/60"
                    />
                    <h4 className="mt-3 text-base font-bold text-palladian-light">{I.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-palladian/65">{I.text}</p>
                    <div className="mt-4 flex w-full items-center justify-center gap-5 border-t border-palladian/10 pt-3 text-xs text-oatmeal">
                      <button
                        type="button"
                        aria-pressed={liked}
                        aria-label="Like this story"
                        onClick={() => setLiked((l) => !l)}
                        className="flex items-center gap-1.5 rounded-full px-1 transition-colors hover:text-palladian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                      >
                        <motion.span
                          key={String(liked)}
                          initial={{ scale: reduce ? 1 : 0.6 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 14 }}
                          className="flex"
                        >
                          <Heart
                            className={`size-4 text-burning-flame ${liked ? "fill-burning-flame" : ""}`}
                            aria-hidden="true"
                          />
                        </motion.span>
                        <span className="tabular-nums">{(I.hearts + (liked ? 1 : 0)).toLocaleString()}</span>
                      </button>
                      <span className="flex items-center gap-1.5">
                        <Eye className="size-4" aria-hidden="true" />
                        {I.views}
                      </span>
                    </div>
                  </div>
                </Glass>
              </Slot>

              {/* J: wide review */}
              <Slot id="j" className="sm:col-span-2 lg:col-span-2">
                <Glass {...st("j")} className="p-5">
                  <Stars />
                  <p className="mt-3 text-[13px] leading-relaxed text-palladian/75">{J.text}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className={chip}>{J.tag}</span>
                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-palladian-light">{J.name}</p>
                        <p className="text-[11px] text-oatmeal">{J.role}</p>
                      </div>
                      <Avatar src={J.avatar} name={J.name} size={34} />
                    </div>
                  </div>
                </Glass>
              </Slot>

              {/* K: feedback slider */}
              <Slot id="k">
                <Glass clip={false} className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-palladian-light">Your Feedback</span>
                    <span className="text-[11px] text-oatmeal">{feelLabel}</span>
                  </div>
                  <div className="relative mt-8 h-5">
                    <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-palladian/10">
                      <div className="h-full rounded-full bg-burning-flame" style={{ width: `${feel}%` }} />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={feel}
                      onChange={(e) => setFeel(Number(e.target.value))}
                      aria-label="How welcome did you feel?"
                      aria-valuetext={`${feel} out of 100, ${feelLabel}`}
                      className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-burning-flame bg-palladian shadow-md peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame/60"
                      style={{ left: `${feel}%` }}
                    >
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg bg-palladian px-2 py-0.5 text-[10px] font-bold text-abyssal tabular-nums">
                        {feel}
                        <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-palladian" />
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-oatmeal">How welcome did you feel?</p>
                </Glass>
              </Slot>
            </motion.div>
          </div>
        </PointerCtx.Provider>

        {/* ---------- Featured-story controls ---------- */}
        <div
          role="group"
          aria-label="Featured stories"
          className="mt-12 flex items-center justify-center gap-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous story"
            className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div className="flex items-center gap-1">
            {STORIES.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setStory(i)}
                aria-label={`Show story ${i + 1}: ${s.name}`}
                aria-current={i === story}
                className="grid h-6 w-6 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === story ? "h-2.5 w-6 bg-burning-flame" : "size-2 bg-palladian/30 hover:bg-palladian/60"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next story"
            className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}