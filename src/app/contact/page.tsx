import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import ContactForm from "../components/sections/ContactForm";
import Footer from "../components/sections/Footer";

export default function ContactPage() {
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
        <ContactForm />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
