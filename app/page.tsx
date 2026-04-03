import PageLoader           from "./components/PageLoader";
import SmoothScrollProvider  from "./components/SmoothScrollProvider";
import ScrollProgressBar     from "./components/ScrollProgressBar";
import CustomCursor          from "./components/CustomCursor";
import Navbar                from "./components/Navbar";
import HeroSection           from "./components/sections/HeroSection";
import MarqueeBanner         from "./components/sections/MarqueeBanner";
import ProjectShowcase       from "./components/sections/ProjectShowcase";
import StatsBanner           from "./components/sections/StatsBanner";
import ImageGrid             from "./components/sections/ImageGrid";
import AboutPreview          from "./components/sections/AboutPreview";
import Footer                from "./components/sections/Footer";

export default function Home() {
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
        <HeroSection />
        <MarqueeBanner />
        <ProjectShowcase />
        <StatsBanner />
        <ImageGrid />
        <AboutPreview />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
