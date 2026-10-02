import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    const teams = await db.collection("teams").find({}).toArray();

    const formattedTeams = teams.map((team) => ({
      _id: team._id.toString(),
      name: team.name,
      averageRating: team.averageRating || 0,
      description: team.description,
      votes: team.votes || 0,
    }));

    return NextResponse.json(formattedTeams, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
