import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TransformationComparison } from "@/components/TransformationComparison";
import { ServicesGrid } from "@/components/ServicesGrid";
import { PortfolioShowcase } from "@/components/PortfolioShowcase";
import { AboutUsAndPromise } from "@/components/AboutUsAndPromise";
import { SmallBusinessHub } from "@/components/SmallBusinessHub";
import { ContactAndBookings } from "@/components/ContactAndBookings";
import { ClientPortalAndAdmin } from "@/components/ClientPortalAndAdmin";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"sites4u\",\"description\":\"we are a b2b website agency, we build professional websites for SMEs who are still not online, we help with marketing, small family run businesses and smaller independent businesses to rival the big corps\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"swansea, wales\"},\"url\":\"https://sites4u-94f692.duckbyte.co\"}" }} />
      <Navbar />
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <TransformationComparison />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <ServicesGrid />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <PortfolioShowcase />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <AboutUsAndPromise />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <SmallBusinessHub />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <ContactAndBookings />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <ClientPortalAndAdmin />
      </Suspense>
      <Footer />
    </main>
  );
}
