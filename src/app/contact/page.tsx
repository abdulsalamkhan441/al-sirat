"use client";

import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import ClosingMessage from "@/components/contact/closingmessage";
import ContactIntro from "@/components/contact/contactintro";
import ContactSections from "@/components/contact/contactsections";
import PageBackground from "@/components/sports/pagebackground";

export default function contact() {

  return (
    <main className="relative isolate min-h-screen overflow-hidden text-palladian">
      <PageBackground/>
      <Navbar />
      <ContactIntro/>
      <ContactSections />
      <ClosingMessage/>
      <Footer />
    </main>
  );
}