import {
  Award,
  Building2,
  CalendarHeart,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

export type CategoryId =
  | "programs"
  | "rentals"
  | "volunteer"
  | "partnerships"
  | "sponsorships"
  | "events";

export type Category = {
  id: CategoryId;
  label: string;
  text: string;
  placeholder: string;
  Icon: LucideIcon;
};

/** The six inquiry categories from the brief. Descriptions are placeholders, edit freely. */
export const CATEGORIES: Category[] = [
  {
    id: "programs",
    label: "Programs",
    text: "Ask about our classes, activities and how to take part.",
    placeholder: "Which program are you interested in, and who is it for?",
    Icon: GraduationCap,
  },
  {
    id: "rentals",
    label: "Facility rentals",
    text: "Find out about booking our space for your gathering or event.",
    placeholder: "Tell us about your event, the date you have in mind and the number of guests.",
    Icon: Building2,
  },
  {
    id: "volunteer",
    label: "Volunteer opportunities",
    text: "Offer your time and skills to support our community.",
    placeholder: "Tell us about your interests, skills and when you are available.",
    Icon: HandHeart,
  },
  {
    id: "partnerships",
    label: "Partnerships",
    text: "Explore working together on programs and initiatives.",
    placeholder: "Tell us about your organization and what you would like to do together.",
    Icon: HeartHandshake,
  },
  {
    id: "sponsorships",
    label: "Sponsorships",
    text: "Learn how to sponsor programs, activities or events.",
    placeholder: "Tell us what you would like to sponsor and how you would like to be involved.",
    Icon: Award,
  },
  {
    id: "events",
    label: "Community events",
    text: "Hear about upcoming gatherings or suggest one of your own.",
    placeholder: "Tell us about the event you are asking about or the idea you have.",
    Icon: CalendarHeart,
  },
];

/** PLACEHOLDERS. Replace every value below with Al Sirat's real contact details. */
export const CONTACT_INFO = {
  phone: { display: "(000) 000-0000", href: "tel:+10000000000" },
  email: { display: "hello@example.org", href: "mailto:hello@example.org" },
  address: ["Al Sirat Academy", "Street address, City"],
  hours: ["Monday to Friday", "9:00 AM to 5:00 PM"],
};