"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import EventBookingModal from "./eventsbookingmodel";
import { EVENTS, parseDate, type EventItem } from "./events";
import ParticipationSection from "./paticipationsection";
import type { ThemeId } from "./shared";
import UpcomingEvents from "./upcomingevents";

const sortEvents = (list: EventItem[]) =>
  [...list].sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

/**
 * Sections 2 and 3 of the Events page, sharing one booking modal and one filter.
 * Replace EVENTS with data from the client's CMS or API when it exists.
 */
export default function EventsExperience() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [theme, setTheme] = useState<ThemeId | null>(null);

  // Server renders every event; the browser then hides ones that have already happened
  const [upcoming, setUpcoming] = useState<EventItem[]>(() => sortEvents(EVENTS));
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setUpcoming(sortEvents(EVENTS).filter((e) => parseDate(e.date) >= today));
  }, []);

  const scrollToList = () =>
    document
      .getElementById("upcoming")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  return (
    <>
      <UpcomingEvents
        events={upcoming}
        theme={theme}
        onThemeChange={setTheme}
        onRegister={setSelected}
      />

      <ParticipationSection
        events={upcoming}
        onExplore={(t) => {
          setTheme(t);
          scrollToList();
        }}
        onBrowseAll={() => {
          setTheme(null);
          scrollToList();
        }}
      />

      {/* Add onSubmit={async (registration) => { ... }} to send registrations to your API.
          Return { checkoutUrl } to send people to a payment page, or { reference } to show a code. */}
      <EventBookingModal event={selected} onClose={() => setSelected(null)} />
    </>
  );
}