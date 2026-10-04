import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs/server"; 

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { rating } = await req.json();
    const { id } = await params;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    // 2. Fetch team data
    const team = await db.collection("teams").findOne({ _id: new ObjectId(id) });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    // 3. Check Team's Live Status
    if (!team.isLive) {
      return NextResponse.json({ error: "Voting is currently closed for this team." }, { status: 403 });
    }

    // 4. Check if the user has ALREADY voted
    const votedUsers = team.votedUsers || [];
    if (votedUsers.includes(userId)) {
      return NextResponse.json({ error: "You have already voted for this team." }, { status: 403 });
    }

    const currentVotes = team.votes || 0;
    const currentAvg = team.averageRating || 0;
    
    const newVotes = currentVotes + 1;
    const newAvg = (currentAvg * currentVotes + rating) / newVotes;

    // 5. Update the database and record the user's ID
    await db.collection("teams").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { votes: newVotes, averageRating: newAvg },
        $addToSet: { votedUsers: userId } // <-- Adds user ID to array, prevents duplicates
      }
    );

    return NextResponse.json({ success: true, message: "Vote cast successfully" }, { status: 200 });
  } catch (error) {
    console.error("Voting error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}