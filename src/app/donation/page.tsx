"use client";

import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import DonationPortal from "@/components/donation/donationportal";
import DonateHero from "@/components/donation/hero";
import WhereDonationsGo from "@/components/donation/wheredonationgo";
import PageBackground from "@/components/sports/pagebackground";

export default function donation() {

  return (
    <main className="relative isolate min-h-screen overflow-hidden text-palladian">
      <PageBackground/>
      <Navbar />
      <DonateHero/>
      <WhereDonationsGo/>
      <DonationPortal/>
      <Footer />
    </main>
  );
}