"use client";

import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function FintrackFooter() {
  const currentYear = new Date().getFullYear();

  const container = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <footer
      role="contentinfo"
      className="border-t border-white/5 bg-neutral-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6 text-center"
        >
          {/* ---------------- Social links ---------------- */}
          <motion.nav
            variants={item}
            aria-label="Social links"
            className="flex gap-3"
          >
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "#", label: "Email" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  border border-white/10
                  bg-neutral-900
                  text-white/70
                  transition-colors
                  hover:bg-neutral-800 hover:text-white
                "
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </motion.nav>

          {/* ---------------- Legal / links ---------------- */}
          <motion.div variants={item} className="space-x-3 text-sm">
            <span className="text-white/50">
              © {currentYear} Fintrack
            </span>

            <span className="text-white/30">·</span>

            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>

            <span className="text-white/30">·</span>

            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </motion.div>

          {/* ---------------- Tagline ---------------- */}
          <motion.p
            variants={item}
            className="text-xs text-white/40"
          >
            Built for calm, focused financial tracking
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
