import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import Team from "../components/sections/Team";
import Footer from "../components/sections/Footer";
import dbConnect from "@/lib/db";
import TeamMember from "@/models/TeamMember";

export const dynamic = "force-dynamic";

async function getTeamMembers() {
  try {
    await dbConnect();
    const members = await TeamMember.find({}).sort({ order: 1, createdAt: 1 }).lean();
    return members;
  } catch {
    return [];
  }
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <SmoothScrollProvider>
      <PageLoader />
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />
      <main className="bg-obsidian min-h-screen">
        <Team members={members as any} />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
