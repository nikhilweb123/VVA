import PageLoader from "./components/PageLoader";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import ScrollProgressBar from "./components/ScrollProgressBar";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import HeroSection from "./components/sections/HeroSection";
import MarqueeBanner from "./components/sections/MarqueeBanner";
import ProjectShowcase from "./components/sections/ProjectShowcase";
import StatsBanner from "./components/sections/StatsBanner";
import ImageGrid from "./components/sections/ImageGrid";
import AboutPreview from "./components/sections/AboutPreview";
import Services from "./components/sections/Services";
import About from "../components/About";
import Footer from "./components/sections/Footer";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import dbConnect from "@/lib/db";
import HomepageContent from "@/models/HomepageContent";

export const dynamic = "force-dynamic";

async function getHomepageContent() {
  try {
    await dbConnect();
    const doc = await HomepageContent.findOne({}).lean<Record<string, unknown>>();
    return doc ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <SmoothScrollProvider>
      {/* Overlays */}
      <PageLoader />
      <CustomCursor />
      <ScrollProgressBar />

      {/* Fixed nav */}
      <Navbar />

      {/* Page content */}
      <main>
        <HeroSection slides={(content as any)?.hero} />
        <MarqueeBanner />
        <AboutPreview isPreview={true} about={(content as any)?.about} />
        <Services
          isPage={false}
          services={(content as any)?.services}
          heading={(content as any)?.servicesHeading}
          subheading={(content as any)?.servicesSubheading}
        />
        <About about={(content as any)?.about} />
        <ProjectShowcase />
        <StatsBanner stats={(content as any)?.stats} />
        <TestimonialsSection testimonials={(content as any)?.testimonials} />
        <ImageGrid />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
