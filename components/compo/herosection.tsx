"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "../ui/button";
import Heroimg from "@/public/hero.webp";

export default function HeroSection() {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const image: Variants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.3 },
    },
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-screen items-center overflow-hidden bg-neutral-950"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-10 text-center"
        >
          {/* ---------------- Badge ---------------- */}
          <motion.div variants={item} className="flex justify-center">
            <span className="
              inline-flex items-center gap-2
              rounded-full
              border border-white/10
              bg-neutral-900
              px-4 py-2
              text-xs font-medium text-white/70
            ">
              <Zap className="h-4 w-4 text-emerald-400" />
              AI-powered financial intelligence
            </span>
          </motion.div>

          {/* ---------------- Heading ---------------- */}
          <motion.h1
            id="hero-title"
            variants={item}
            className="
              mx-auto max-w-4xl
              text-4xl md:text-6xl
              font-semibold tracking-tight
              text-white
            "
          >
            Financial clarity,
            <br />
            built for everyday decisions
          </motion.h1>

          {/* ---------------- Description ---------------- */}
          <motion.p
            variants={item}
            className="
              mx-auto max-w-2xl
              text-base md:text-lg
              leading-relaxed
              text-white/60
            "
          >
            Fintrack helps you track spending, understand cash flow,
            and make smarter financial decisions with calm, real-time insights.
          </motion.p>

          {/* ---------------- CTA ---------------- */}
          <motion.div variants={item} className="flex justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="
                  h-12 gap-2
                  bg-white
                  px-8
                  text-black
                  hover:bg-white/90
                "
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* ---------------- Feature row ---------------- */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-8 pt-4 text-sm"
          >
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Real-time analytics
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Shield className="h-4 w-4 text-indigo-400" />
              Bank-grade security
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Zap className="h-4 w-4 text-amber-400" />
              Smart insights
            </div>
          </motion.div>

          {/* ---------------- Image ---------------- */}
          <motion.div
            variants={image}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div
              className="
                relative overflow-hidden rounded-2xl
                border border-white/10
                bg-neutral-900
              "
            >
              <Image
                src={Heroimg}
                width={1280}
                height={720}
                priority
                alt="Fintrack dashboard showing analytics and transactions"
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
