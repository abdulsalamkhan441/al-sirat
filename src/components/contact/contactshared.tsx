"use client";

import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/* Glass system shared with the rest of the site */
export const GLASS =
  "relative rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/50 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-palladian/40 before:to-transparent";

export const OVERLAY_GLASS =
  "rounded-2xl border border-palladian/[0.16] bg-abyssal-dark/40 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Self-contained lattice pattern (each instance gets its own pattern id). */
export function Lattice({ mask, className = "" }: { mask: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full text-palladian ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <defs>
        <pattern id={`${id}-lattice`} width="96" height="96" patternUnits="userSpaceOnUse">
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
      <rect width="100%" height="100%" fill={`url(#${id}-lattice)`} />
    </svg>
  );
}

/** Lattice, blurred orbs and an optional outlined ghost word, for use inside a section. */
export function Backdrop({
  ghost,
  ghostSide = "right",
  flip = false,
}: {
  ghost?: string;
  ghostSide?: "left" | "right";
  flip?: boolean;
}) {
  const reduce = !!useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <Lattice
        className="opacity-[0.06]"
        mask="radial-gradient(ellipse 80% 55% at 50% 12%, black, transparent 78%)"
      />
      <div
        className={`absolute top-1/4 size-[34rem] rounded-full bg-blue-fantastic-light/20 blur-3xl ${
          flip ? "-right-40" : "-left-40"
        }`}
      />
      <motion.div
        className={`absolute bottom-0 size-[36rem] rounded-full bg-burning-flame/10 blur-3xl ${
          flip ? "-left-40" : "-right-40"
        }`}
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {ghost && (
        <span
          className={`absolute -bottom-6 hidden select-none text-[13rem] font-semibold leading-none tracking-tight text-transparent xl:block ${
            ghostSide === "right" ? "right-4" : "left-4"
          }`}
          style={{ WebkitTextStroke: "1px rgba(238,233,223,0.06)" }}
        >
          {ghost}
        </span>
      )}
    </div>
  );
}

export function Label({ children, Icon }: { children: ReactNode; Icon: LucideIcon }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-palladian/20 bg-abyssal-dark/50 px-3.5 py-1.5 text-[13px] font-medium text-palladian backdrop-blur-md">
      <Icon className="size-4 text-burning-flame" aria-hidden="true" />
      {children}
    </span>
  );
}