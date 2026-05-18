import React from "react";
import {
  SignInButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { LuWallet, LuLayoutDashboard, LuPen } from "react-icons/lu";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-[#1a1a16]/10 bg-[#faf9f6]/90 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-black tracking-tight text-[#1a1a16]"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Fin<em className="not-italic text-[#5a7a52]">track</em>
          </span>
        </Link>

        {/* Navigation Links (Signed Out Only) */}
        <div className="hidden md:flex items-center space-x-8">
          <Show when="signed-out">
            <a
              href="#features"
              className="text-[#6b6860] hover:text-[#1a1a16] text-sm font-medium tracking-wide transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-[#6b6860] hover:text-[#1a1a16] text-sm font-medium tracking-wide transition-colors"
            >
              Testimonials
            </a>
          </Show>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">

          {/* Signed In Buttons */}
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border border-[#1a1a16]/20 bg-transparent hover:bg-[#1a1a16]/5 text-[#1a1a16] rounded-none text-sm font-semibold tracking-wide transition-all flex items-center gap-2"
              >
                <LuLayoutDashboard size={16} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transactions/create">
              <Button
                className="flex items-center gap-2 bg-[#1a1a16] hover:bg-[#2e2e28] text-[#faf9f6] rounded-none border-0 text-sm font-semibold tracking-wide transition-all"
              >
                <LuPen size={16} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </Show>

          {/* Signed Out Button */}
          <Show when="signed-out">
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                className="bg-[#1a1a16] hover:bg-[#2e2e28] text-[#faf9f6] rounded-none border-0 text-sm font-semibold tracking-wide transition-all px-6"
              >
                Login
              </Button>
            </SignInButton>
          </Show>

          {/* User Avatar */}
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 ring-1 ring-[#5a7a52]/40 hover:ring-[#5a7a52] transition-all rounded-full",
                },
              }}
            />
          </Show>

        </div>
      </nav>
    </header>
  );
}
