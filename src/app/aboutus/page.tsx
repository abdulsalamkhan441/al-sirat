import Commitments from "@/components/about/commitment";
import AboutHero from "@/components/about/hero";
import VisionMission from "@/components/about/visionmission";
import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import SectionBlend from "@/components/common/sectionblend";



export default function aboutus() {
  return (
    <main className="min-h-screen bg-palladian-light text-abyssal">
      <Navbar/>
      <AboutHero/>
      <VisionMission/>
      <SectionBlend/>
      <Commitments/>
    </main>
  );
}