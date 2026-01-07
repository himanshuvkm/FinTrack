"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "../ui/button";
import Heroimg from "@/public/hero.webp";

/* ------------------ Variants ------------------ */

const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const imageVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-screen flex items-center overflow-hidden
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      {/* ---------------- Animated Background Blobs ---------------- */}
      <motion.div
        className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ---------------- Content ---------------- */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-28">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12 text-center"
        >
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center">
            <span
              className="
                inline-flex items-center gap-2 rounded-full
                border border-indigo-200 dark:border-indigo-900/50
                bg-indigo-50 dark:bg-indigo-950/50
                px-4 py-2 text-xs font-semibold
                text-indigo-700 dark:text-indigo-400
              "
            >
              <Zap className="h-4 w-4" />
              AI-powered financial intelligence
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-title"
            variants={item}
            className="
              mx-auto max-w-4xl
              text-5xl md:text-7xl font-bold tracking-tight
              text-slate-900 dark:text-white
            "
          >
            Financial clarity,
            <br />
            built for everyday decisions
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={item}
            className="
              mx-auto max-w-2xl
              text-lg md:text-xl leading-relaxed
              text-slate-600 dark:text-slate-400
            "
          >
            FinTrack helps you track spending, understand cash flow,
            and make smarter financial decisions with calm, real-time insights.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="flex justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="
                  h-12 px-8 gap-2
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-700 hover:to-purple-700
                  text-white
                  shadow-lg shadow-indigo-500/25
                  active:scale-95
                "
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Feature Row */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-8 pt-4 text-sm"
          >
            <Feature
              icon={<TrendingUp className="h-4 w-4" />}
              label="Real-time analytics"
              color="emerald"
            />
            <Feature
              icon={<Shield className="h-4 w-4" />}
              label="Bank-grade security"
              color="indigo"
            />
            <Feature
              icon={<Zap className="h-4 w-4" />}
              label="Smart insights"
              color="amber"
            />
          </motion.div>

          {/* Image */}
          <motion.div
            variants={imageVariant}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            <div
              className="
                relative overflow-hidden rounded-2xl
                border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900
                shadow-2xl shadow-slate-900/10
              "
            >
              <Image
                src={Heroimg}
                width={1280}
                height={720}
                priority
                alt="FinTrack dashboard showing analytics and transactions"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------ Feature Pill ------------------ */

function Feature({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: "emerald" | "indigo" | "amber";
}) {
  return (
    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
      <div
        className={`
          flex h-8 w-8 items-center justify-center rounded-lg
          bg-${color}-100 dark:bg-${color}-900/30
          text-${color}-600 dark:text-${color}-400
        `}
      >
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
}
