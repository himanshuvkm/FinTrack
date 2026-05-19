"use client";

import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FintrackFooter() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#1a1a16]/10 bg-[#faf9f6] py-12">
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle, #c8c4bb 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Olive blob */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#e8f0e4] opacity-50 blur-[60px]" />
      {/* Terracotta blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#f5e8df] opacity-40 blur-[60px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <span
              className="text-3xl font-black tracking-tight text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Fin<em className="not-italic text-[#5a7a52]">track</em>
            </span>
          </motion.div>

          {/* Divider line with accents */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 w-full max-w-xs"
          >
            <div className="flex-1 h-px bg-[#5a7a52]/30" />
            <div className="w-1.5 h-1.5 bg-[#5a7a52] rounded-full" />
            <div className="flex-1 h-px bg-[#5a7a52]/30" />
          </motion.div>

          {/* Social Icons */}
          <motion.div variants={itemVariants} className="flex gap-4">
            {[
              {
                icon: FaGithub,
                href: "https://github.com/himanshuvkm",
                label: "GitHub",
              },
              {
                icon: FaTwitter,
                href: "https://twitter.com/himanshu_9148",
                label: "Twitter",
              },
              {
                icon: FaLinkedin,
                href: "https://linkedin.com/in/himanshuvkm",
                label: "LinkedIn",
              },
              {
                icon: FaEnvelope,
                href: "mailto:himanshuvkm252@gmail.com",
                label: "Email",
              },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 border border-[#1a1a16]/20 bg-white text-[#6b6860] hover:border-[#5a7a52] hover:text-[#5a7a52] hover:bg-[#5a7a52]/5 transition-all flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </motion.div>

          {/* Links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6"
          >
            {["Privacy Policy", "Terms of Service", "Help"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="text-xs text-[#9a958e] hover:text-[#3d5c35] font-medium tracking-wide uppercase transition-colors"
                whileHover={{ scale: 1.03 }}
                style={{ display: "inline-block" }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-[#9a958e] text-xs tracking-wide">
              © {currentYear} Fintrack. All rights reserved.
            </p>
            <p className="text-[#c8c4bb] text-xs mt-1">
              Built for people who take their finances seriously.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
