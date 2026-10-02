import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import AdminDashboard from "@/components/AdminDashboard";
import VoterDashboard from "@/components/VoterDashboard";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  // Protect the route: if not logged in, redirect to home or login
  if (!clerkUser) {
    redirect("/");
  }

  // Fetch the user's role from MongoDB
  const client = await clientPromise;
  const db = client.db("SHARK_TECH_DB");

  const dbUser = await db
    .collection("users")
    .findOne({ clerkId: clerkUser.id });

  // Default to voter if user document isn't found immediately due to sync delay
  const role = dbUser?.role || "voter";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 py-12 px-6">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.1),rgba(255,255,255,0))]" />

      <div className="relative max-w-4xl mx-auto">
        {role === "admin" ? <AdminDashboard /> : <VoterDashboard />}
      </div>
    </main>
  );
}
