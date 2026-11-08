"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

import ContactForm from "./contactform";
import InquiryCategories from "./inquirycategories";
import type { CategoryId } from "./contactdata";

/**
 * Holds the chosen topic so picking a category card pre-fills the form,
 * then scrolls to the form and moves focus to its heading.
 */
export default function ContactSections() {
  const reduce = !!useReducedMotion();
  const [category, setCategory] = useState<CategoryId | "">("");

  function choose(id: CategoryId) {
    setCategory(id);
    requestAnimationFrame(() => {
      document
        .getElementById("contact-form")
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      window.setTimeout(
        () => document.getElementById("cf-heading")?.focus({ preventScroll: true }),
        reduce ? 0 : 600
      );
    });
  }

  return (
    <>
      <InquiryCategories selected={category} onSelect={choose} />
      <ContactForm category={category} onCategoryChange={setCategory} />
    </>
  );
}