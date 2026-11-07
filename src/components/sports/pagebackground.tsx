"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * One continuous background for a whole page: the star lattice runs the full
 * height of the page, and the colour glows repeat down it (blue on the left,
 * truffle on the right, flame in between), so it looks like the individual
 * section backgrounds did, with no seams between sections.
 *
 * Use it as the FIRST child of a wrapper that is `relative isolate`
 * (the page <main>, or a wrapper around {children} in the root layout).
 */

const GLOWS: { top: string; side: "left" | "right" | "center"; tone: string; size: string }[] = [
  { top: "0%", side: "left", tone: "bg-blue-fantastic-light/30", size: "size-[40rem]" },
  { top: "14%", side: "right", tone: "bg-truffle/25", size: "size-[42rem]" },
  { top: "28%", side: "center", tone: "bg-burning-flame/12", size: "size-[22rem]" },
  { top: "40%", side: "left", tone: "bg-blue-fantastic-light/30", size: "size-[40rem]" },
  { top: "56%", side: "right", tone: "bg-truffle/25", size: "size-[42rem]" },
  { top: "68%", side: "center", tone: "bg-burning-flame/12", size: "size-[22rem]" },
  { top: "78%", side: "left", tone: "bg-blue-fantastic-light/30", size: "size-[40rem]" },
  { top: "92%", side: "right", tone: "bg-truffle/25", size: "size-[42rem]" },
];

const SIDE = {
  left: "-left-48",
  right: "-right-40",
  center: "left-1/3",
} as const;

export default function PageBackground() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-linear-to-b from-abyssal-dark via-abyssal to-abyssal-dark"
    >
      {/* star lattice, full page height */}
      <svg
        className="absolute inset-0 h-full w-full text-palladian opacity-[0.06]"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 14%, black 86%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 14%, black 86%, transparent)",
        }}
      >
        <defs>
          <pattern id="site-star-lattice" width="96" height="96" patternUnits="userSpaceOnUse">
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
        <rect width="100%" height="100%" fill="url(#site-star-lattice)" />
      </svg>

      {/* glows, repeating down the page and drifting very slowly */}
      {GLOWS.map((g, i) => (
        <motion.div
          key={i}
          style={{ top: g.top }}
          animate={reduce ? undefined : { x: [0, i % 2 ? -40 : 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 22 + i * 3, ease: "easeInOut", repeat: Infinity }}
          className={`absolute ${SIDE[g.side]} ${g.size} -translate-y-1/2 rounded-full ${g.tone} blur-[130px] will-change-transform`}
        />
      ))}
    </div>
  );
}