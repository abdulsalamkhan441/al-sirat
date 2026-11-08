"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

/** Shared form pieces for the booking / enrolment / sign-up modals. */

export const inputBase =
  "w-full rounded-2xl border bg-abyssal-dark/55 px-5 py-3.5 text-sm text-palladian placeholder:text-oatmeal/50 outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-palladian/25 focus:bg-abyssal-dark/80 focus:ring-4";
export const inputOk = "border-palladian/[0.12] focus:border-burning-flame/60 focus:ring-burning-flame/10";
export const inputBad = "border-truffle-light/70 focus:border-truffle-light focus:ring-truffle-light/15";
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden text-xs font-medium text-truffle-light"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function Field({
  id, label, error, aside, children,
}: {
  id: string; label: string; error?: string; aside?: ReactNode; children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-xs font-medium text-palladian/80">{label}</label>
        {aside}
      </div>
      {children}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function Chip({
  kind = "radio", name, value, checked, onChange, children,
}: {
  kind?: "radio" | "checkbox"; name: string; value: string; checked: boolean; onChange: () => void; children: ReactNode;
}) {
  return (
    <label className="cursor-pointer">
      <input type={kind} name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`inline-block rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-burning-flame ${
          checked
            ? "border-burning-flame bg-burning-flame text-abyssal shadow-lg shadow-burning-flame/20"
            : "border-burning-flame/25 bg-burning-flame/10 text-burning-flame-light hover:border-burning-flame/60 hover:bg-burning-flame/15"
        }`}
      >
        {children}
      </span>
    </label>
  );
}

export function Stepper({
  id, label, hint, value, min, max, onChange,
}: {
  id: string; label: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void;
}) {
  const btn =
    "grid size-9 place-items-center rounded-full border border-palladian/15 bg-palladian/5 text-palladian transition-colors hover:border-burning-flame hover:bg-burning-flame hover:text-abyssal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-palladian/[0.12] bg-abyssal-dark/55 px-4 py-3">
      <div>
        <p id={`${id}-label`} className="text-sm font-semibold text-palladian-light">{label}</p>
        <p className="text-[11px] text-oatmeal">{hint}</p>
      </div>
      <div role="group" aria-labelledby={`${id}-label`} className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}>
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span id={id} aria-live="polite" className="w-5 text-center text-sm font-semibold tabular-nums text-palladian-light">{value}</span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}>
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}