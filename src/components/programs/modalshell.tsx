"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  /** Left column: details. On phones it stacks above the form. */
  left: ReactNode;
  /** Right column: the form. Its own footer can be `sticky bottom-0`. */
  right: ReactNode;
};

/* Dark, thin scrollbars for everything inside the modal (instead of the bright default bar). */
const SCROLL_CSS = `
[data-modal-scroll] {
  color-scheme: dark;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in oklab, var(--color-palladian) 28%, transparent) transparent;
}
[data-modal-scroll]::-webkit-scrollbar { width: 8px; height: 8px; }
[data-modal-scroll]::-webkit-scrollbar-track { background: transparent; }
[data-modal-scroll]::-webkit-scrollbar-thumb {
  background: color-mix(in oklab, var(--color-palladian) 22%, transparent);
  border: 2px solid transparent;
  background-clip: content-box;
  border-radius: 999px;
}
[data-modal-scroll]::-webkit-scrollbar-thumb:hover {
  background: color-mix(in oklab, var(--color-burning-flame) 70%, transparent);
  background-clip: content-box;
}
`;

function CloseButton({ onClose, className }: { onClose: () => void; className: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className={`size-10 place-items-center rounded-full border border-palladian/15 bg-abyssal-dark/70 text-palladian backdrop-blur-md transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame ${className}`}
    >
      <X className="size-4" aria-hidden="true" />
    </button>
  );
}

export default function ModalShell({ open, onClose, labelledBy, left, right }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // AnimatePresence keeps the last element on screen while it animates out,
  // so the card does not go empty when `program` / `event` becomes null.
  return createPortal(
    <AnimatePresence>
      {open && <Dialog key="dialog" onClose={onClose} labelledBy={labelledBy} left={left} right={right} />}
    </AnimatePresence>,
    document.body,
  );
}

function Dialog({ onClose, labelledBy, left, right }: Omit<Props, "open">) {
  const reduce = !!useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const downOnBackdrop = useRef(false);

  const focusables = () =>
    Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
      (el) => el.tabIndex !== -1 && el.getClientRects().length > 0,
    );

  /* Lock page scroll (without the page jumping sideways), focus in, restore focus on close */
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    const t = setTimeout(() => (focusables()[0] ?? dialogRef.current)?.focus(), 60);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      prev?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-abyssal-dark/60 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) onClose();
      }}
    >
      <style>{SCROLL_CSS}</style>

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        data-modal-scroll
        data-lenis-prevent
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
        /*
          Phones and tablets: one column that scrolls as a whole (details, then form).
          md and up: two columns of fixed height; each scrolls on its own.
        */
        className="relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-y-auto overscroll-contain rounded-t-[2rem] border border-palladian/[0.14] bg-abyssal shadow-2xl shadow-abyssal-dark/80 outline-none sm:max-h-[90svh] sm:rounded-[2rem] md:grid md:h-[min(90svh,54rem)] md:max-h-none md:grid-cols-5 md:grid-rows-[minmax(0,1fr)] md:overflow-hidden"
      >
        {/* Phones: the close button stays pinned to the top while you scroll */}
        <div className="sticky top-0 z-30 h-0 shrink-0 md:hidden">
          <CloseButton onClose={onClose} className="absolute right-4 top-4 grid" />
        </div>

        {/* `shrink-0` is the important bit: without it the flex column squeezes this
            block to the dialog's height and its content spills over the form. */}
        <div
          data-modal-scroll
          className="relative shrink-0 md:col-span-2 md:overflow-y-auto md:overscroll-contain"
        >
          {left}
        </div>

        <div
          data-modal-scroll
          className="relative shrink-0 border-t border-palladian/10 md:col-span-3 md:overflow-y-auto md:overscroll-contain md:border-l md:border-t-0"
        >
          <CloseButton onClose={onClose} className="absolute right-4 top-4 z-20 hidden md:grid" />
          {right}
        </div>
      </motion.div>
    </motion.div>
  );
}