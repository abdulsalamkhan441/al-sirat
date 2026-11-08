import emailjs from "@emailjs/browser";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const masterTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT!;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

// --- Group 1: Simple Contact Forms (Contact Page & Footer) ---
export type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  organization?: string;
  message: string;
  sourcePage: string;
};

export const sendContactEmail = async (data: ContactFormData) => {
  const templateParams = {
    form_type: "Contact Inquiry",
    source_page: data.sourcePage,
    from_name: data.name,
    reply_to: data.email,
    phone_number: data.phone || "Not provided",
    topic: data.topic || "General",
    organization: data.organization || "N/A",
    primary_detail: `Topic: ${data.topic || "General"}`,
    secondary_detail: `Organization: ${data.organization || "N/A"}`,
    message: data.message,
  };

  return emailjs.send(serviceId, masterTemplateId, templateParams, publicKey);
};

// --- Group 2: Program Enrollments ---
export type ProgramEnrollData = {
  programTitle: string;
  format: string;
  forWhom: string;
  start: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

export const sendProgramEnrollment = async (data: ProgramEnrollData) => {
  const templateParams = {
    form_type: "Program Enrollment",
    source_page: "Programs Page Modal",
    from_name: data.name,
    reply_to: data.email,
    phone_number: data.phone || "Not provided",
    topic: data.programTitle,
    organization: "N/A",
    primary_detail: `Program: ${data.programTitle}`,
    secondary_detail: `Format: ${data.format} | Target: ${data.forWhom} | Desired Start: ${data.start}`,
    message: data.message || "None",
  };

  return emailjs.send(serviceId, masterTemplateId, templateParams, publicKey);
};

// --- Group 3: Sports Sign-ups ---
export type SportSignupData = {
  sportTitle: string;
  ageGroup: string;
  participants: number;
  level: string;
  times: string[];
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

export const sendSportSignup = async (data: SportSignupData) => {
  const templateParams = {
    form_type: "Sports Sign-up",
    source_page: "Sports Page Modal",
    from_name: data.name,
    reply_to: data.email,
    phone_number: data.phone || "Not provided",
    topic: data.sportTitle,
    organization: "N/A",
    primary_detail: `Sport: ${data.sportTitle} | Age Group: ${data.ageGroup} | Participants: ${data.participants}`,
    secondary_detail: `Level: ${data.level} | Times: ${data.times.length > 0 ? data.times.join(", ") : "Any"}`,
    message: data.message || "None",
  };

  return emailjs.send(serviceId, masterTemplateId, templateParams, publicKey);
};

// --- Group 4: Facility Rentals (NEW) ---
export type RentalRequestData = {
  eventType: string;
  dateLabel: string | null;
  flexible: boolean;
  time: string;
  guests: string;
  spaces: string[];
  wants: string[];
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

export const sendRentalRequest = async (data: RentalRequestData) => {
  const templateParams = {
    form_type: "Facility Rental Inquiry",
    source_page: "Rentals Page Calendar Form",
    from_name: data.name,
    reply_to: data.email,
    phone_number: data.phone || "Not provided",
    topic: data.eventType || "General Facility Rental",
    organization: "N/A",
    primary_detail: `Event Type: ${data.eventType} | Date: ${data.dateLabel || (data.flexible ? "Flexible Dates" : "Not specified")} | Guests: ${data.guests || "Unspecified"}`,
    secondary_detail: `Time: ${data.time || "Not specified"} | Spaces Needed: ${data.spaces.length > 0 ? data.spaces.join(", ") : "None"} | Interests: ${data.wants.join(", ")}`,
    message: data.message || "None",
  };

  return emailjs.send(serviceId, masterTemplateId, templateParams, publicKey);
};