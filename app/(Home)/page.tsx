import { ScrollAnimationProvider } from "@/components/scroll-animation-provider";
import { HeroSection } from "../components/Hero-Section";
import { FeaturesSection } from "../components/Feature-Section";
import { CtaSection } from "../components/CTA-Section";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/NavBar";

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen">
        <HeroSection />
        <FeaturesSection />
        {/* <TestimonialsSection /> */}
        <CtaSection />
        <Footer />
    </main>
  );
}
