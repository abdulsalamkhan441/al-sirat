"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Placeholder content: swap for your real details
const CONTACT = {
  address: ["123 Community Way", "Winnipeg, Manitoba R3C 0A1"],
  phone: "+1 (629) 555-0129",
  phoneHref: "tel:+16295550129",
  email: "hello@alsirat.example",
};

const SOCIALS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Who we are", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

/** Fallback mark: eight-pointed star, matches the lattice pattern. Pass badgeLogoSrc to use your own file. */
function StarMark() {
  return (
    <svg viewBox="0 0 100 100" className="size-full text-burning-flame" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="23" y="23" width="54" height="54" fill="currentColor" fillOpacity="0.14" />
        <rect x="23" y="23" width="54" height="54" transform="rotate(45 50 50)" fill="currentColor" fillOpacity="0.14" />
        <circle cx="50" cy="50" r="13" fill="#111A24" />
        <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export default function Footer({
  badgeLogoSrc,
  mainLogoSrc = "/logo.png", // <--- Path to your main logo image
  mainLogoAlt = "Al-Sirat Academy",
}: {
  badgeLogoSrc?: string;
  mainLogoSrc?: string;
  mainLogoAlt?: string;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.15 } },
  };
  const rise: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <footer className="relative px-4 pb-8 pt-2 text-palladian sm:px-6 sm:pt-2 lg:px-8">
      <style>{`
        @keyframes ft-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -6px; } }
      `}</style>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto max-w-7xl"
      >
        {/* ---------- Content ---------- */}
        <div className="relative px-6 pb-8 pt-24 sm:px-12 sm:pt-28 lg:px-16">
          
          {/* Main Logo Image Replacing text header */}
          <motion.div variants={rise} className="flex flex-col items-center text-center">
            <Link href="/" className="relative inline-block transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative h-20 w-56 sm:h-24 sm:w-72 md:h-28 md:w-80">
                <Image
                  src={mainLogoSrc}
                  alt={mainLogoAlt}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
          </motion.div>

          {/* Contact | buttons | links */}
          <div className="mt-14 grid grid-cols-1 gap-12 border-t border-palladian/10 pt-12 lg:grid-cols-12 lg:items-center lg:gap-8">
            {/* Contact */}
            <motion.div variants={rise} className="order-2 space-y-6 lg:order-1 lg:col-span-4">
              <div>
                <h3 className="text-base font-semibold text-palladian-light">Contact</h3>
                <address className="mt-3 text-sm not-italic leading-relaxed text-oatmeal">
                  {CONTACT.address.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                  <a href={CONTACT.phoneHref} className="mt-1 block rounded hover:text-palladian-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame">
                    {CONTACT.phone}
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="block break-all rounded underline decoration-palladian/30 underline-offset-4 hover:text-palladian-light hover:decoration-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                  >
                    {CONTACT.email}
                  </a>
                </address>
              </div>

              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-palladian-light">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="group inline-flex items-center gap-1 rounded hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      {s.label}
                      <ArrowUpRight
                        className="size-3.5 text-burning-flame transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="inline-flex items-center gap-2 rounded-full border border-palladian/10 bg-palladian/5 py-1.5 pl-1.5 pr-3.5 text-xs text-palladian backdrop-blur-md">
                <span className="inline-flex items-center gap-1 rounded-full bg-burning-flame px-2 py-0.5 text-[11px] font-bold text-abyssal">
                  <Star className="size-3 fill-abyssal" aria-hidden="true" />
                  4.9
                </span>
                Community rating
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={rise}
              className="order-1 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:order-2 lg:col-span-4 lg:flex-col"
            >
              <Link
                href="/join"
                className="group inline-flex items-center justify-between gap-4 rounded-full bg-burning-flame py-2 pl-6 pr-2 text-sm font-semibold text-abyssal shadow-xl shadow-burning-flame/15 transition-[background-color,box-shadow,transform] duration-300 hover:bg-burning-flame-light hover:shadow-burning-flame/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame-light focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark"
              >
                Join us today
                <span className="grid size-9 place-items-center rounded-full bg-abyssal text-burning-flame transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
              <Link
                href="/donate"
                className="group inline-flex items-center justify-between gap-4 rounded-full border border-truffle-light/40 bg-truffle/25 py-2 pl-6 pr-2 text-sm font-semibold text-palladian-light transition-[background-color,border-color,transform] duration-300 hover:border-truffle-light hover:bg-truffle/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
              >
                Donate
                <span className="grid size-9 place-items-center rounded-full bg-palladian/10 text-palladian transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>

            {/* Quick links */}
            <motion.nav
              variants={rise}
              aria-label="Footer"
              className="order-3 lg:col-span-4 lg:justify-self-end"
            >
              <h3 className="text-base font-semibold text-palladian-light">Quick links</h3>
              <ul className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-oatmeal">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="rounded transition-colors hover:text-palladian-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>

          {/* Legal */}
          <motion.div
            variants={rise}
            className="mt-12 flex flex-wrap items-center justify-center gap-3 border-t border-palladian/[0.06] pt-6 sm:justify-end"
          >
            <div className="flex items-center gap-4 rounded-full border border-palladian/10 bg-palladian/5 px-5 py-2 text-xs font-medium text-palladian/80 backdrop-blur-md">
              <Link href="/cookies" className="hover:text-burning-flame">Cookies policy</Link>
              <Link href="/privacy" className="hover:text-burning-flame">Privacy policy</Link>
              <span>&copy;2026</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}