"use client";

import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";


export default function FintrackFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* ---------------- Social links ---------------- */}
          <nav
            aria-label="Social links"
            className="flex gap-3"
          >
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "#", label: "Email" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-lg
                  border border-slate-200 dark:border-slate-800
                  bg-slate-50 dark:bg-slate-900
                  text-slate-600 dark:text-slate-400
                  transition-transform duration-200
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  hover:border-indigo-200 dark:hover:border-indigo-800
                  hover:scale-110
                "
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </nav>

          {/* ---------------- Legal / links ---------------- */}
          <motion.div className="space-x-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              © {currentYear} FinTrack
            </span>

            <span className="text-slate-300 dark:text-slate-700">·</span>

            <a
              href="#"
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Privacy Policy
            </a>

            <span className="text-slate-300 dark:text-slate-700">·</span>

            <a
              href="#"
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Terms of Service
            </a>
          </motion.div>

          {/* ---------------- Tagline ---------------- */}
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built for calm, focused financial tracking
          </p>
        </div>
      </div>
    </footer>
  );
}
