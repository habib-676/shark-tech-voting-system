"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function VoteBox({
  teamId,
  isLive,
  initialHasVoted, // <-- Receive new prop
}: {
  teamId: string;
  isLive: boolean;
  initialHasVoted: boolean; // <-- Define type
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  // Set initial state based on database check
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
      setHasVoted(true); // Lock the UI locally after successful vote
    } catch (error: any) {
      toast.error(error.message);
      setSelected(null);
    } finally {
      setIsVoting(false);
    }
  };

  // If the user already voted (checked from DB or just now), show the success message
  if (hasVoted) {
    return (
      <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center">
        <p className="text-emerald-400 font-semibold tracking-wide uppercase text-sm">
          Vote Recorded. Thank you!
        </p>
      </div>
    );
  }

  // If voting is not live, show the closed message
  if (!isLive) {
    return (
      <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 text-center">
        <p className="text-rose-400 font-semibold tracking-wide uppercase text-sm">
          Voting is Closed
        </p>
      </div>
    );
  }

  // Otherwise, show the voting stars
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