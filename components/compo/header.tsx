import React from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Wallet, LayoutDashboard, PenBox } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header
      role="banner"
      className="
        fixed top-0 z-50 w-full
        border-b border-slate-200/50
        bg-white/80 dark:bg-slate-950/80
        backdrop-blur-xl
        shadow-sm
      "
    >
      <nav
        aria-label="Primary"
        className="container mx-auto flex h-16 items-center justify-between px-4"
      >
        {/* ================= Logo ================= */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              bg-gradient-to-br from-indigo-600 to-purple-600
              text-white
              shadow-lg shadow-indigo-500/25
              transition-transform group-hover:scale-105
            "
          >
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FinTrack
          </span>
        </Link>

        {/* ================= Navigation (signed out) ================= */}
        <SignedOut>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link
              href="#features"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium"
            >
              Testimonials
            </Link>
          </div>
        </SignedOut>

        {/* ================= Actions ================= */}
        <div className="flex items-center gap-3">
          <SignedIn>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="
                    h-9 gap-2
                    border-slate-200 dark:border-slate-800
                    bg-white dark:bg-slate-900
                    text-slate-700 dark:text-slate-300
                    hover:bg-slate-50 dark:hover:bg-slate-800
                    hover:border-slate-300 dark:hover:border-slate-700
                    transition-colors duration-200
                  "
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <Link href="/transactions/create">
                <Button
                  className="
                    h-9 gap-2
                    bg-gradient-to-r from-indigo-600 to-purple-600
                    text-white
                    hover:from-indigo-700 hover:to-purple-700
                    shadow-lg shadow-indigo-500/25
                    transition-all duration-200
                    active:scale-95
                  "
                >
                  <PenBox className="h-4 w-4" />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button
                  variant="outline"
                  className="
                    h-9
                    border-slate-200 dark:border-slate-800
                    bg-white dark:bg-slate-900
                    text-slate-700 dark:text-slate-300
                    hover:bg-slate-50 dark:hover:bg-slate-800
                    transition-colors duration-200
                  "
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-800",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
