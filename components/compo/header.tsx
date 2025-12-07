import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Wallet, LayoutDashboard, PenBox } from 'lucide-react';
import { Button } from "../ui/button";
import Link from "next/link";
import { checkUser } from "@/lib/checkUser";

export default async function Header() {
  await checkUser();
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Fintrack
            </span>
          </div>
        </Link>

        {/* Navigation Links (Signed Out Only) */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
              Features
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">

          {/* Signed In Buttons */}
          <SignedIn>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-gray-300 hover:border-blue-500 hover:bg-blue-50/60 
                text-gray-700 font-medium rounded-xl transition-all flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transactions/create">
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 
                text-white rounded-xl hover:from-blue-700 hover:to-green-600 
                shadow-md hover:shadow-lg transition-all font-medium"
              >
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

          </SignedIn>

          {/* Signed Out Buttons */}
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button
                variant="outline"
                className="border-gray-300 hover:border-blue-500 hover:bg-blue-50/60 
                text-gray-700 font-medium rounded-xl transition-all"
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          {/* User Avatar */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 ring-1 ring-gray-200 hover:ring-blue-500 transition-all rounded-full",
                },
              }}
            />
          </SignedIn>

        </div>
      </nav>
    </header>
  );
};
