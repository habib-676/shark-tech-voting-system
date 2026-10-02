import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { Team } from "@/models/Team";

// Fetched from the database and sorted by votes in descending order

async function getTeams(): Promise<Team[]> {
  try {
    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    const teams = await db
      .collection("teams")
      .find({})
      .sort({ votes: -1 })
      .toArray();

    return teams.map((team) => ({
      _id: team._id.toString(),
      name: team.name,
      averageRating: team.averageRating || 0,
      description: team.description,
      votes: team.votes || 0,
    }));
  } catch (error) {
    console.error("Database connection error:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 selection:bg-amber-400 selection:text-slate-950">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6 mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Shark Tech Arena
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-400">
              Contending Teams
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Select a contender to view their full pitch and cast your vote.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg self-start md:self-auto">
            Total Teams:{" "}
            <span className="text-amber-400 font-bold">{teams.length}</span>
          </div>
        </div>

        {/* Empty State */}
        {teams.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
            <p className="text-slate-400 text-base">
              No teams registered in the tank yet.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/90 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-cyan-500/5"
              >
                <div>
                  {/* Team Logo can be added here */}
                  <div className="flex items-center justify-between text-xs mb-3"></div>

                  <h2 className="text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {team.name}
                  </h2>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-slate-500">
                      Votes
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {team.votes} Backers
                    </span>
                  </div>
                  <Link
                    href={`/teams/${team._id}`}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all active:scale-95"
                  >
                    View Pitch &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
