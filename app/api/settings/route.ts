import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    // Find the settings document. If it doesn't exist, we assume voting is closed.
    const settings = await db
      .collection("settings")
      .findOne({ _id: "system_settings" });
    const isLive = settings?.votingIsLive || false;

    return NextResponse.json({ isLive }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { isLive } = await req.json();
    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    // Upsert the setting so it always updates the same document
    await db
      .collection("settings")
      .updateOne(
        { _id: "system_settings" },
        { $set: { votingIsLive: isLive } },
        { upsert: true },
      );

    return NextResponse.json({ success: true, isLive }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
