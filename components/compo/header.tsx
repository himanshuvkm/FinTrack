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
        border-b border-white/5
        bg-neutral-950/80
        backdrop-blur
      "
    >
      <nav
        aria-label="Primary"
        className="container mx-auto flex h-16 items-center justify-between px-4"
      >
        {/* ================= Logo ================= */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              border border-white/10
              bg-neutral-900
              text-white
            "
          >
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">
            Fintrack
          </span>
        </Link>

        {/* ================= Navigation (signed out) ================= */}
        <SignedOut>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link
              href="#features"
              className="text-white/60 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-white/60 hover:text-white transition-colors"
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
                  border-white/10
                  bg-neutral-900
                  text-white/80
                  hover:bg-neutral-800 hover:text-white
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
                  bg-white
                  text-black
                  hover:bg-white/90
                "
              >
                <PenBox className="h-4 w-4" />
                <span className="hidden md:inline">Add</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="
                  h-9
                  border-white/10
                  bg-neutral-900
                  text-white/80
                  hover:bg-neutral-800 hover:text-white
                "
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 rounded-full ring-1 ring-white/10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
