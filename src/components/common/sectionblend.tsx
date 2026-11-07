"use client";

import { useId } from "react";

/**
 * Drop this between any two sections in page.tsx to melt the seam between them:
 *
 *   <EveryoneSection />
 *   <SectionBlend />
 *   <ServicesSection />
 *
 * Props
 *   - from: colour at the bottom edge of the section ABOVE  (default: abyssal-dark)
 *   - to:   colour at the top edge of the section BELOW     (default: abyssal-dark)
 *   - size: how much of each section it overlaps (sm | md | lg | xl)
 *   - glow: continue the cool/warm diagonal light across the join
 */

const SIZES = {
  sm: "h-32 -my-16",
  md: "h-48 -my-24",
  lg: "h-64 -my-32",
  xl: "h-80 -my-40",
} as const;

export default function SectionBlend({
  from = "var(--color-abyssal-dark)",
  to = "var(--color-abyssal-dark)",
  size = "lg",
  glow = true,
}: {
  from?: string;
  to?: string;
  size?: keyof typeof SIZES;
  glow?: boolean;
}) {
  // Smoother mask curve: wider taper from transparent to opaque to avoid harsh blocks
  const fade = "linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)";

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none relative z-10 w-full overflow-hidden ${SIZES[size]}`}
      style={{
        background: `linear-gradient(to bottom, ${from}, color-mix(in oklab, var(--color-blue-fantastic-dark) 40%, ${from}), ${to})`,
        maskImage: fade,
        WebkitMaskImage: fade,
      }}
    >
      {glow && (
        <>
          <div className="absolute -left-32 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-blue-fantastic/30 blur-[120px]" />
          <div className="absolute -right-32 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-blue-fantastic-light/20 blur-[120px]" />
        </>
      )}
    </div>
  );
}