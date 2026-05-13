import PageLoader from "../components/PageLoader";
import SmoothScrollProvider from "../components/SmoothScrollProvider";
import ScrollProgressBar from "../components/ScrollProgressBar";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import Team, { type TeamMember } from "../components/sections/Team";
import Footer from "../components/sections/Footer";
import dbConnect from "@/lib/db";
import TeamMemberModel from "@/models/TeamMember";

export const dynamic = "force-dynamic";

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    await dbConnect();
    const docs = await TeamMemberModel.find({}).sort({ order: 1, createdAt: 1 });
    return docs.map((d) => d.toJSON() as TeamMember);
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
        <Team members={members} />
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
