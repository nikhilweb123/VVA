import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import AboutPreview from "../components/sections/AboutPreview";
import About from "../../components/About";
import Footer from "../components/sections/Footer";

export default function AboutPage() {
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
        <AboutPreview />
        <About />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
