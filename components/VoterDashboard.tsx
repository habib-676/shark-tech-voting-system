import Link from "next/link";

export default function VoterDashboard() {
  return (
    <div className="flex flex-col items-center text-center mt-12 p-10 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
        Voter Portal
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-4">
        Your Voice <span className="text-cyan-400">Shapes the Future</span>
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl mb-8 leading-relaxed">
        Thank you for being a vital part of Shark Tech. Your votes determine which groundbreaking startups will command the waters and secure the ultimate prize. Review the pitches carefully and back the bold.
      </p>
      <Link
        href="/teams"
        className="px-8 py-3.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
      >
        Head to the Arena to Vote
      </Link>
    </div>
  );
}