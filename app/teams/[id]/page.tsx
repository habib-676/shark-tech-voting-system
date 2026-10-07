import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import VoteBox from "@/components/VoteBox";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server"; // <-- Import Clerk auth

async function getTeamData(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");
    const team = await db.collection("teams").findOne({ _id: new ObjectId(id) });
    return team;
  } catch (error) {
    return null;
  }
}

export default async function TeamDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  // 1. Get current logged-in user
  const { userId } = await auth(); 
  
  const team = await getTeamData(id);
  if (!team) return notFound();

  // 2. Check if the current user's ID exists in this team's votedUsers array
  const hasAlreadyVoted = userId ? (team.votedUsers || []).includes(userId) : false;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/teams" className="text-cyan-400 text-sm hover:underline mb-8 inline-block">
          &larr; Back to Arena
        </Link>
        <div className="p-8 md:p-10 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-6 gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">{team.name}</h1>
            <div className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm font-mono">
              Total Backers: <span className="text-amber-400 font-bold text-lg">Hidden</span>
            </div>
          </div>
          <div className="prose prose-invert max-w-none mb-10">
            <h3 className="text-slate-300 font-semibold mb-2">Pitch Description</h3>
            <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{team.description || "N/A"}</p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800">
            {/* 3. Pass isAuthenticated down to the component */}
            <VoteBox 
              teamId={team._id.toString()} 
              isLive={team.isLive === true} 
              initialHasVoted={hasAlreadyVoted}
              isAuthenticated={!!userId} // <-- NEW PROP
            />
          </div>
        </div>
      </div>
    </main>
  );
}