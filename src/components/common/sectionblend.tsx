"use client";

import { useId } from "react";

/**
 * Drop this between any two sections in page.tsx to melt the seam between them:
 *
 *   <EveryoneSection />
 *   <SectionBlend />
 *   <ServicesSection />
 *
 * It overlaps the bottom edge of the section above and the top edge of the one
 * below, then fades out at both ends, so clipped rings, cut-off glows and
 * background colour steps disappear. No changes needed inside the sections.
 *
 * Props
 *  - from: colour at the bottom edge of the section ABOVE  (default: abyssal-dark)
 *  - to:   colour at the top edge of the section BELOW     (default: abyssal-dark)
 *  - size: how much of each section it overlaps (sm | md | lg | xl)
 *  - glow: continue the cool/warm diagonal light across the join
 *  - lattice: continue the star pattern across the join
 */

// Static class strings so Tailwind can see them.
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
  lattice = true,
}: {
  from?: string;
  to?: string;
  size?: keyof typeof SIZES;
  glow?: boolean;
  lattice?: boolean;
}) {
  const pid = `blend-lattice-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const fade = "linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)";

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none relative z-10 w-full overflow-hidden ${SIZES[size]}`}
      style={{
        background: `linear-gradient(to bottom, ${from}, ${to})`,
        maskImage: fade,
        WebkitMaskImage: fade,
      }}
    >
      {glow && (
        <>
          <div className="absolute -left-40 top-1/2 size-96 -translate-y-1/2 rounded-full bg-blue-fantastic-light/20 blur-[110px]" />
          <div className="absolute -right-40 top-1/2 size-96 -translate-y-1/2 rounded-full bg-truffle/15 blur-[110px]" />
        </>
      )}
    </div>
  );
}