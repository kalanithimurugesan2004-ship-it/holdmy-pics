import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Products } from "@/components/site/Products";
import { Customize } from "@/components/site/Customize";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Gallery } from "@/components/site/Gallery";
import { WhyUs } from "@/components/site/WhyUs";
import { Testimonials } from "@/components/site/Testimonials";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { MobileCTA } from "@/components/site/MobileCTA";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen max-w-full overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Customize />
        <HowItWorks />
        <Gallery />
        <WhyUs />
        <Testimonials />
        <InstagramFeed />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
}
