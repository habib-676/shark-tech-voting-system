"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Power, Trash2 } from "lucide-react";

interface TeamResult {
  _id: string;
  name: string;
  votes: number;
  averageRating: number;
  isLive: boolean;
}

export default function AdminDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState<TeamResult[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams");
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      toast.error("Failed to load leaderboard.");
    } finally {
      setIsLoadingTeams(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add team");
      toast.success("Team successfully added!");
      setFormData({ name: "", description: "" });
      fetchTeams(); // Reload table data
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVoting = async (teamId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // Optimistic UI update
    setTeams(
      teams.map((t) => (t._id === teamId ? { ...t, isLive: newStatus } : t)),
    );

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLive: newStatus }),
      });

      if (!res.ok) throw new Error();
      toast.success(
        newStatus ? "Voting OPENED for team" : "Voting CLOSED for team",
      );
    } catch (error) {
      // Revert if failed
      setTeams(
        teams.map((t) =>
          t._id === teamId ? { ...t, isLive: currentStatus } : t,
        ),
      );
      toast.error("Could not update team status.");
    }
  };

  //Delete Team Logic
  const handleDeleteTeam = async (teamId: string) => {
    // Add a confirmation dialog to prevent accidental clicks
    if (
      !window.confirm("Are you sure you want to permanently delete this team?")
    )
      return;

    // Optimistic UI removal
    const previousTeams = [...teams];
    setTeams(teams.filter((t) => t._id !== teamId));

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();
      toast.success("Team permanently deleted.");
    } catch (error) {
      // Revert if failed
      setTeams(previousTeams);
      toast.error("Could not delete the team.");
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* 1. Leaderboard & Control Table */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Live Results
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Leaderboard & Controls
          </h2>
          <p className="text-sm text-slate-400">
            Manage individual team access, monitor scores, and remove teams.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-slate-400 uppercase font-mono text-xs border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 font-semibold">Startup Name</th>
                <th className="px-4 py-4 font-semibold text-center">
                  Total Votes
                </th>
                {/* Updated Header for Score */}
                <th className="px-4 py-4 font-semibold text-center">
                  Score (Out of 100)
                </th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoadingTeams ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                  </td>
                </tr>
              ) : teams.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No teams found.
                  </td>
                </tr>
              ) : (
                teams.map((team, index) => (
                  <tr
                    key={team._id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-slate-100">
                      <span className="text-slate-500 mr-2">#{index + 1}</span>{" "}
                      {team.name}
                    </td>
                    <td className="px-4 py-4 text-center font-mono">
                      {team.votes}
                    </td>

                    {/* NEW: Calculate Score dynamically (averageRating * 20) */}
                    <td className="px-4 py-4 text-center font-mono text-amber-400 font-bold">
                      {(team.averageRating * 20).toFixed(1)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Status Toggle Button */}
                        <button
                          onClick={() =>
                            handleToggleVoting(team._id, team.isLive)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-[11px] uppercase tracking-wider transition-all ${
                            team.isLive
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          {team.isLive ? "Stop" : "Start"}
                        </button>

                        {/* NEW: Delete Button */}
                        <button
                          onClick={() => handleDeleteTeam(team._id)}
                          title="Delete Team"
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Add New Team Form */}
      <div className="p-8 md:p-10 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl">
        <div className="mb-8 border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-bold text-slate-100">
            Deploy New Startup
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Team Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Pitch Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
          </div>
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Deploying...
                </>
              ) : (
                "Add Team to Arena"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
