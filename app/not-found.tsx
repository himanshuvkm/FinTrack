"use client"
import React from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * 404 / Not Found page component
 * - Tailwind CSS
 * - TypeScript
 * - Built for Next.js (pages or app router)
 *
 * Usage:
 * - pages/404.tsx  -> Next.js pages router
 * - app/404.tsx    -> Next.js app router (client component)
 */

const NotFoundPage: React.FC = () => {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 px-6">
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-4xl w-full bg-white shadow-lg rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
        aria-labelledby="not-found-heading"
      >
        {/* Left: Illustration */}
        <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
          {/* Simple, accessible SVG illustration */}
          <svg
            width="240"
            height="200"
            viewBox="0 0 240 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
          >
            <rect x="6" y="40" width="120" height="110" rx="12" fill="#F8FAFC" stroke="#E6EDF3" />
            <circle cx="180" cy="80" r="36" fill="#EFF6FF" stroke="#DBEAFE" />
            <path d="M28 70c10-18 36-30 60-26" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
            <text x="32" y="120" fontSize="42" fontWeight="700" fill="#1F2937">404</text>
          </svg>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-1/2">
          <h1 id="not-found-heading" className="text-4xl sm:text-5xl font-extrabold text-gray-900">Page not found</h1>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            We can’t find the page you’re looking for. It might have been moved or deleted, or maybe the URL is
            misspelled.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/" >
             <Button className="inline-flex items-center justify-center px-5 py-3 rounded-xl shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600 text-white hover:bg-indigo-700">Go back home</Button>
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            <p>
              Tip: If you typed the web address manually, double-check for typos. If you arrived here from a link, the
              link may be outdated.
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default NotFoundPage;
