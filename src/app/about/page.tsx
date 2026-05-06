import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import AboutPreview from "../components/sections/AboutPreview";
import About from "../../components/About";
import Footer from "../components/sections/Footer";
import dbConnect from "@/lib/db";
import AboutContent from "@/models/AboutContent";

export const dynamic = "force-dynamic";

async function getAboutContent() {
  try {
    await dbConnect();
    let about = await AboutContent.findOne({}).lean();
    if (!about) {
      about = await AboutContent.create({}).lean();
    }
    return about;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutContent();

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
        <AboutPreview about={aboutData as any} />
        <About about={aboutData as any} />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
