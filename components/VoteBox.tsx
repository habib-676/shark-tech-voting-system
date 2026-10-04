"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs"; // <-- Import Clerk Buttons

export default function VoteBox({
  teamId,
  isLive,
  initialHasVoted,
  isAuthenticated, // <-- Receive new prop
}: {
  teamId: string;
  isLive: boolean;
  initialHasVoted: boolean;
  isAuthenticated: boolean; // <-- Define type
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  const [hasVoted, setHasVoted] = useState(initialHasVoted);

  const handleVote = async (rating: number) => {
    if (!isLive) {
      toast.error("Voting is currently closed!");
      return;
    }

    setIsVoting(true);
    setSelected(rating);

    try {
      const res = await fetch(`/api/teams/${teamId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to vote");

      toast.success(`You awarded ${rating} stars!`);
      setHasVoted(true);
    } catch (error: any) {
      toast.error(error.message);
      setSelected(null);
    } finally {
      setIsVoting(false);
    }
  };

  // 1. If NOT authenticated, prompt to log in FIRST
  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm text-center">
        <p className="text-slate-300 font-medium mb-5">
          You must be logged in to cast your equity vote.
        </p>
        <div className="flex items-center justify-center gap-4">
          <SignInButton mode="modal">
            <button className="px-6 py-2.5 text-sm font-semibold rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all duration-200 shadow-sm shadow-amber-400/10">
              Log In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all duration-200 shadow-sm shadow-cyan-500/20">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </div>
    );
  }

  // 2. If the user already voted
  if (hasVoted) {
    return (
      <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center">
        <p className="text-emerald-400 font-semibold tracking-wide uppercase text-sm">
          Vote Recorded. Thank you!
        </p>
      </div>
    );
  }

  // 3. If voting is not live
  if (!isLive) {
    return (
      <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 text-center">
        <p className="text-rose-400 font-semibold tracking-wide uppercase text-sm">
          Voting is Closed
        </p>
      </div>
    );
  }

  // 4. Otherwise, show the interactive voting stars
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm text-center">
      <p className="text-slate-300 font-medium mb-4">
        Cast your vote for this team
      </p>

      {isVoting ? (
        <div className="flex justify-center items-center py-2">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      ) : (
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={isVoting}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleVote(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <FaStar
                className={`w-8 h-8 transition-colors ${
                  (hovered || selected || 0) >= star
                    ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    : "text-slate-700"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}