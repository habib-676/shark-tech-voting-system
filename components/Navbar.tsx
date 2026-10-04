"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Teams",
      href: "/teams",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="relative sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* ==================== LOGO ==================== */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-amber-400/20 border border-cyan-500/30 flex items-center justify-center group-hover:border-amber-400/50 transition-all duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-cyan-400 group-hover:text-amber-400 transition-colors"
            >
              <path d="M12 2C12 2 12.5 8 16 11C18.5 13.1 21.5 14 22 14C22 14 20 16 16.5 16C12.5 16 10 18 8 22C7 22 6 20.5 6 18C6 14.5 9 10 9 7C9 4 12 2 12 2Z" />
            </svg>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="font-extrabold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-400">
              SHARK TECH
            </span>
          </div>
        </Link>

        {/* ==================== NAVIGATION ==================== */}
        {/* Text navigation on ALL screen sizes */}
        <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs sm:text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-cyan-400"
                  : "text-slate-300 hover:text-cyan-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ==================== DESKTOP AUTH ==================== */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton>
              <button className="px-4 py-2 text-xs font-semibold rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all duration-200 shadow-sm shadow-amber-400/10">
                Log In
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all duration-200">
                Sign Up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        {/* ==================== MOBILE MENU BUTTON ==================== */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* ==================== MOBILE AUTH DROPDOWN ==================== */}
      {isOpen && (
        <div className="absolute top-[70px] right-4 w-48 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">

            {/* Signed Out */}
            <Show when="signed-out">
              <SignInButton>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all"
                >
                  Log In
                </button>
              </SignInButton>

              <SignUpButton>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2.5 text-xs font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </Show>

            {/* Signed In */}
            <Show when="signed-in">
              <div className="flex flex-col items-center justify-center gap-2 pt-1 pb-1">
                <span className="text-xs text-slate-400 font-medium">
                  Account
                </span>

                <UserButton />
              </div>
            </Show>

          </div>
        </div>
      )}
    </header>
  );
}