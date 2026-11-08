import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import FacilityFeatures from "@/components/rental/features";
import FacilityHero from "@/components/rental/hero";
import FacilityRentals from "@/components/rental/rental";
import PageBackground from "@/components/sports/pagebackground";

export default function rental() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden text-palladian">
      <PageBackground/>
      <Navbar />
      <FacilityHero/>
      <FacilityFeatures/>
      <FacilityRentals/>
      <Footer />
    </main>
  );
}