// src/app/page.tsx

import Footer from "@/components/common/footer";
import SectionBlend from "@/components/common/sectionblend";
import PageBackground from "@/components/sports/pagebackground";
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
    <main className="relative isolate min-h-screen overflow-hidden text-abyssal">
      <PageBackground />
      <HeroSection/>
      <AboutSection/>
      <RadialAboutSection/>
      <SectionBlend/>
      <ServicesSection/>
      <BentoTestimonialsSection/>
      <BlogSection/>
      <ContactSection/>
      <CTASection/>
      <SectionBlend/>
      <FAQSection />
      <Footer />
    </main>
  );
}