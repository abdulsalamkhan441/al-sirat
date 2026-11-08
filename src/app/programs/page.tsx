import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import SectionBlend from "@/components/common/sectionblend";
import LearningOptions from "@/components/programs/learningoptions";
import ProgramsExplorer from "@/components/programs/programexplorer";
import ProgramsHero from "@/components/programs/programhero";
import ProgramsCatalog from "@/components/programs/programscatalog";
import PageBackground from "@/components/sports/pagebackground";

export default function Programs() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden text-palladian">
      <PageBackground/>
      <Navbar />
      <ProgramsHero />
      <ProgramsExplorer />
      <ProgramsCatalog />
      <LearningOptions />
      <Footer />
    </main>
  );
}