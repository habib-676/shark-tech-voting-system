import Link from "next/link";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default async function Home() {
  const client = await clientPromise;
  const db = client.db("SHARK_TECH_DB");

  const settings = await db
    .collection("settings")
    .findOne({ _id: "system_settings" });

  // Check if ANY team is currently accepting votes
  const liveTeam = await db.collection("teams").findOne({ isLive: true });
  const isLive = !!liveTeam;

  // Get total registered teams
  const teamCount = await db.collection("teams").countDocuments();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 mx-auto max-w-6xl text-center ">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          Shark Tech is Live • Audience Choice Awards
        </div>

        {/* Brand Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-400 drop-shadow-sm">
          SHARK TECH
        </h1>

        {/* Slogans */}
        <p className="mt-4 text-xl md:text-2xl font-medium text-slate-300">
          Back the Bold. Sink the Ordinary.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/teams"
            className="px-6 py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all duration-200 active:scale-95"
          >
            Enter The Tank & Vote
          </Link>
          <a
            href="#featured"
            className="px-6 py-3 text-sm font-semibold rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition-all duration-200"
          >
            Explore Pitches
          </a>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md text-left">
          <div className="p-3 border-r border-slate-800">
            <span className="text-xs uppercase text-slate-400 font-medium">
              Total Startups
            </span>
            <p className="text-2xl font-bold text-cyan-400 mt-1">
              {teamCount} {teamCount === 1 ? "Team" : "Teams"}
            </p>
          </div>
          <div className="p-3 md:border-r border-slate-800">
            <span className="text-xs uppercase text-slate-400 font-medium">
              Votes Cast
            </span>
            <p className="text-2xl font-bold text-amber-400 mt-1">18.5K+</p>
          </div>
          <div className="p-3 border-r border-slate-800">
            <span className="text-xs uppercase text-slate-400 font-medium">
              Shark Pool
            </span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">৳8k</p>
          </div>
          <div className="p-3">
            <span className="text-xs uppercase text-slate-400 font-medium">
              Voting Status
            </span>
            <p
              className={`text-2xl font-bold mt-1 ${isLive ? "text-rose-400" : "text-slate-500"}`}
            >
              {isLive ? (
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />{" "}
                  Live Now
                </span>
              ) : (
                "Closed"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Slogan Banner */}
      <section className="border-t border-slate-900 bg-slate-950/80 py-12 px-6 text-center">
        <blockquote className="text-lg md:text-xl font-light italic text-slate-400 max-w-3xl mx-auto">
          &ldquo;In Shark Tech, ideas pitch to survive. But only the crowd
          decides who commands the waters.&rdquo;
        </blockquote>
      </section>
    </main>
  );
}
