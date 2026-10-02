"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Power } from "lucide-react";

export default function AdminDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [votingIsLive, setVotingIsLive] = useState(false);

  const [formData, setFormData] = useState({ name: "", description: "" });

  // Fetch initial voting status on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setVotingIsLive(data.isLive));
  }, []);

  const handleToggleVoting = async () => {
    setIsTogglingStatus(true);
    const newStatus = !votingIsLive;

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLive: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setVotingIsLive(newStatus);
      toast.success(
        newStatus ? "Voting is now LIVE!" : "Voting has been CLOSED.",
      );
    } catch (error) {
      toast.error("Could not update voting status.");
    } finally {
      setIsTogglingStatus(false);
    }
  };

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
      toast.success("Team successfully added to the tank!");
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Settings Control Panel */}
      <div className="p-6 md:p-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Global Voting Control
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Toggle whether the audience can cast votes on the platform.
          </p>
        </div>

        <button
          onClick={handleToggleVoting}
          disabled={isTogglingStatus}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-70 ${
            votingIsLive
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950"
          }`}
        >
          {isTogglingStatus ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Power className="w-4 h-4" />
          )}
          {votingIsLive ? "STOP VOTING" : "START VOTING"}
        </button>
      </div>

      {/* Form section remains exactly the same as your previous code */}
      <div className="p-8 md:p-10 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-xl">
        <div className="mb-8 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Team Control
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            Deploy New Startup
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Team / Startup Name
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
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
          </div>
          <div className="pt-4 flex justify-end">
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
