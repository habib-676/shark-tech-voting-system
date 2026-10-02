import { currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";

export default async function SyncUser() {
  // Fetch the currently authenticated user from Clerk
  const user = await currentUser();

  // If no user is logged in, do nothing
  if (!user) return null;

  try {
    const client = await clientPromise;
    const db = client.db("SHARK_TECH_DB");

    const primaryEmail =
      user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      )?.emailAddress || user.emailAddresses[0]?.emailAddress;

    // Use updateOne with upsert: true
    // $setOnInsert ensures these fields are ONLY written the very first time the user is created
    await db.collection("users").updateOne(
      { clerkId: user.id }, // Find user by their unique Clerk ID
      {
        $setOnInsert: {
          clerkId: user.id,
          email: primaryEmail,
          firstName: user.firstName,
          lastName: user.lastName,
          role: "voter", // Default role assigned here
          createdAt: new Date(),
        },
      },
      { upsert: true }, // Creates the document if it doesn't exist
    );
  } catch (error) {
    console.error("Error syncing user to MongoDB:", error);
  }

  // Render nothing to the UI
  return null;
}
