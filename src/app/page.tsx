// src/app/page.tsx

import Footer from "@/components/common/footer";
import SectionBlend from "@/components/common/sectionblend";
import AboutSection from "@/components/home/aboutus";
import BlogSection from "@/components/home/blog";
import ContactSection from "@/components/home/contact";
import FAQSection from "@/components/home/faqs";
import CTASection from "@/components/home/finalcta";
import HeroSection from "@/components/home/herosection";
import ServicesSection from "@/components/home/programs";
import BentoTestimonialsSection from "@/components/home/reveiw";
import RadialAboutSection from "@/components/home/whyus";

// ... import other sections

export default function HomePage() {
  return (
    <main className="min-h-screen bg-palladian-light text-abyssal">
      <HeroSection/>
      <AboutSection/>
      <RadialAboutSection/>
      <SectionBlend/>
      <ServicesSection/>
      <SectionBlend/>
      <BentoTestimonialsSection/>
      <SectionBlend/>
      <BlogSection/>
      <SectionBlend/>
      <ContactSection/>
      <SectionBlend/>
      <CTASection/>
      <SectionBlend/>
      <div className="relative isolate bg-linear-to-b from-abyssal-dark via-abyssal to-abyssal-dark">
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
}