import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import ContactForm from "../components/sections/ContactForm";
import Footer from "../components/sections/Footer";
import dbConnect from "@/lib/db";
import ContactSettings from "@/models/ContactSettings";

export const dynamic = "force-dynamic";

async function getContactSettings() {
  try {
    await dbConnect();
    let settings = await ContactSettings.findOne({}).lean();
    if (!settings) {
      settings = await ContactSettings.create({});
    }
    return settings;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getContactSettings();

  return (
    <SmoothScrollProvider>
      <PageLoader />
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />

      <main className="pt-24 bg-obsidian min-h-screen">
        <ContactForm settings={settings as any} />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
