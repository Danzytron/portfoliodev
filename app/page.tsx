import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { TechStackSection } from "@/components/tech-stack-section";
import { ProjectsSection } from "@/components/projects-section";
import { PhilosophySection } from "@/components/philosophy-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { RevealObserver } from "@/components/reveal-observer";
import { GalaxyBackground } from "@/components/galaxy-background";
import { ScrollProgress } from "@/components/scroll-progress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <GalaxyBackground />

      <a
        href="#about"
        className="sr-only z-[60] rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ProjectsSection />
        <PhilosophySection />
        <ContactSection />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      <RevealObserver />
    </>
  );
}
