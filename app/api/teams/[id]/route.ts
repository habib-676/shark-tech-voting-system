import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { isLive } = await req.json();
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    await db
      .collection("teams")
      .updateOne({ _id: new ObjectId(id) }, { $set: { isLive } });

    return NextResponse.json({ success: true, isLive }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update team status" },
      { status: 500 },
    );
  }
}
// DELETE method to remove a team
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    await db.collection("teams").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 },
    );
  }
}
