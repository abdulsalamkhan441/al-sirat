import Link from "next/link";
import { CalendarDays } from "lucide-react";

/**
 * Top strip above the navbar.
 * Height is fixed at h-10 (40px). Navbar.tsx reads the same value (BAR_HEIGHT)
 * so the floating nav tucks under it and glides to the top as you scroll.
 */
const EVENT = {
  title: "Join Our Event",
  date: "28 Nov, 2024", // update to your next event
  place: "New Market, California.",
  href: "/events",
};

export default function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Announcement"
      className="flex h-10 items-center justify-center gap-3 bg-blue-fantastic px-4 text-palladian"
    >
      <Link
        href={EVENT.href}
        className="group flex min-w-0 items-center gap-2 rounded text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burning-flame sm:text-[13px]"
      >
        <CalendarDays
          className="size-4 shrink-0 text-burning-flame"
          aria-hidden="true"
        />
        <span className="truncate">
          <span className="font-semibold group-hover:text-burning-flame-light">
            {EVENT.title}
          </span>{" "}
          <span className="hidden text-palladian/85 sm:inline">
            ({EVENT.date}) {EVENT.place}
          </span>
          <span className="text-palladian/85 sm:hidden">· {EVENT.date}</span>
        </span>
      </Link>

      <Link
        href="/donate"
        className="shrink-0 rounded-md bg-burning-flame px-3 py-1 text-xs font-bold text-abyssal transition-colors hover:bg-burning-flame-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palladian focus-visible:ring-offset-2 focus-visible:ring-offset-blue-fantastic"
      >
        Donate Now
      </Link>
    </div>
  );
}