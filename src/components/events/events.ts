/* -------------------------------------------------------------------------- */
/*  Shared event data and helpers.                                            */
/*  EVERYTHING BELOW IS PLACEHOLDER: names, dates, prices and spots must come */
/*  from the client (or your CMS / database).                                 */
/* -------------------------------------------------------------------------- */

export const AUDIENCES = ["Individuals", "Families", "Volunteers", "Community members"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const KINDS = ["Workshop", "Sports", "Gathering", "Training", "Special"] as const;
export type Kind = (typeof KINDS)[number];

export type EventItem = {
  id: string;
  title: string;
  kind: Kind;
  audience: Audience[];
  date: string; // YYYY-MM-DD
  start: string; // HH:MM (24h)
  end: string;
  location: string;
  address: string;
  blurb: string;
  description: string;
  highlights: string[];
  photo: string;
  capacity: number;
  spotsLeft: number; // 0 = full, registration becomes a waitlist
  price: number; // CAD per person, 0 = free
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=70`;
const PLACE = "Al Sirat Community Center";
const ADDRESS = "123 Community Way, Winnipeg, Manitoba R3C 0A1";

export const EVENTS: EventItem[] = [
  {
    id: "welcome-potluck", title: "Community Welcome Potluck", kind: "Gathering",
    audience: ["Families", "Community members"], date: "2026-11-21", start: "18:00", end: "20:30",
    location: PLACE, address: ADDRESS,
    blurb: "Bring a dish, meet your neighbours and settle in.",
    description: "An easy, friendly evening for new and returning members. Share a meal, meet the team and find out what is happening at the center this season.",
    highlights: ["Shared meal and conversation", "Meet the Al Sirat team", "Kids' corner with activities"],
    photo: u("photo-1511632765486-a01980e01a18"), capacity: 150, spotsLeft: 112, price: 0,
  },
  {
    id: "ai-workshop", title: "Introduction to AI Workshop", kind: "Workshop",
    audience: ["Individuals", "Community members"], date: "2026-11-28", start: "10:00", end: "13:00",
    location: PLACE, address: ADDRESS,
    blurb: "A beginner-friendly look at how AI works and how to use it well.",
    description: "A hands-on morning covering AI basics, everyday tools and responsible use. No experience needed. Bring a laptop if you have one.",
    highlights: ["AI fundamentals in plain language", "Hands-on practice", "Take-home resource list"],
    photo: u("photo-1677442136019-21780ecad995"), capacity: 40, spotsLeft: 14, price: 15,
  },
  {
    id: "family-sports-day", title: "Family Sports Day", kind: "Sports",
    audience: ["Families", "Community members"], date: "2026-12-05", start: "11:00", end: "15:00",
    location: PLACE, address: ADDRESS,
    blurb: "Relay races, games and friendly competition for all ages.",
    description: "Teams of every size take on relays, ball games and fun challenges across the indoor and outdoor areas. Wear comfortable clothes and bring water.",
    highlights: ["Games for every age", "Mixed family teams", "Snacks and prizes"],
    photo: u("photo-1472162072942-cd5147eb3902"), capacity: 120, spotsLeft: 64, price: 0,
  },
  {
    id: "volunteer-orientation", title: "Volunteer Orientation Night", kind: "Training",
    audience: ["Volunteers"], date: "2026-12-09", start: "18:30", end: "20:00",
    location: PLACE, address: ADDRESS,
    blurb: "Learn how to get involved and find the role that fits you.",
    description: "A short orientation for new volunteers: what we do, where help is needed, and how to sign up for shifts that suit your schedule.",
    highlights: ["Roles and responsibilities", "Meet the volunteer coordinators", "Sign up for your first shift"],
    photo: u("photo-1559027615-cd4628902d4a"), capacity: 30, spotsLeft: 22, price: 0,
  },
  {
    id: "resume-workshop", title: "Resume & Interview Workshop", kind: "Training",
    audience: ["Individuals"], date: "2026-12-12", start: "13:00", end: "16:00",
    location: PLACE, address: ADDRESS,
    blurb: "Build a strong resume and practise for real interviews.",
    description: "Work on your resume with a trainer, then practise common interview questions in small groups and get honest, useful feedback.",
    highlights: ["Resume review", "Mock interviews", "Workplace readiness tips"],
    photo: u("photo-1521791136064-7986c2920216"), capacity: 24, spotsLeft: 9, price: 10,
  },
  {
    id: "winter-basketball", title: "Winter Basketball Tournament", kind: "Sports",
    audience: ["Individuals", "Community members"], date: "2026-12-19", start: "09:00", end: "17:00",
    location: PLACE, address: ADDRESS,
    blurb: "A friendly one-day tournament for teams and individuals.",
    description: "Join a team or sign up solo and we will place you on one. Referees, scoring and refreshments are provided.",
    highlights: ["Team and solo sign-up", "Referees provided", "Medals for finalists"],
    photo: u("photo-1546519638-68e109498ffc"), capacity: 80, spotsLeft: 0, price: 5,
  },
  {
    id: "wellness-morning", title: "Community Wellness Morning", kind: "Special",
    audience: ["Individuals", "Community members"], date: "2027-01-09", start: "09:30", end: "12:00",
    location: PLACE, address: ADDRESS,
    blurb: "Gentle movement, calm and conversation to start the year.",
    description: "A slow, welcoming morning with guided stretching, breathing and a short talk on building healthy habits that last.",
    highlights: ["Guided yoga and stretching", "Healthy habits talk", "Tea and light refreshments"],
    photo: u("photo-1544367567-0f2fcb009e0b"), capacity: 50, spotsLeft: 31, price: 0,
  },
  {
    id: "new-year-fair", title: "New Year Community Fair", kind: "Special",
    audience: ["Individuals", "Families", "Volunteers", "Community members"], date: "2027-01-16", start: "11:00", end: "16:00",
    location: PLACE, address: ADDRESS,
    blurb: "Meet our programs, try an activity and sign up for the year.",
    description: "Tables for every program, live demonstrations, kids' activities and a chance to talk with instructors and volunteers.",
    highlights: ["Program showcase", "Try-it demonstrations", "Sign-up desks"],
    photo: u("photo-1492684223066-81342ee5ff30"), capacity: 250, spotsLeft: 186, price: 0,
  },
  {
    id: "food-drive", title: "Winter Food Drive Volunteer Day", kind: "Gathering",
    audience: ["Volunteers", "Community members"], date: "2027-01-23", start: "10:00", end: "14:00",
    location: PLACE, address: ADDRESS,
    blurb: "Sort, pack and deliver food for families who need it.",
    description: "Help us sort donations and pack boxes. All tasks are suitable for first-time volunteers, and training is given on the day.",
    highlights: ["Simple, meaningful tasks", "Work alongside the team", "Volunteer hours recorded"],
    photo: u("photo-1593113598332-cd288d649433"), capacity: 40, spotsLeft: 27, price: 0,
  },
];

/* ----------------------------- helpers ---------------------------------- */

export const parseDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const fmtLong = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { dateStyle: "full" }).format(parseDate(iso));
export const fmtShort = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { weekday: "short", month: "short", day: "numeric" }).format(parseDate(iso));
export const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, h, m));
};
export const fmtRange = (e: Pick<EventItem, "start" | "end">) => `${fmtTime(e.start)} to ${fmtTime(e.end)}`;
export const fmtMoney = (n: number) =>
  n === 0 ? "Free" : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);