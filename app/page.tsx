import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { About } from "@/components/sections/About";
import { Pricing } from "@/components/sections/Pricing";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <CaseStudies />
      <About />
      <Pricing />
      <ContactSection />
    </>
  );
}
