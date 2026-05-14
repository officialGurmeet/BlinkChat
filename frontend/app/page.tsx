"use client";

import { ThemeProvider } from "@/src/components/landing/ThemeProvider";
import { Navbar } from "@/src/components/landing/Navbar";
import { HeroSection } from "@/src/components/landing/HeroSection";
import { FeaturesSection } from "@/src/components/landing/FeaturesSection";
import { PublicRoomsSection } from "@/src/components/landing/PublicRoomsSection";
import { HowItWorksSection } from "@/src/components/landing/HowItWorksSection";
import { PrivacySection } from "@/src/components/landing/PrivacySection";
import { DevSection } from "@/src/components/landing/DevSection";
import { CTASection } from "@/src/components/landing/CTASection";
import { Footer } from "@/src/components/landing/Footer";

export default function LandingPage() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <HeroSection />
        <div className="bg-zinc-50/70 dark:bg-transparent">
          <FeaturesSection />
        </div>
        <PublicRoomsSection />
        <div className="bg-zinc-50/70 dark:bg-transparent">
          <HowItWorksSection />
        </div>
        <PrivacySection />
        <div className="bg-zinc-50/70 dark:bg-transparent">
          <DevSection />
        </div>
        <CTASection />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
