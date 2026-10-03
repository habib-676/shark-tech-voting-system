import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    // Fetch and sort by averageRating descending for the leaderboard
    const teams = await db
      .collection("teams")
      .find({})
      .sort({ averageRating: -1 })
      .toArray();

    const formattedTeams = teams.map((team) => ({
      _id: team._id.toString(),
      name: team.name,
      averageRating: team.averageRating || 0,
      description: team.description,
      votes: team.votes || 0,
      isLive: team.isLive || false,
    }));

    return NextResponse.json(formattedTeams, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    // Insert the new team with default values for votes and rating
    const newTeam = {
      name,
      description,
      votes: 0,
      averageRating: 0,
      isLive: false,
      createdAt: new Date(),
    };

    const result = await db.collection("teams").insertOne(newTeam);

    return NextResponse.json(
      { message: "Team added successfully", teamId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 },
    );
  }
}
