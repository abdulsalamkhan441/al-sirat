"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  HeartHandshake,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/*  Descriptions and tags are placeholders: edit to match your real programs. */
/* -------------------------------------------------------------------------- */

type Service = {
  title: string;
  href: string;
  image: string;
  Icon: LucideIcon;
  text: string;
  tag: string;
};

export const SERVICES: Service[] = [
  {
    title: "Prayer Times",
    href: "/services/prayer-times",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200",
    Icon: Clock,
    text: "Daily prayers, Jumu'ah and Eid gatherings, open to everyone who walks in.",
    tag: "Open daily",
  },
  {
    title: "Islamic Education",
    href: "/services/education",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200",
    Icon: BookOpen,
    text: "Quran, Arabic and Islamic studies for children, teens and adults.",
    tag: "All ages",
  },
  {
    title: "Community Support",
    href: "/services/community-support",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200",
    Icon: HeartHandshake,
    text: "Food drives, guidance and neighbour-to-neighbour help when it matters most.",
    tag: "Open to everyone",
  },
  {
    title: "Youth & Family",
    href: "/services/youth-family",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200",
    Icon: Users,
    text: "Youth clubs, family evenings and events that bring generations together.",
    tag: "Every week",
  },
];

/* -------------------------------------------------------------------------- */
/*  Nested pointed arches behind the heading                                  */
/* -------------------------------------------------------------------------- */

const ARCHES = [
  [260, 300],
  [400, 380],
  [540, 450],
  [680, 510],
].map(([w, h]) => {
  const cx = 500;
  const b = 520;
  const l = cx - w / 2;
  const r = cx + w / 2;
  return `M${l} ${b}V${b - h * 0.55}C${l} ${b - h * 0.85} ${cx - w * 0.12} ${b - h * 0.92} ${cx} ${b - h}C${cx + w * 0.12} ${b - h * 0.92} ${r} ${b - h * 0.85} ${r} ${b - h * 0.55}V${b}`;
});

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ServicesSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.05,
      },
    },
  };

  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 36 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.8, ease: EASE },
    },
  };

  return (
    <section
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-abyssal-dark py-20 text-palladian sm:py-24 lg:py-28"
    >
      {/* ---------- Background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.06]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 80%, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 80%, black, transparent 78%)",
          }}
        >
          <defs>
            <pattern
              id="services-star-lattice"
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
          <rect width="100%" height="100%" fill="url(#services-star-lattice)" />
        </svg>

        {/* Arches rising behind the heading */}
        <svg
          viewBox="0 0 1000 520"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="absolute left-1/2 top-6 w-[1000px] max-w-none -translate-x-1/2 text-palladian opacity-[0.09]"
        >
          {ARCHES.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>

        <div className="absolute -left-32 top-1/3 size-[30rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-64 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-burning-flame/10 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* ---------- Header ---------- */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
          >
            <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
            Our services
          </motion.div>

          <motion.h2
            id="services-heading"
            variants={rise}
            className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
          >
            Everything you need, under one roof
          </motion.h2>

          <motion.p
            variants={rise}
            className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/75 sm:text-base"
          >
            From daily prayer to classes and family support, there is a place
            for you in every season of life.
          </motion.p>
        </div>

        {/* ---------- Arch panels ---------- */}
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:flex lg:h-[34rem]">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.title}
              variants={rise}
              data-active={active === i}
              className="group/panel [container-type:inline-size] lg:min-w-0 lg:basis-0 lg:grow-[1] lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] lg:data-[active=true]:grow-[2.6] motion-reduce:transition-none"
            >
              <Link
                href={s.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                // top radius = half the panel's own width -> a true arch at any size
                style={{
                  borderTopLeftRadius: "50cqw",
                  borderTopRightRadius: "50cqw",
                }}
                className="relative block h-[27rem] w-full overflow-hidden rounded-b-[2rem] bg-blue-fantastic shadow-2xl shadow-abyssal-dark/60 transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark lg:h-full lg:group-data-[active=true]/panel:shadow-burning-flame/20"
              >
                {/* Photo: muted until its panel is open */}
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-all duration-700 motion-reduce:transition-none lg:scale-110 lg:brightness-75 lg:grayscale-[35%] lg:group-data-[active=true]/panel:scale-100 lg:group-data-[active=true]/panel:brightness-100 lg:group-data-[active=true]/panel:grayscale-0"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-abyssal-dark via-abyssal-dark/35 to-transparent"
                />

                {/* Inner arch frame */}
                <div
                  aria-hidden="true"
                  style={{
                    borderTopLeftRadius: "calc(50cqw - 0.625rem)",
                    borderTopRightRadius: "calc(50cqw - 0.625rem)",
                  }}
                  className="pointer-events-none absolute inset-2.5 rounded-b-[1.4rem] border border-palladian/25 transition-colors duration-500 lg:group-data-[active=true]/panel:border-burning-flame/70"
                />

                {/* Icon at the crown of the arch */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-7 grid size-11 -translate-x-1/2 place-items-center rounded-full bg-burning-flame text-abyssal shadow-lg shadow-abyssal-dark/40 transition-transform duration-500 group-hover/panel:scale-110 motion-reduce:transition-none"
                >
                  <s.Icon className="size-5" />
                </span>

                {/* Title + reveal */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="text-lg font-semibold leading-tight text-palladian-light sm:text-xl">
                    {s.title}
                  </h3>

                  <div className="grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none lg:grid-rows-[0fr] lg:opacity-0 lg:group-data-[active=true]/panel:grid-rows-[1fr] lg:group-data-[active=true]/panel:opacity-100">
                    <div className="overflow-hidden">
                      <p className="mt-2 max-w-sm pr-12 text-sm leading-relaxed text-palladian/80">
                        {s.text}
                      </p>
                      <span className="mt-3 inline-flex items-center rounded-full border border-palladian/15 bg-abyssal-dark/60 px-3 py-1 text-xs font-medium text-burning-flame backdrop-blur-md">
                        {s.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 grid size-10 place-items-center rounded-full border border-palladian/20 bg-abyssal-dark/50 text-palladian backdrop-blur-md transition-all duration-300 group-hover/panel:bg-burning-flame group-hover/panel:text-abyssal sm:bottom-6 sm:right-6 lg:opacity-0 lg:group-data-[active=true]/panel:bg-burning-flame lg:group-data-[active=true]/panel:text-abyssal lg:group-data-[active=true]/panel:opacity-100"
                >
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/panel:-translate-y-0.5 group-hover/panel:translate-x-0.5" />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* ---------- CTA ---------- */}
        <motion.div
          variants={rise}
          className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8"
        >
          <Link
            href="/services"
            className="group inline-flex items-center gap-4 rounded-full bg-burning-flame py-1.5 pl-6 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
          >
            View All Services
            <span className="grid size-10 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>

          <p className="text-sm text-oatmeal">
            Not sure where to start?{" "}
            <Link
              href="/contact"
              className="font-semibold text-palladian underline decoration-burning-flame/60 underline-offset-4 transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
            >
              Talk to our team
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}