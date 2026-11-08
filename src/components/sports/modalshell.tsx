"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Split modal used for booking / enrolment:
 *  - blurs and dims the whole page behind it
 *  - info on one side (`left`), form on the other (`right`)
 *  - locks page scroll, traps focus, closes on Escape / backdrop / X
 *  - returns focus to the button that opened it
 * Render it always and toggle `open`. Content for `left` / `right` should be
 * keyed by the item (e.g. key={program.id}) so form state resets per item.
 */
export default function ModalShell({
  open,
  onClose,
  labelledBy,
  left,
  right,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  left: ReactNode;
  right: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <Frame onClose={onClose} labelledBy={labelledBy} left={left} right={right} />
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Frame({
  onClose, labelledBy, left, right,
}: {
  onClose: () => void; labelledBy: string; left: ReactNode; right: ReactNode;
}) {
  const reduce = !!useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const downOnBackdrop = useRef(false);

  /* Lock page scroll (without layout shift), focus the dialog, restore focus on close */
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    const bg = document.body.style.backgroundColor;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    // the space left by the hidden page scrollbar must not show the light body colour
    document.body.style.backgroundColor = "var(--color-abyssal-dark)";
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.body.style.backgroundColor = bg;
      prev?.focus?.();
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.tabIndex !== -1 && el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  return (
    <motion.div
      style={{ colorScheme: "dark" }} className="fixed inset-0 z-[100] flex items-end justify-center bg-abyssal-dark/60 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
      onPointerDown={(e) => { downOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (downOnBackdrop.current && e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
        data-lenis-prevent style={{ colorScheme: "dark" }} className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-y-auto overscroll-contain rounded-t-[2rem] border border-palladian/[0.14] bg-abyssal shadow-2xl shadow-abyssal-dark/80 sm:max-h-[90dvh] sm:rounded-[2rem] md:h-[min(90dvh,54rem)] md:max-h-none md:grid-cols-5 md:grid-rows-[minmax(0,1fr)] md:overflow-hidden md:grid [scrollbar-width:thin] [scrollbar-color:color-mix(in_srgb,var(--color-palladian)_28%,transparent)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-palladian/25 hover:[&::-webkit-scrollbar-thumb]:bg-palladian/40"
      >
        <div data-lenis-prevent className="relative min-h-0 md:col-span-2 md:overflow-y-auto md:overscroll-contain [scrollbar-width:thin] [scrollbar-color:color-mix(in_srgb,var(--color-palladian)_28%,transparent)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-palladian/25 hover:[&::-webkit-scrollbar-thumb]:bg-palladian/40">{left}</div>
        <div data-lenis-prevent className="relative min-h-0 border-t border-palladian/10 md:col-span-3 md:overflow-y-auto md:overscroll-contain md:border-l md:border-t-0 [scrollbar-width:thin] [scrollbar-color:color-mix(in_srgb,var(--color-palladian)_28%,transparent)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-palladian/25 hover:[&::-webkit-scrollbar-thumb]:bg-palladian/40">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full border border-palladian/15 bg-abyssal-dark/70 text-palladian backdrop-blur-md transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
          {right}
        </div>
      </motion.div>
    </motion.div>
  );
}