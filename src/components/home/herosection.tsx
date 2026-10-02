"use client";

import { useEffect, useRef, useState } from "react";
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
import { Sprout, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import AnnouncementBar from "./announcemnetbar";
import Navbar from "../common/navbar";


/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

// Add more images here and the slide dots + autoplay switch on automatically.
const SLIDES = [
  {
    src: "/3.jpg",
    alt: "Volunteers from the Al Sirat Community Center smiling together outdoors",
  },
  // { src: "/images/hero-bg-2.jpg", alt: "..." },
  // { src: "/images/hero-bg-3.jpg", alt: "..." },
];

const AVATARS = [
  {
    src: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&crop=faces&auto=format&q=80",
    alt: "Community member",
  },
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&crop=faces&auto=format&q=80",
    alt: "Community member",
  },
  {
    src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&crop=faces&auto=format&q=80",
    alt: "Community member",
  },
];



const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebook },
  { label: "Twitter", href: "https://twitter.com", Icon: FaTwitter },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedin },
];


const SLIDE_INTERVAL = 6500;

/* -------------------------------------------------------------------------- */
/*  Count-up                                                                  */
/* -------------------------------------------------------------------------- */

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
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
      duration: 2,
      ease: "easeOut",
      delay: 0.6,
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
        {value.toFixed(1)}
        {suffix}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

export default function HeroSection() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasSlides = SLIDES.length > 1;

  // Autoplay (pauses on hover/focus, off for reduced motion)
  useEffect(() => {
    if (!hasSlides || paused || reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_INTERVAL,
    );
    return () => clearInterval(id);
  }, [hasSlides, paused, reduce]);

  // One orchestrated entrance for the copy block
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.12,
        delayChildren: reduce ? 0 : 0.25,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

return (
    <>
      <AnnouncementBar />
      <Navbar />
 
      <section
        aria-labelledby="hero-heading"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative isolate flex min-h-[calc(100svh-2.5rem)] w-full flex-col overflow-hidden bg-abyssal text-palladian"
      >
        {/* ---------- Background slides + overlays ---------- */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 1.4, ease: "easeOut" }}
            >
              <Image
                src={SLIDES[index].src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-[72%_center] lg:object-center"
              />
            </motion.div>
          </AnimatePresence>
 
          {/* Left-to-right reading gradient, stronger on small screens */}
          <div className="absolute inset-0 bg-abyssal-dark/50 lg:bg-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-abyssal-dark/90 via-abyssal/55 to-transparent" />
          {/* Top + bottom fades so the nav and brush edge sit cleanly */}
          <div className="absolute inset-0 bg-linear-to-t from-abyssal-dark/70 via-transparent to-abyssal-dark/60" />
        </div>
 
        {/* Screen-reader description of the current slide */}
        <p className="sr-only">{SLIDES[index].alt}</p>
 
        {/* ---------- Copy ---------- */}
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 items-center px-4 pb-28 pt-32 sm:px-6 lg:px-8 lg:pb-32 lg:pt-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-palladian/15 bg-abyssal-dark/50 px-4 py-2 text-[13px] font-medium text-palladian backdrop-blur-md"
            >
              <Sprout className="size-4 text-burning-flame" aria-hidden="true" />
              Serving The Community with Heart
            </motion.div>
 
            <motion.h1
              id="hero-heading"
              variants={item}
              className="mt-6 text-[2.5rem] font-bold leading-[1.08] tracking-tight text-palladian-light sm:text-6xl xl:text-7xl"
            >
              Shape the World with{" "}
              <span className="block text-burning-flame">Heart&apos;s Concept</span>
            </motion.h1>
 
            <motion.p
              variants={item}
              className="mt-5 max-w-md text-base leading-relaxed text-palladian/80 sm:text-lg"
            >
              We work to foster unity, spiritual growth, and education across
              our local community center.
            </motion.p>
 
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5"
            >
              <Link
                href="/join"
                className="group inline-flex items-center gap-4 rounded-full border border-palladian/15 bg-abyssal-dark/60 py-2 pl-6 pr-2 text-sm font-semibold text-palladian shadow-xl shadow-abyssal-dark/30 backdrop-blur-md transition-all duration-300 hover:border-burning-flame/50 hover:bg-abyssal-dark/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark"
              >
                Join Us Today
                <span className="grid size-10 place-items-center rounded-full bg-burning-flame text-abyssal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:translate-x-0">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
 
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {AVATARS.map((a, i) => (
                    <Image
                      key={i}
                      src={a.src}
                      alt={a.alt}
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover ring-2 ring-abyssal-dark transition-transform duration-300 hover:z-10 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <span className="block text-lg font-bold text-palladian">
                    <CountUp to={122.6} suffix="k+" />
                  </span>
                  <span className="text-xs font-medium text-oatmeal">
                    Team Members
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
 
        {/* ---------- Social rail ---------- */}
        <motion.aside
          aria-label="Social links"
          initial={{ opacity: 0, x: reduce ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.9 }}
          className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex xl:right-8"
        >
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid size-9 place-items-center rounded-full border border-palladian/15 bg-abyssal-dark/45 text-palladian backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
            >
              <Icon className="size-4" aria-hidden="true" />
            </a>
          ))}
          <span
            aria-hidden="true"
            className="mt-2 rotate-180 text-xs font-medium tracking-[0.2em] text-palladian/80 [writing-mode:vertical-rl]"
          >
            Join Social
          </span>
        </motion.aside>
 
        {/* ---------- Slide dots (only when there are 2+ slides) ---------- */}
        {hasSlides && (
          <div
            role="group"
            aria-label="Hero slides"
            className="absolute bottom-16 right-4 z-20 flex items-center lg:bottom-20 lg:right-8"
          >
            {SLIDES.map((s, i) => {
              const current = i === index;
              return (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={current}
                  className="group grid size-6 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      current
                        ? "size-3 bg-burning-flame ring-2 ring-burning-flame/40 ring-offset-2 ring-offset-transparent"
                        : "size-1.5 bg-palladian/60 group-hover:bg-palladian"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
 
        {/* ---------- Brush-stroke separator ---------- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-px leading-none"
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="block h-10 w-full text-abyssal-dark sm:h-14 lg:h-[72px]"
            fill="currentColor"
          >
            {/* dry-brush ghost layer */}
            <path
              opacity="0.35"
              d="M0 120V66C90 50 170 78 290 60S500 46 620 66 850 84 980 58 1120 52 1200 64V120Z"
            />
            {/* torn edge */}
            <path d="M0 120V84l30-6 28 8 34-8 40 10 46-10 38 9 52-6 44 10 60-8 40 8 58-10 50 9 62-7 44 8 70-5 52 7 66-10 48 9 64-6 42 8 68-10 50 7 60-9H1200V120Z" />
          </svg>
        </div>
      </section>
    </>
  );
}