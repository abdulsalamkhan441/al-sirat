"use client";

import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import EventsHero from "@/components/events/hero";
import PageBackground from "@/components/sports/pagebackground";
import EventsExperience from "@/components/events/eventexperiance";

export default function EventsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden text-palladian">
      <PageBackground/>
      <Navbar />
      <EventsHero/>
      <EventsExperience/>
      <Footer />
    </main>
  );
}