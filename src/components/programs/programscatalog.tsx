"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  Baby,
  Bot,
  BrainCircuit,
  Briefcase,
  ChevronDown,
  Flame,
  GraduationCap,
  HardHat,
  Heart,
  Languages,
  Laptop,
  MapPin,
  Monitor,
  Search,
  SearchX,
  Sparkles,
  Sun,
  Users,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

type Format = "Online" | "In person";
type CatId = "academic" | "language" | "trades" | "community";

const CATEGORIES: Record<CatId, { label: string; tone: string }> = {
  academic: { label: "Academic & Technology", tone: "from-blue-fantastic-light via-blue-fantastic to-abyssal" },
  language: { label: "Language Learning", tone: "from-truffle via-truffle-dark to-abyssal" },
  trades: { label: "Trades Awareness", tone: "from-burning-flame-dark/70 via-truffle-dark to-abyssal" },
  community: { label: "Community Programs", tone: "from-gold-accent/60 via-blue-fantastic to-abyssal" },
};

const AUDIENCES = ["Children", "Youth", "Adults", "Women", "Seniors", "Families", "Newcomers"] as const;
type Audience = (typeof AUDIENCES)[number];

type Program = {
  id: string;
  title: string;
  cat: CatId;
  Icon: LucideIcon;
  line: string;
  focus: string[];
  audience: Audience[];
  formats: Format[];
  cert: boolean;
  photo: string;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;
const BOTH: Format[] = ["Online", "In person"];
const LIVE: Format[] = ["In person"];

const PROGRAMS: Program[] = [
  {
    id: "ai", title: "Foundational Artificial Intelligence", cat: "academic", Icon: BrainCircuit,
    line: "AI fundamentals, machine learning concepts, applications and responsible AI use.",
    focus: ["AI fundamentals", "Machine learning", "Responsible AI"],
    audience: ["Youth", "Adults"], formats: BOTH, cert: true, photo: u("photo-1677442136019-21780ecad995"),
  },
  {
    id: "robotics", title: "Beginner Robotics", cat: "academic", Icon: Bot,
    line: "Robotics, automation, coding fundamentals and hands-on problem-solving.",
    focus: ["Robotics", "Automation", "Coding basics"],
    audience: ["Children", "Youth"], formats: LIVE, cert: true, photo: u("photo-1485827404703-89b55fcc595e"),
  },
  {
    id: "office", title: "MS Office Applications", cat: "academic", Icon: Laptop,
    line: "Word, Excel, PowerPoint, Outlook and workplace productivity.",
    focus: ["Word & Excel", "PowerPoint", "Outlook"],
    audience: ["Youth", "Adults", "Newcomers"], formats: BOTH, cert: true, photo: u("photo-1454165804606-c3d57bc86b40"),
  },
  {
    id: "career", title: "Career Development", cat: "academic", Icon: Briefcase,
    line: "Communication, leadership, teamwork, resume writing, interviews and workplace readiness.",
    focus: ["Resume building", "Interview skills", "Leadership"],
    audience: ["Youth", "Adults", "Women", "Newcomers"], formats: BOTH, cert: true, photo: u("photo-1521791136064-7986c2920216"),
  },
  {
    id: "english", title: "English Language", cat: "language", Icon: Languages,
    line: "Speaking, reading, writing and communication, particularly for newcomers and developing learners.",
    focus: ["Speaking", "Reading & writing", "Everyday communication"],
    audience: ["Adults", "Youth", "Newcomers"], formats: BOTH, cert: true, photo: u("photo-1503676260728-1c00da094a0b"),
  },
  {
    id: "french", title: "French Language", cat: "language", Icon: Languages,
    line: "Foundational and intermediate French for integration, employment and personal development.",
    focus: ["Foundational French", "Intermediate French", "Work & integration"],
    audience: ["Adults", "Youth", "Newcomers"], formats: BOTH, cert: true, photo: u("photo-1431274172761-fca41d930114"),
  },
  {
    id: "electrical", title: "Electrical Fundamentals", cat: "trades", Icon: Zap,
    line: "Electrical systems, safety, tools and industry basics.",
    focus: ["Electrical systems", "Safety", "Tools"],
    audience: ["Youth", "Adults"], formats: LIVE, cert: true, photo: u("photo-1621905251918-48416bd8575a"),
  },
  {
    id: "plumbing", title: "Plumbing Fundamentals", cat: "trades", Icon: Wrench,
    line: "Plumbing concepts, equipment, installation techniques and safety.",
    focus: ["Plumbing concepts", "Installation", "Safety"],
    audience: ["Youth", "Adults"], formats: LIVE, cert: true, photo: u("photo-1607472586893-edb57bdc0e39"),
  },
  {
    id: "welding", title: "Welding Fundamentals", cat: "trades", Icon: Flame,
    line: "Welding methods, safety standards, equipment and demonstrations.",
    focus: ["Welding methods", "Safety standards", "Demonstrations"],
    audience: ["Youth", "Adults"], formats: LIVE, cert: true, photo: u("photo-1504328345606-18bbc8c9d7d1"),
  },
  {
    id: "carpentry", title: "Carpentry Fundamentals", cat: "trades", Icon: HardHat,
    line: "Tools, construction principles, measurements and woodworking.",
    focus: ["Tools", "Measurements", "Woodworking"],
    audience: ["Youth", "Adults"], formats: LIVE, cert: true, photo: u("photo-1504148455328-c376907d081c"),
  },
  {
    id: "camps", title: "Summer Camps", cat: "community", Icon: Sun,
    line: "Active, friendly summer days full of games, learning and new friends.",
    focus: ["Outdoor activities", "Creative projects", "Teamwork"],
    audience: ["Children", "Youth"], formats: LIVE, cert: false, photo: u("photo-1478131143081-80f7f84ca84d"),
  },
  {
    id: "summer-school", title: "Summer School", cat: "community", Icon: GraduationCap,
    line: "Keep learning through the break with catch-up and enrichment classes.",
    focus: ["Core subjects", "Study skills", "Enrichment"],
    audience: ["Children", "Youth"], formats: BOTH, cert: false, photo: u("photo-1427504494785-3a9ca7044f45"),
  },
  {
    id: "family", title: "Family & Community Assistance", cat: "community", Icon: Heart,
    line: "Support, guidance and referrals for families who need a helping hand.",
    focus: ["Guidance", "Referrals", "Community support"],
    audience: ["Families", "Newcomers"], formats: LIVE, cert: false, photo: u("photo-1511895426328-dc8714191300"),
  },
  {
    id: "seniors", title: "Senior Programs", cat: "community", Icon: Users,
    line: "Social gatherings, learning and wellbeing activities for older members.",
    focus: ["Social circles", "Wellbeing", "Learning"],
    audience: ["Seniors"], formats: LIVE, cert: false, photo: u("photo-1581579438747-1dc8d17bbce4"),
  },
  {
    id: "adults", title: "Adult Programs", cat: "community", Icon: Users,
    line: "Classes and gatherings for adults who want to learn, connect and grow.",
    focus: ["Skills", "Connection", "Personal growth"],
    audience: ["Adults"], formats: BOTH, cert: false, photo: u("photo-1522202176988-66273c2fd55f"),
  },
  {
    id: "youth", title: "Youth Programs", cat: "community", Icon: Sparkles,
    line: "Mentoring, leadership and activities that help young people thrive.",
    focus: ["Mentoring", "Leadership", "Activities"],
    audience: ["Youth"], formats: LIVE, cert: false, photo: u("photo-1529156069898-49953e39b3ac"),
  },
  {
    id: "children", title: "Children's Programs", cat: "community", Icon: Baby,
    line: "Safe, playful learning for younger children, guided by caring teachers.",
    focus: ["Play-based learning", "Stories & crafts", "Early skills"],
    audience: ["Children"], formats: LIVE, cert: false, photo: u("photo-1503454537195-1dcabb73ffb9"),
  },
  {
    id: "women", title: "Women Empowerment", cat: "community", Icon: Heart,
    line: "Workshops and circles that build confidence, skills and community.",
    focus: ["Confidence", "Skills", "Peer support"],
    audience: ["Women", "Adults"], formats: BOTH, cert: false, photo: u("photo-1573496359142-b8d87734a5a2"),
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

function SelectField({
  id, label, value, onChange, children,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 px-2 py-1">
      <label htmlFor={id} className="text-xs font-medium text-oatmeal">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-palladian/15 bg-abyssal-dark/60 py-2.5 pl-3 pr-8 text-xs font-medium text-palladian outline-none transition-colors hover:border-palladian/30 focus-visible:border-burning-flame focus-visible:ring-2 focus-visible:ring-burning-flame/20 [&>option]:bg-abyssal [&>option]:text-palladian"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-oatmeal" aria-hidden="true" />
      </div>
    </div>
  );
}

function Photo({ src, Icon, tone }: { src: string; Icon: LucideIcon; tone: string }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={`relative size-full overflow-hidden bg-linear-to-br ${tone}`}>
      <Icon className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-palladian/25" aria-hidden="true" />
      {!bad && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setBad(true)}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-abyssal-dark/80 via-transparent to-abyssal-dark/10" />
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-palladian/15 bg-abyssal-dark/60 px-2.5 py-1 text-[11px] font-medium text-palladian backdrop-blur-md">
      {children}
    </span>
  );
}

function ProgramCard({ p, i, reduce }: { p: Program; i: number; reduce: boolean }) {
  const cat = CATEGORIES[p.cat];
  return (
    <motion.li
      layout={reduce ? false : "position"}
      initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.55, ease: EASE, delay: reduce ? 0 : Math.min(i, 6) * 0.05 } }}
      exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: reduce ? 0 : 0.2 } }}
      className="group flex"
    >
      <article className="flex w-full flex-col rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-3 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl transition-colors duration-300 hover:border-burning-flame/35 sm:p-4">
        <header className="flex items-start justify-between gap-3 px-1.5 pb-3 pt-1.5">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug tracking-tight text-palladian-light">{p.title}</h3>
            <p className="mt-0.5 text-xs text-oatmeal">{cat.label}</p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              p.cert
                ? "border-burning-flame/30 bg-burning-flame/10 text-burning-flame-light"
                : "border-palladian/15 bg-palladian/5 text-palladian"
            }`}
          >
            <Award className="size-3" aria-hidden="true" />
            {p.cert ? "Certificate" : "Open to all"}
          </span>
        </header>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Photo src={p.photo} Icon={p.Icon} tone={cat.tone} />
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
            {p.formats.map((f) => (
              <Pill key={f}>
                {f === "Online" ? <Monitor className="size-3" aria-hidden="true" /> : <MapPin className="size-3" aria-hidden="true" />}
                {f}
              </Pill>
            ))}
            <Pill>
              <Users className="size-3" aria-hidden="true" />
              {p.audience.slice(0, 2).join(", ")}
            </Pill>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
          <p className="text-sm leading-relaxed text-palladian/75">{p.line}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Key focus">
            {p.focus.map((f) => (
              <li key={f} className="rounded-full border border-burning-flame/25 bg-burning-flame/10 px-2.5 py-1 text-[11px] font-medium text-burning-flame-light">
                {f}
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            aria-label={`Enquire about ${p.title}`}
            className="group/cta mt-5 flex items-center justify-between gap-3 rounded-full bg-palladian/5 py-1.5 pl-5 pr-1.5 text-sm font-medium text-palladian transition-colors hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
          >
            Enquire
            <span className="grid size-8 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover/cta:rotate-45">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </a>
        </div>
      </article>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function ProgramsCatalog() {
  const reduce = !!useReducedMotion();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | CatId>("all");
  const [fmt, setFmt] = useState<"all" | Format>("all");
  const [aud, setAud] = useState<"all" | Audience>("all");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PROGRAMS.filter(
      (p) =>
        (cat === "all" || p.cat === cat) &&
        (fmt === "all" || p.formats.includes(fmt)) &&
        (aud === "all" || p.audience.includes(aud)) &&
        (!s || [p.title, p.line, ...p.focus, CATEGORIES[p.cat].label].join(" ").toLowerCase().includes(s)),
    );
  }, [q, cat, fmt, aud]);

  const displayedPrograms = expanded ? filtered : filtered.slice(0, 6);
  const dirty = q !== "" || cat !== "all" || fmt !== "all" || aud !== "all";
  const clear = () => { setQ(""); setCat("all"); setFmt("all"); setAud("all"); setExpanded(false); };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <section
      id="programs-list"
      aria-labelledby="catalog-heading"
      className="relative isolate py-20 text-palladian sm:py-24 lg:py-28"
    >
      <div className="absolute -right-48 -top-24 size-[40rem] rounded-full bg-blue-fantastic-light/30 blur-[130px]" />
        <div className="absolute -bottom-32 -left-40 size-[42rem] rounded-full bg-truffle/25 blur-[130px]" />
        <span
          className="absolute -top-4 right-4 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent lg:block"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          Courses
        </span>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {/* Heading */}
          <motion.div variants={rise} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
                <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
                {PROGRAMS.length} programs
              </div>
              <h2 id="catalog-heading" className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl">
                Pick your program
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-palladian/75 sm:text-base">
              From first steps in AI to trades, languages and family support. Filter by what you
              need, and we will point you to the right class.
            </p>
          </motion.div>

          {/* Filter bar */}
          <motion.form
            variants={rise}
            role="search"
            aria-label="Filter programs"
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 grid grid-cols-1 gap-3 rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] p-4 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl sm:grid-cols-2 sm:p-5 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-2"
          >
            <div className="flex min-w-0 flex-col gap-1.5 px-2 py-1">
              <label htmlFor="catalog-search" className="text-xs font-medium text-oatmeal">Program</label>
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3 size-3.5 text-oatmeal" aria-hidden="true" />
                <input
                  id="catalog-search"
                  type="search"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setExpanded(true); }}
                  placeholder="Find a program..."
                  autoComplete="off"
                  className="w-full rounded-xl border border-palladian/15 bg-abyssal-dark/60 py-2.5 pl-9 pr-3 text-xs font-medium text-palladian outline-none transition-colors placeholder:text-oatmeal/60 hover:border-palladian/30 focus-visible:border-burning-flame focus-visible:ring-2 focus-visible:ring-burning-flame/20"
                />
              </div>
            </div>

            <SelectField id="catalog-cat" label="Category" value={cat} onChange={(v) => { setCat(v as typeof cat); setExpanded(true); }}>
              <option value="all">All categories</option>
              {(Object.keys(CATEGORIES) as CatId[]).map((k) => (
                <option key={k} value={k}>{CATEGORIES[k].label}</option>
              ))}
            </SelectField>

            <SelectField id="catalog-format" label="Format" value={fmt} onChange={(v) => { setFmt(v as typeof fmt); setExpanded(true); }}>
              <option value="all">Online or in person</option>
              <option value="Online">Online</option>
              <option value="In person">In person</option>
            </SelectField>

            <SelectField id="catalog-aud" label="Who is it for" value={aud} onChange={(v) => { setAud(v as typeof aud); setExpanded(true); }}>
              <option value="all">Everyone</option>
              {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
            </SelectField>

            <div className="px-2 py-1 flex items-end sm:col-span-2 lg:col-span-1">
              <button
                type="button"
                onClick={clear}
                disabled={!dirty}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-burning-flame px-4 py-2.5 text-xs font-semibold text-abyssal shadow-lg shadow-burning-flame/15 transition-all duration-300 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame disabled:cursor-not-allowed disabled:bg-palladian/10 disabled:text-oatmeal disabled:shadow-none"
              >
                <X className="size-3.5" aria-hidden="true" />
                Clear
              </button>
            </div>
          </motion.form>

          <motion.p variants={rise} aria-live="polite" className="mt-5 px-1 text-xs text-oatmeal">
            Showing {displayedPrograms.length} of {filtered.length} programs
          </motion.p>

          {/* Results Grid */}
          <div className="mt-5">
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial>
                {displayedPrograms.map((p, i) => (
                  <ProgramCard key={p.id} p={p} i={i} reduce={reduce} />
                ))}
              </AnimatePresence>
            </ul>

            {/* See More / Show Fewer Button */}
            {filtered.length > 6 && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="group inline-flex items-center gap-3 rounded-full border border-burning-flame/30 bg-burning-flame/10 px-8 py-3.5 text-sm font-semibold text-burning-flame-light shadow-lg shadow-burning-flame/10 transition-all duration-300 hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  {expanded ? "Show fewer programs" : `See more programs (${filtered.length - 6} more)`}
                  <ArrowDown className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : "group-hover:translate-y-0.5"}`} aria-hidden="true" />
                </button>
              </div>
            )}

            <AnimatePresence>
              {filtered.length === 0 && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-palladian/[0.12] bg-palladian/5 px-6 py-12 text-center backdrop-blur-xl"
                >
                  <span className="grid size-14 place-items-center rounded-full border border-burning-flame/25 bg-burning-flame/15 text-burning-flame">
                    <SearchX className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-palladian-light">No programs match</h3>
                  <p className="mt-2 text-sm text-palladian/75">Try a different word or clear your filters above.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={clear} className="rounded-full bg-burning-flame px-5 py-2.5 text-sm font-semibold text-abyssal transition-colors hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light">
                      Clear filters
                    </button>
                    <a href="#contact" className="rounded-full border border-palladian/15 bg-palladian/5 px-5 py-2.5 text-sm font-medium text-palladian transition-colors hover:border-burning-flame/50 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame">
                      Ask an advisor
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}