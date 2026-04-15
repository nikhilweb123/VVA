import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import Services from "../components/sections/Services";
import Footer from "../components/sections/Footer";

export default function ServicesPage() {
  return (
    <SmoothScrollProvider>
      {/* Overlays */}
      <PageLoader />
      <CustomCursor />
      <ScrollProgressBar />

      {/* Fixed nav */}
      <Navbar />

      {/* Page content */}
      <main className="bg-obsidian min-h-screen">
        <Services />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
