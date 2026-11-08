import { GraduationCap, Hand, Handshake, Sprout, type LucideIcon } from "lucide-react";
import type { EventItem } from "./events";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Glass card used across the events sections. No section backgrounds: the page background shows through. */
export const GLASS =
  "relative rounded-3xl border border-palladian/[0.12] bg-linear-to-br from-palladian/[0.09] to-palladian/[0.02] shadow-2xl shadow-abyssal-dark/40 backdrop-blur-xl";

/** Glass panel that sits on top of a photo. */
export const OVERLAY =
  "rounded-2xl border border-palladian/[0.16] bg-abyssal-dark/45 shadow-xl shadow-abyssal-dark/40 backdrop-blur-xl";

/**
 * The four ideas from the brief. Each one is a lens on the same event list,
 * so a card in the Participation section can filter the Upcoming list.
 * Edit the `match` rules if the client's event types change.
 */
export type Theme = {
  id: "participate" | "learn" | "connect" | "grow";
  label: string;
  Icon: LucideIcon;
  text: string;
  match: (e: EventItem) => boolean;
};

export const THEMES: Theme[] = [
  {
    id: "participate",
    label: "Participate",
    Icon: Hand,
    text: "Join in. Sports days, games and gatherings where everyone has a part to play.",
    match: (e) => e.kind === "Sports" || e.kind === "Gathering",
  },
  {
    id: "learn",
    label: "Learn",
    Icon: GraduationCap,
    text: "Workshops and training that build real skills, at a pace that suits you.",
    match: (e) => e.kind === "Workshop" || e.kind === "Training",
  },
  {
    id: "connect",
    label: "Connect",
    Icon: Handshake,
    text: "Meet your neighbours, share a meal and find your people.",
    match: (e) => e.kind === "Gathering" || e.kind === "Special",
  },
  {
    id: "grow",
    label: "Grow together",
    Icon: Sprout,
    text: "Volunteer, lead and give back. The community grows when we do.",
    match: (e) => e.audience.includes("Volunteers") || e.kind === "Training" || e.kind === "Special",
  },
];

export type ThemeId = Theme["id"];

export const matchesTheme = (e: EventItem, id: ThemeId) => THEMES.find((t) => t.id === id)!.match(e);