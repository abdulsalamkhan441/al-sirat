"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarCheck,
  ClipboardList,
  Mail,
  Sparkles,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { fmtShort, type EventItem } from "./events";
import { EASE, GLASS, THEMES, type ThemeId } from "./shared";

type Props = {
  /** Upcoming events, soonest first. */
  events: EventItem[];
  /** Filter the Upcoming list by one of the four themes and scroll to it. */
  onExplore: (t: ThemeId) => void;
  /** Clear filters and scroll to the Upcoming list. */
  onBrowseAll: () => void;
};

const CONTACT_EMAIL = "hello@alsirat.example"; // placeholder, same as the booking modal

const STEPS: { title: string; text: string; Icon: LucideIcon }[] = [
  {
    title: "Choose an event",
    text: "Browse by group or by what you want to do, then pick the one that suits you.",
    Icon: CalendarCheck,
  },
  {
    title: "Tell us who is coming",
    text: "Add adults, children and any access needs. It takes about a minute.",
    Icon: ClipboardList,
  },
  {
    title: "Get confirmed",
    text: "Free events confirm straight away. Paid ones can be settled online, at the door or by e-Transfer.",
    Icon: Ticket,
  },
];

export default function ParticipationSection({ events, onExplore, onBrowseAll }: Props) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.8, ease: EASE } },
  };

  return (
    <section aria-labelledby="participation-heading" className="relative py-20 text-palladian sm:py-24 lg:py-28">
      <style>{`
        @keyframes pr-word {
          0%, 20% { color: var(--color-burning-flame); }
          28%, 100% { color: var(--color-palladian-light); }
        }
      `}</style>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* ---------- Header ---------- */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
          >
            <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
            Participation and registration
          </motion.div>

          <motion.h2
            id="participation-heading"
            variants={rise}
            className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl"
          >
            {THEMES.map((t, i) => (
              <span key={t.id}>
                <span
                  className="motion-reduce:animate-none!"
                  style={{ animation: `pr-word 12s linear ${i * 3}s infinite` }}
                >
                  {t.label}
                </span>
                {i < THEMES.length - 1 ? ". " : "."}
              </span>
            ))}
          </motion.h2>

          <motion.p variants={rise} className="mt-5 max-w-xl text-sm leading-relaxed text-palladian/75 sm:text-base">
            Every event is a chance to take part, pick up something new, meet
            your neighbours and build the community together. Choose a way in.
          </motion.p>
        </div>

        {/* ---------- Four ways in ---------- */}
        <motion.ul variants={rise} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THEMES.map((t) => {
            const matching = events.filter(t.match);
            const next = matching[0];
            return (
              <li key={t.id} className="group/tile">
                <div
                  className={`${GLASS} flex h-full flex-col p-6 transition-all duration-300 group-hover/tile:-translate-y-1 group-hover/tile:border-burning-flame/40 motion-reduce:group-hover/tile:translate-y-0`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-12 place-items-center rounded-2xl border border-burning-flame/25 bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover/tile:bg-burning-flame group-hover/tile:text-abyssal">
                      <t.Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-palladian/15 bg-palladian/[0.07] px-3 py-1 text-xs font-medium tabular-nums text-palladian">
                      {matching.length} upcoming
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-palladian-light">{t.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-palladian/70">{t.text}</p>

                  <div className="mt-5 rounded-2xl border border-palladian/10 bg-abyssal-dark/40 p-3.5">
                    <p className="text-[11px] text-oatmeal">Next up</p>
                    {next ? (
                      <>
                        <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-palladian-light">{next.title}</p>
                        <p className="mt-1 text-xs text-burning-flame-light">{fmtShort(next.date)}</p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-palladian/70">New dates coming soon.</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onExplore(t.id)}
                    disabled={matching.length === 0}
                    className="group/btn mt-6 inline-flex items-center gap-2 self-start rounded-full border border-burning-flame/50 bg-burning-flame/10 px-5 py-2.5 text-sm font-semibold text-burning-flame-light transition-all duration-300 hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark disabled:pointer-events-none disabled:opacity-40 lg:mt-auto"
                  >
                    See {t.label.toLowerCase()} events
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </motion.ul>

        {/* ---------- How registration works ---------- */}
        <motion.div variants={rise} className={`${GLASS} mt-6 overflow-hidden p-6 sm:p-8 lg:p-10`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-burning-flame">How it works</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-palladian-light sm:text-3xl">
                Registering takes a minute
              </h3>
            </div>
            <button
              type="button"
              onClick={onBrowseAll}
              className="group/btn inline-flex w-fit items-center gap-3 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal motion-reduce:hover:translate-y-0"
            >
              Browse upcoming events
              <span className="grid size-10 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover/btn:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </button>
          </div>

          <ol className="relative mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {/* connecting line */}
            <span
              aria-hidden="true"
              className="absolute left-[3.25rem] right-[3.25rem] top-6 hidden h-px bg-linear-to-r from-burning-flame/50 via-palladian/20 to-burning-flame/50 md:block"
            />
            {STEPS.map(({ title, text, Icon }, i) => (
              <li key={title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-burning-flame/40 bg-abyssal text-burning-flame shadow-lg shadow-abyssal-dark/50">
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-burning-flame text-[10px] font-bold text-abyssal">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <h4 className="text-base font-semibold text-palladian-light">{title}</h4>
                  <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-palladian/70">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-3 border-t border-palladian/10 pt-6 sm:grid-cols-2">
            <p className="flex items-start gap-3 text-sm text-palladian/75">
              <Bell className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />
              Event full? Join the waitlist and we will email you if a spot opens.
            </p>
            <p className="flex items-start gap-3 text-sm text-palladian/75">
              <Mail className="mt-0.5 size-4 shrink-0 text-burning-flame" aria-hidden="true" />
              <span>
                Need help or have access needs? Email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-palladian underline decoration-burning-flame/60 underline-offset-4 transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}