import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { rating } = await req.json();
    const { id } = await params;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    // 1. Check if voting is live
    const settings = await db
      .collection("settings")
      .findOne({ _id: "system_settings" });
    if (!settings?.votingIsLive) {
      return NextResponse.json(
        { error: "Voting is currently closed by the Admin." },
        { status: 403 },
      );
    }

    // 2. Fetch current team data to calculate the new average
    const team = await db
      .collection("teams")
      .findOne({ _id: new ObjectId(id) });
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const currentVotes = team.votes || 0;
    const currentAvg = team.averageRating || 0;

    // Mathematical formula to update an average: ((oldAvg * oldTotal) + newValue) / (oldTotal + 1)
    // curavg * curvotes = previous total rating ;

    const newVotes = currentVotes + 1;
    const newAvg = (currentAvg * currentVotes + rating) / newVotes;

    // 3. Update the database
    await db
      .collection("teams")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { votes: newVotes, averageRating: newAvg } },
      );

    return NextResponse.json(
      { success: true, message: "Vote cast successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Voting error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
