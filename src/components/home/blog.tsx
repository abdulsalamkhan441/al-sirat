"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content — titles, counts and dates are placeholders                       */
/* -------------------------------------------------------------------------- */

export const CATEGORIES = [
  {
    title: "Community",
    description:
      "News, events and stories from the people who make our center feel like home.",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200",
    href: "/blog/category/community",
    count: 24,
    article: {
      date: "Sep 28, 2026",
      read: "6 min read",
      title: "How our neighbourhood iftar brought 300 people to one table",
      href: "/blog/neighbourhood-iftar",
    },
  },
  {
    title: "Learning",
    description:
      "Class highlights, study guides and practical tips for students and parents of every age.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    href: "/blog/category/learning",
    count: 18,
    article: {
      date: "Sep 21, 2026",
      read: "5 min read",
      title: "Five ways to help your child build a daily Quran habit",
      href: "/blog/daily-quran-habit",
    },
  },
  {
    title: "Faith & Life",
    description:
      "Reflections on prayer, family and living with purpose, one week at a time.",
    image:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200",
    href: "/blog/category/faith-and-life",
    count: 31,
    article: {
      date: "Sep 12, 2026",
      read: "4 min read",
      title: "Finding calm in a busy week: small rituals that make a difference",
      href: "/blog/finding-calm",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Card shape: a circular bite out of the top-right corner for the arrow.    */
/*  Centre sits 26px in from the corner; the 44px arrow floats inside it.     */
/* -------------------------------------------------------------------------- */

const NOTCH =
  "radial-gradient(circle 40px at calc(100% - 26px) 26px, transparent 39px, #000 40.5px)";

const SPOTLIGHT =
  "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--color-burning-flame) 24%, transparent), transparent 70%)";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function BlogSection() {
  const reduce = useReducedMotion();
  // Card and article share one hover state, so each lights up the other
  const [active, setActive] = useState<number | null>(null);

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

  const spot = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      aria-labelledby="blog-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-abyssal-dark py-20 text-palladian sm:py-24 lg:py-28"
    >
      {/* ---------- Background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 size-full text-palladian opacity-[0.05]"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 60% at 70% 25%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 70% 25%, black, transparent 75%)",
          }}
        >
          <defs>
            <pattern
              id="blog-star-lattice"
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
          <rect width="100%" height="100%" fill="url(#blog-star-lattice)" />
        </svg>
        <div className="absolute -right-32 -top-20 size-[30rem] rounded-full bg-blue-fantastic-light/20 blur-3xl" />
        <div className="absolute -left-40 bottom-0 size-[32rem] rounded-full bg-burning-flame/10 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* ---------- Header ---------- */}
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          {/* outlined watermark */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 right-0 select-none text-[clamp(5rem,15vw,12rem)] font-bold leading-none text-transparent opacity-[0.14] [-webkit-text-stroke:1px_var(--color-palladian)]"
          >
            Stories
          </span>

          <div className="relative">
            <motion.h2
              id="blog-heading"
              variants={rise}
              className="text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
            >
              Article categories
            </motion.h2>
            <motion.p
              variants={rise}
              className="mt-4 max-w-md text-sm leading-relaxed text-palladian/70 sm:text-base"
            >
              Stories, lessons and reflections from the people who make this
              place feel like home.
            </motion.p>
          </div>

          <motion.div variants={rise} className="relative">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-palladian/20 bg-palladian/5 px-5 py-2.5 text-sm font-medium text-palladian backdrop-blur-md transition-colors duration-300 hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal"
            >
              Browse all articles
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>

        {/* ---------- Category cards ---------- */}
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.li
              key={cat.title}
              variants={rise}
              data-active={active === i}
              className="group/card"
            >
              <Link
                href={cat.href}
                onPointerMove={spot}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group/link block focus-visible:outline-none"
              >
                <div className="relative rounded-[1.75rem] shadow-2xl shadow-abyssal-dark/60 transition-all duration-500 group-focus-visible/link:ring-2 group-focus-visible/link:ring-burning-flame group-focus-visible/link:ring-offset-2 group-focus-visible/link:ring-offset-abyssal group-data-[active=true]/card:-translate-y-1.5 group-data-[active=true]/card:shadow-burning-flame/20 motion-reduce:transition-none motion-reduce:group-data-[active=true]/card:translate-y-0">
                  {/* Masked surface (the bite lives here) */}
                  <div
                    style={{ maskImage: NOTCH, WebkitMaskImage: NOTCH }}
                    className="relative h-[26rem] overflow-hidden rounded-[1.75rem] bg-blue-fantastic sm:h-[30rem]"
                  >
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-data-[active=true]/card:scale-105 motion-reduce:transition-none motion-reduce:group-data-[active=true]/card:scale-100"
                    />
                    {/* palette tint: unifies the photos, lifts on hover */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-blue-fantastic/45 mix-blend-multiply transition-opacity duration-500 group-data-[active=true]/card:opacity-0"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-linear-to-t from-abyssal-dark via-abyssal-dark/45 to-abyssal-dark/5"
                    />
                    {/* cursor spotlight */}
                    <div
                      aria-hidden="true"
                      style={{ background: SPOTLIGHT }}
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-data-[active=true]/card:opacity-100"
                    />

                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-palladian/20 bg-abyssal-dark/50 px-3 py-1.5 text-xs font-medium text-palladian backdrop-blur-md">
                      <BookOpen className="size-3.5 text-burning-flame" aria-hidden="true" />
                      {cat.count} stories
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="text-3xl font-semibold tracking-tight text-palladian-light">
                        {cat.title}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="mt-3 block h-0.5 w-10 rounded-full bg-burning-flame transition-all duration-500 group-data-[active=true]/card:w-24"
                      />
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-palladian/80">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Arrow sits inside the bite */}
                  <span
                    aria-hidden="true"
                    className="absolute right-1 top-1 grid size-11 place-items-center rounded-full border border-palladian/20 bg-palladian/10 text-palladian backdrop-blur-md transition-colors duration-300 group-data-[active=true]/card:border-burning-flame group-data-[active=true]/card:bg-burning-flame group-data-[active=true]/card:text-abyssal"
                  >
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-data-[active=true]/card:rotate-45 motion-reduce:transition-none" />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* ---------- Popular now ---------- */}
        <motion.div variants={rise} className="mt-16 lg:mt-20">
          <div className="flex items-center gap-4">
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-burning-flame/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2.5 rounded-full bg-burning-flame" />
            </span>
            <h3 className="text-sm font-semibold text-palladian">Popular now</h3>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-linear-to-r from-palladian/20 to-transparent"
            />
          </div>

          <ul className="mt-4 grid divide-y divide-palladian/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {CATEGORIES.map((cat, i) => (
              <li
                key={cat.article.title}
                data-active={active === i}
                className="group/post relative"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 hidden h-px w-full origin-left scale-x-0 bg-burning-flame transition-transform duration-500 group-data-[active=true]/post:scale-x-100 md:block"
                />
                <Link
                  href={cat.article.href}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="flex h-full flex-col gap-3 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame md:px-8 md:first:pl-0 md:last:pr-0"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-oatmeal">
                    <span className="rounded-full border border-burning-flame/25 bg-burning-flame/15 px-2.5 py-0.5 font-medium text-burning-flame-light">
                      {cat.title}
                    </span>
                    <span>{cat.article.date}</span>
                    <span>{cat.article.read}</span>
                  </div>

                  <h4 className="text-lg font-semibold leading-snug text-palladian-light transition-colors duration-300 group-data-[active=true]/post:text-burning-flame">
                    {cat.article.title}
                  </h4>

                  <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-medium text-oatmeal transition-colors duration-300 group-data-[active=true]/post:text-burning-flame">
                    Read article
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-data-[active=true]/post:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}