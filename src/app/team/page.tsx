import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import Team from "../components/sections/Team";
import Footer from "../components/sections/Footer";

export default function TeamPage() {
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
        <Team />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
