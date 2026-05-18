'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import Heroimg from "@/public/hero.webp"
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Herosection() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* Thin horizontal rule top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-stone-200" />

      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle, #c8c4bb 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Warm ink blob — top right */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[#e8f0e4] opacity-60 blur-[80px]" />
      {/* Terracotta blob — bottom left */}
      <div className="absolute bottom-0 -left-24 w-[360px] h-[360px] rounded-full bg-[#f5e8df] opacity-50 blur-[70px]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-16">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-[#5a7a52]/30 bg-[#5a7a52]/10 px-4 py-2 text-xs font-semibold text-[#3d5c35] uppercase tracking-widest mb-10"
          >
            <Zap className="w-3 h-3" />
            AI-Powered Financial Intelligence
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.92] tracking-tighter text-[#1a1a16] mb-6"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            YOUR MONEY,
            <br />
            <em className="not-italic text-[#5a7a52]">FINALLY</em>
            <br />
            UNDERSTOOD.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-[#6b6860] text-lg md:text-xl max-w-xl leading-relaxed mb-10"
          >
            Track, analyse, and optimise your spending with real-time AI insights
            and smart automation. Built for people who take their finances seriously.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-col sm:flex-row gap-3 mb-14"
          >
            <Link href="/dashboard">
              <Button className="px-8 py-6 text-sm font-bold bg-[#1a1a16] hover:bg-[#2e2e28] text-[#faf9f6] rounded-none border-0 transition-all tracking-wide">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                className="px-8 py-6 text-sm font-bold rounded-none border border-[#1a1a16]/20 text-[#1a1a16] hover:bg-[#1a1a16]/5 bg-transparent transition-all tracking-wide"
              >
                See Features
              </Button>
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.46 }}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            {[
              { icon: <TrendingUp className="w-4 h-4" />, text: "Real-time Analytics", color: "text-[#5a7a52]" },
              { icon: <Shield className="w-4 h-4" />, text: "Bank-level Security", color: "text-[#c0714a]" },
              { icon: <Zap className="w-4 h-4" />, text: "Smart Insights", color: "text-[#5a7a52]" },
            ].map((pill, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm font-medium ${pill.color}`}>
                {pill.icon}
                <span className="text-[#6b6860]">{pill.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.56 }}
            className="w-full relative"
          >
            <div className="relative mx-auto max-w-5xl border border-stone-300 bg-white p-1.5 shadow-[0_32px_80px_rgba(26,26,22,0.12)]">
              {/* Corner accents */}
              <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-[#5a7a52]" />
              <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-[#5a7a52]" />
              <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-[#c0714a]" />
              <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-[#c0714a]" />

              <Image
                src={Heroimg}
                width={1280}
                height={720}
                alt="Fintrack Dashboard"
                className="w-full h-auto"
                priority
              />

              {/* Fade-out bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#faf9f6] to-transparent" />
            </div>

            {/* Floating stat cards */}
            <motion.div
              className="absolute left-4 top-1/4 hidden lg:block"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <div className="border border-stone-200 bg-white shadow-sm p-5 w-44">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#5a7a52] rounded-full" />
                  <span className="text-[10px] text-[#9a958e] uppercase tracking-widest font-semibold">Saved</span>
                </div>
                <p className="text-2xl font-black text-[#1a1a16]" style={{ fontFamily: 'Georgia, serif' }}>$12,450</p>
                <p className="text-xs text-[#5a7a52] mt-1 font-medium">↑ 18% this month</p>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-4 top-1/3 hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <div className="border border-stone-200 bg-white shadow-sm p-5 w-44">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#c0714a] rounded-full" />
                  <span className="text-[10px] text-[#9a958e] uppercase tracking-widest font-semibold">Security</span>
                </div>
                <p className="text-2xl font-black text-[#1a1a16]" style={{ fontFamily: 'Georgia, serif' }}>100%</p>
                <p className="text-xs text-[#c0714a] mt-1 font-medium">Encrypted & secure</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}