import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import SportsClosing from "@/components/sports/closing";
import SportsHero from "@/components/sports/hero";
import PageBackground from "@/components/sports/pagebackground";
import SportsPrograms from "@/components/sports/sportsprogram";

export default function sports() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden text-palladian">
      <PageBackground/>
      <Navbar />
      <SportsHero/>
      <SportsPrograms/>
      <SportsClosing/>
      <Footer />
    </main>
  );
}