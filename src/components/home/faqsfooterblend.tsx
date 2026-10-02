"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// Placeholder content: swap for your real answers
const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Who can join the community center?",
    answer:
      "Everyone. Families, students, newcomers and elders are all welcome, whatever your background or how long you have lived in the neighbourhood.",
  },
  {
    id: 2,
    question: "How do I register for a class?",
    answer:
      "You can register online in a few minutes, or stop by the front desk and a volunteer will help you choose a class and a time that suits your family.\n\nMost weekend classes for children start each term, and we keep a short waiting list if a class fills up. We will call you as soon as a spot opens.\n\nNew to the center? Come for a visit first. We are happy to show you around before you decide.",
  },
  {
    id: 3,
    question: "Is there a cost to take part?",
    answer:
      "Community programs and events are free or low cost. If a fee is ever a barrier for your family, speak to us in confidence and we will find a way to include you.",
  },
  {
    id: 4,
    question: "Can I volunteer, and how much time do I need?",
    answer:
      "Yes, and any amount of time helps. Many of our volunteers start with a single weekend and stay for years. We will match you with a role that fits your skills and schedule.",
  },
  {
    id: 5,
    question: "How are donations used?",
    answer:
      "Every donation goes toward programs, food drives, classroom supplies and keeping the center open and welcoming. We share a yearly summary so you can see exactly where it went.",
  },
];

export default function FAQSection() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<number | null>(2);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = FAQS.length - 1;
    const next =
      e.key === "ArrowDown" ? (i + 1) % FAQS.length :
      e.key === "ArrowUp" ? (i - 1 + FAQS.length) % FAQS.length :
      e.key === "Home" ? 0 :
      e.key === "End" ? last : -1;
    if (next < 0) return;
    e.preventDefault();
    btns.current[next]?.focus();
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative px-4 pb-10 pt-20 text-palladian sm:px-6 sm:pt-24 lg:px-8 lg:pt-28"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-3xl"
      >
        {/* Header */}
        <motion.div variants={rise} className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md">
            <Sparkles className="size-4 text-burning-flame" aria-hidden="true" />
            FAQs
          </div>
          <h2
            id="faq-heading"
            className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-palladian-light sm:text-5xl"
          >
            Common questions
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-palladian/75 sm:text-base">
            Quick answers about joining, classes and giving back. Cannot find yours? Ask us.
          </p>
        </motion.div>

        {/* List */}
        <ul className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const open = openId === item.id;
            const bid = `faq-btn-${item.id}`;
            const pid = `faq-panel-${item.id}`;
            return (
              <motion.li
                key={item.id}
                variants={rise}
                className={`relative overflow-hidden rounded-3xl border bg-linear-to-br backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-500 ${
                  open
                    ? "border-burning-flame/40 from-palladian/[0.13] to-palladian/[0.03] shadow-2xl shadow-burning-flame/10 ring-1 ring-burning-flame/20"
                    : "border-palladian/[0.1] from-palladian/[0.07] to-palladian/[0.02] shadow-xl shadow-abyssal-dark/40 hover:border-palladian/25"
                }`}
              >
                <h3>
                  <button
                    ref={(el) => { btns.current[i] = el; }}
                    id={bid}
                    type="button"
                    aria-expanded={open}
                    aria-controls={pid}
                    onClick={() => setOpenId(open ? null : item.id)}
                    onKeyDown={(e) => onKey(e, i)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-burning-flame sm:p-5"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-medium tabular-nums transition-colors duration-300 ${
                          open
                            ? "border-burning-flame/40 bg-burning-flame/15 text-burning-flame"
                            : "border-palladian/10 bg-palladian/5 text-oatmeal"
                        }`}
                        aria-hidden="true"
                      >
                        {item.id}
                      </span>
                      <span className="text-[15px] font-semibold leading-snug text-palladian-light sm:text-base">
                        {item.question}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                        open
                          ? "border border-palladian/20 bg-palladian/10 text-palladian"
                          : "bg-burning-flame text-abyssal"
                      }`}
                    >
                      <motion.span
                        animate={{ rotate: open ? 135 : 0 }}
                        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                        className="flex"
                      >
                        <Plus className="size-4" />
                      </motion.span>
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={pid}
                      role="region"
                      aria-labelledby={bid}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 px-5 pb-6 pt-0 text-sm leading-relaxed text-palladian/75 sm:pl-[4.25rem] sm:pr-16">
                        {item.answer.split("\n\n").map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>

        {/* Contact prompt */}
        <motion.div variants={rise} className="mt-12 flex flex-col items-center text-center">
          <p className="text-sm text-oatmeal">Have any other questions?</p>
          <Link
            href="/contact"
            className="group mt-2 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-palladian-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
          >
            <span className="border-b border-burning-flame/60 pb-0.5 transition-colors group-hover:border-burning-flame group-hover:text-burning-flame">
              Contact us
            </span>
            <span className="grid size-6 place-items-center rounded-full bg-burning-flame text-abyssal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}