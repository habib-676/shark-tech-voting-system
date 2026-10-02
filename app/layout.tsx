import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUser from "@/components/SyncUser";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shark Tech Voting",
  description: "Participant voting gallery",
};

interface LayoutProps<T extends string> {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div>
          <ClerkProvider>
            {/* 
              SyncUser runs silently on the server.
              If a user is logged in, it ensures they exist in MongoDB.
            */}
            <SyncUser />

            {/* Navbar and other components */}
            <Navbar />
            {children}

            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#020617", // slate-950
                  color: "#f1f5f9", // slate-100
                  border: "1px solid #1e293b", // slate-800
                },
              }}
            />
          </ClerkProvider>
        </div>
      </body>
    </html>
  );
}
