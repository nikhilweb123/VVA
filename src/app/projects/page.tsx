import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import ProjectShowcase from "../components/sections/ProjectShowcase";
import Footer from "../components/sections/Footer";

export default function ProjectsPage() {
  return (
    <SmoothScrollProvider>
      {/* Overlays */}
      <PageLoader />
      <CustomCursor />
      <ScrollProgressBar />

      {/* Fixed nav */}
      <Navbar />

      {/* Page content */}
      <main className="pt-24 bg-obsidian min-h-screen">
        <ProjectShowcase />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
