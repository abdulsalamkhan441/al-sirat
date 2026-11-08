"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Check, Compass } from "lucide-react";

import { CATEGORIES, type Category, type CategoryId } from "./contactdata";
import { Backdrop, EASE, GLASS, Label } from "./contactshared";

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

function CategoryCard({
  cat,
  index,
  selected,
  onSelect,
  reduce,
}: {
  cat: Category;
  index: number;
  selected: boolean;
  onSelect: (id: CategoryId) => void;
  reduce: boolean;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spot = useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, rgba(255,177,98,0.16), transparent 70%)`;
  const Icon = cat.Icon;

  function onMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(cat.id)}
      onPointerMove={onMove}
      className={`${GLASS} group flex h-full w-full flex-col p-6 text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        selected ? "ring-1 ring-burning-flame" : ""
      }`}
    >
      {/* cursor spotlight */}
      <motion.span
        aria-hidden="true"
        style={{ background: spot }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span className="relative flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-burning-flame/15 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <span
          aria-hidden="true"
          className="select-none text-4xl font-semibold leading-none tracking-tight text-transparent"
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.18)" }}
        >
          0{index + 1}
        </span>
      </span>

      <span className="relative mt-6 block text-xl font-semibold leading-tight tracking-tight text-palladian-light">
        {cat.label}
      </span>
      <span className="relative mt-2 block text-sm leading-relaxed text-palladian/70">{cat.text}</span>

      <span className="relative mt-auto flex items-center justify-between gap-3 pt-6 text-sm font-medium text-burning-flame-light">
        {selected ? "Selected, continue below" : "Start this inquiry"}
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-burning-flame/30 text-burning-flame transition-colors duration-300 group-hover:bg-burning-flame group-hover:text-abyssal">
          {selected ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          )}
        </span>
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section 2: Inquiry categories                                             */
/* -------------------------------------------------------------------------- */

export default function InquiryCategories({
  selected,
  onSelect,
}: {
  selected: CategoryId | "";
  onSelect: (id: CategoryId) => void;
}) {
  const reduce = !!useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 30 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <section
      id="inquiries"
      aria-labelledby="inquiries-heading"
      className="relative isolate scroll-mt-20 py-16 text-palladian sm:py-20 lg:py-24"
    >
      <Backdrop ghost="Topics" flip />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="max-w-2xl">
            <motion.div variants={rise}>
              <Label Icon={Compass}>Inquiry categories</Label>
            </motion.div>
            <motion.h2
              id="inquiries-heading"
              variants={rise}
              className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-palladian-light sm:text-5xl lg:text-6xl"
            >
              What can we <span className="text-burning-flame">help with?</span>
            </motion.h2>
            <motion.p variants={rise} className="mt-5 max-w-lg text-sm leading-relaxed text-palladian/80 sm:text-base">
              Choose the topic closest to your question. We&apos;ll start your message for you.
            </motion.p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {CATEGORIES.map((cat, k) => (
              <motion.li key={cat.id} variants={rise} className="min-w-0">
                <CategoryCard
                  cat={cat}
                  index={k}
                  selected={selected === cat.id}
                  onSelect={onSelect}
                  reduce={reduce}
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}