export interface User {
  _id?: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "voter" | "admin";
  createdAt: Date;
}
