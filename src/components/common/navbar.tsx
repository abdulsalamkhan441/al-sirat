"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

/** Must match AnnouncementBar's h-10 (40px). */
const BAR_HEIGHT = 40;

const PHONE_DISPLAY = "+1 (629) 555-0129";
const PHONE_HREF = "tel:+16295550129";

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    children: [
      { label: "Overview", href: "/#overview" },
      { label: "Announcements", href: "/#announcements" },
    ],
  },
  { label: "Who We Are", href: "/who-we-are" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Prayer Times", href: "/services/prayer-times" },
      { label: "Islamic Education", href: "/services/education" },
      { label: "Community Support", href: "/services/community-support" },
    ],
  },
  {
    label: "Pages",
    href: "/pages",
    children: [
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame focus-visible:ring-offset-2 focus-visible:ring-offset-abyssal-dark";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                  */
/* -------------------------------------------------------------------------- */

const stripHash = (href: string) => href.split("#")[0] || "/";

function isPathActive(pathname: string, href: string) {
  const path = stripHash(href);
  return path === "/"
    ? pathname === "/"
    : pathname === path || pathname.startsWith(`${path}/`);
}

function isItemActive(item: NavItem, pathname: string) {
  return (
    isPathActive(pathname, item.href) ||
    !!item.children?.some((c) => isPathActive(pathname, c.href))
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop item (link or hover/click dropdown)                              */
/* -------------------------------------------------------------------------- */

function DesktopNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const active = isItemActive(item, pathname);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close after navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const triggerClass = `group/link relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium tracking-wide transition-colors hover:text-burning-flame ${focusRing} ${
    active ? "text-burning-flame" : "text-palladian"
  }`;

  const underline = (
    <span
      aria-hidden="true"
      className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-burning-flame transition-transform duration-300 ${
        active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"
      }`}
    />
  );

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={triggerClass}
        >
          {item.label}
          {underline}
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(true)}
        className={triggerClass}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        {underline}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: reduce ? 0 : 8,
              scale: reduce ? 1 : 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 6 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 w-56 origin-top-left pt-3"
          >
            <div className="overflow-hidden rounded-xl border border-palladian/10 bg-abyssal-dark/95 py-2 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl">
              <ul>
                {item.children.map((child) => {
                  const childActive = isPathActive(pathname, child.href);
                  return (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={`block px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-blue-fantastic/50 hover:text-burning-flame focus-visible:bg-blue-fantastic/50 focus-visible:text-burning-flame focus-visible:outline-none ${
                          childActive ? "text-burning-flame" : "text-palladian"
                        }`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                    */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const reduce = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Nav starts below the announcement bar, then glides to the top edge.
  const { scrollY } = useScroll();
  const top = useTransform(scrollY, [0, BAR_HEIGHT], [BAR_HEIGHT, 0]);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > BAR_HEIGHT));
  useEffect(() => {
    setScrolled(window.scrollY > BAR_HEIGHT);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  // Lock body scroll + Escape + close when resizing to desktop
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMobileOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-abyssal-dark/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        style={{ top }}
        initial={{ opacity: 0, y: reduce ? 0 : -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
        className="fixed inset-x-0 z-50 px-3 sm:px-5 lg:px-8"
      >
        <nav
          aria-label="Main"
          className={`relative mx-auto mt-3 flex max-w-[1400px] items-center justify-between gap-4 rounded-2xl border border-palladian/10 px-3 py-2.5 transition-[background-color,box-shadow,backdrop-filter] duration-300 sm:px-4 lg:min-h-[72px] lg:py-0 ${
            scrolled
              ? "bg-abyssal-dark/90 shadow-2xl shadow-abyssal-dark/40 backdrop-blur-xl"
              : "bg-abyssal-dark/45 backdrop-blur-md"
          }`}
        >
          {/* Logo with Image */}
          <Link
            href="/"
            aria-label="Al Sirat — home"
            className={`group inline-flex items-center transition-transform duration-300 hover:scale-105 lg:self-stretch lg:pr-8 ${focusRing}`}
          >
            <Image
              src="/logo.png"
              alt="Al Sirat Community Center Logo"
              width={220}
              height={60}
              className="h-12 w-auto object-contain sm:h-14 lg:h-16"
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex xl:gap-2">
            {NAV_ITEMS.map((item) => (
              <DesktopNavItem
                key={item.label}
                item={item}
                pathname={pathname}
              />
            ))}
          </ul>

          {/* Desktop right cluster */}
          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={PHONE_HREF}
              className={`group hidden items-center gap-3 rounded-full xl:flex ${focusRing}`}
            >
              <span className="grid size-10 place-items-center rounded-full border border-palladian/15 bg-blue-fantastic/60 text-burning-flame transition-colors group-hover:bg-burning-flame group-hover:text-abyssal">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] text-oatmeal">
                  Contact Us
                </span>
                <span className="block text-[13px] font-semibold text-palladian transition-colors group-hover:text-burning-flame">
                  {PHONE_DISPLAY}
                </span>
              </span>
            </a>

            <Link
              href="/explore"
              className={`group inline-flex items-center gap-3 rounded-full bg-burning-flame py-1.5 pl-5 pr-1.5 text-sm font-bold text-abyssal shadow-lg shadow-burning-flame/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-burning-flame-light hover:shadow-burning-flame/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
            >
              Explore More
              <span className="grid size-9 place-items-center rounded-full bg-abyssal-dark text-palladian transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className={`grid size-11 place-items-center rounded-xl border border-palladian/10 bg-blue-fantastic/50 text-palladian transition-colors hover:text-burning-flame lg:hidden ${focusRing}`}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>

          {/* Mobile panel */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                id="mobile-menu"
                initial={{
                  opacity: 0,
                  y: reduce ? 0 : -12,
                  scale: reduce ? 1 : 0.98,
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: reduce ? 0 : -12,
                  scale: reduce ? 1 : 0.98,
                }}
                transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
                className="absolute inset-x-0 top-full mt-2 max-h-[calc(100svh-8rem)] origin-top overflow-y-auto overscroll-contain rounded-2xl border border-palladian/10 bg-abyssal-dark/95 p-3 shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl lg:hidden"
              >
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isItemActive(item, pathname);
                    const rowClass = `flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-blue-fantastic/40 hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame ${
                      active ? "text-burning-flame" : "text-palladian"
                    }`;

                    if (!item.children) {
                      return (
                        <li key={item.label}>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={rowClass}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    }

                    const expanded = mobileSection === item.label;
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() =>
                            setMobileSection(expanded ? null : item.label)
                          }
                          className={rowClass}
                        >
                          {item.label}
                          <ChevronDown
                            aria-hidden="true"
                            className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reduce ? 0 : 0.22,
                                ease: "easeOut",
                              }}
                              className="ml-4 overflow-hidden border-l border-palladian/10"
                            >
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="block rounded-lg px-4 py-2.5 text-sm text-oatmeal transition-colors hover:text-burning-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 flex flex-col gap-3 border-t border-palladian/10 pt-4">
                  <a
                    href={PHONE_HREF}
                    className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-palladian hover:text-burning-flame"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-blue-fantastic/60 text-burning-flame">
                      <Phone className="size-4" aria-hidden="true" />
                    </span>
                    {PHONE_DISPLAY}
                  </a>
                  <Link
                    href="/explore"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-burning-flame py-3 text-sm font-bold text-abyssal transition-colors hover:bg-burning-flame-light"
                  >
                    Explore More
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </>
  );
}
