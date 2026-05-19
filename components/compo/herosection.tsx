"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

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
          backgroundSize: "32px 32px",
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
            Track, analyse, and optimise your spending with real-time AI
            insights and smart automation. Built for people who take their
            finances seriously.
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
              {
                icon: <TrendingUp className="w-4 h-4" />,
                text: "Real-time Analytics",
                color: "text-[#5a7a52]",
              },
              {
                icon: <Shield className="w-4 h-4" />,
                text: "Bank-level Security",
                color: "text-[#c0714a]",
              },
              {
                icon: <Zap className="w-4 h-4" />,
                text: "Smart Insights",
                color: "text-[#5a7a52]",
              },
            ].map((pill, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm font-medium ${pill.color}`}
              >
                {pill.icon}
                <span className="text-[#6b6860]">{pill.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero Visual Mockups */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.56 }}
            className="w-full relative h-[400px] sm:h-[500px] md:h-[600px] mt-10 max-w-5xl mx-auto"
          >
            {/* Main Center Dashboard View */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[90%] md:w-[800px] h-[350px] md:h-[450px] bg-white border border-stone-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-10">
              {/* Header */}
              <div className="h-12 md:h-14 border-b border-stone-100 flex items-center px-4 md:px-6 justify-between bg-stone-50/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-[#1a1a16] rounded-full flex items-center justify-center text-white font-bold text-[10px] md:text-xs">
                    FT
                  </div>
                  <div className="font-semibold text-xs md:text-sm text-[#1a1a16]">
                    Overview
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                </div>
              </div>
              {/* Body */}
              <div className="flex-1 p-4 md:p-8 bg-[#faf9f6]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-white p-4 md:p-5 rounded-xl border border-stone-100 shadow-sm">
                    <div className="text-xs md:text-sm text-stone-500 mb-1">
                      Total Balance
                    </div>
                    <div
                      className="text-xl md:text-3xl font-black text-[#1a1a16]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      $124,500.00
                    </div>
                    <div className="text-[10px] md:text-xs text-[#5a7a52] mt-2 font-medium bg-[#5a7a52]/10 inline-block px-2 py-1 rounded">
                      + 2.4% this month
                    </div>
                  </div>
                  <div className="bg-white p-4 md:p-5 rounded-xl border border-stone-100 shadow-sm">
                    <div className="text-xs md:text-sm text-stone-500 mb-1">
                      Monthly Spending
                    </div>
                    <div
                      className="text-xl md:text-3xl font-black text-[#1a1a16]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      $4,250.00
                    </div>
                    <div className="text-[10px] md:text-xs text-[#c0714a] mt-2 font-medium bg-[#c0714a]/10 inline-block px-2 py-1 rounded">
                      - 1.2% from last month
                    </div>
                  </div>
                  <div className="hidden md:flex bg-white p-5 rounded-xl border border-stone-100 shadow-sm flex-col justify-between">
                    <div className="text-sm text-stone-500 mb-1">
                      Quick Actions
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="flex-1 bg-[#1a1a16] text-white text-center py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-[#2a2a26] transition-colors">
                        Send
                      </div>
                      <div className="flex-1 bg-stone-100 text-[#1a1a16] text-center py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-stone-200 transition-colors">
                        Receive
                      </div>
                    </div>
                  </div>
                </div>
                {/* Chart Mockup */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 h-44 flex items-end justify-between gap-2 overflow-hidden">
                  {[40, 60, 45, 80, 55, 90, 75, 100, 65, 85].map((h, i) => (
                    <div
                      key={i}
                      className="relative flex-1 h-full flex items-end group"
                    >
                      {/* Background Bar */}
                      <div className="absolute inset-0 rounded-t-xl bg-stone-100/80" />

                      {/* Active Fill */}
                      <div
                        className="relative w-full rounded-t-xl bg-gradient-to-t from-[#5a7a52] to-[#7ca96f] transition-all duration-1000 ease-out group-hover:opacity-90"
                        style={{
                          height: `${h}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlapping Card 1 - Activity */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="hidden md:block absolute left-[1%] top-[245px] w-[300px] bg-white border border-stone-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl p-5 z-20"
            >
              <div className="font-semibold text-[#1a1a16] mb-4">
                Recent Activity
              </div>
              <div className="space-y-4">
                {[
                  {
                    name: "Apple Store",
                    cat: "Electronics",
                    amt: "-$999.00",
                    date: "Today",
                  },
                  {
                    name: "Whole Foods",
                    cat: "Groceries",
                    amt: "-$142.50",
                    date: "Yesterday",
                  },
                  {
                    name: "Salary",
                    cat: "Income",
                    amt: "+$5,200.00",
                    date: "Mon",
                    income: true,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${item.income ? "bg-[#5a7a52]/20 text-[#5a7a52]" : "bg-stone-100 text-stone-600"}`}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#1a1a16]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {item.cat} • {item.date}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-[13px] font-bold ${item.income ? "text-[#5a7a52]" : "text-[#1a1a16]"}`}
                    >
                      {item.amt}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Overlapping Card 2 - Insights */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="hidden md:block absolute right-[2%] top-[245px] w-[260px] bg-[#090909] text-white border border-stone-800 shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-2xl p-6 z-20"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#c0714a] rounded-full" />
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                  AI Insight
                </span>
              </div>
              <p className="text-[13px] leading-relaxed mb-5 text-stone-300">
                You've spent <strong className="text-white">$320</strong> more
                on dining out this month compared to last. Consider cutting back
                to hit your savings goal!
              </p>
              <button className="w-full py-2.5 bg-white text-[#1a1a16] rounded-lg text-xs font-bold hover:bg-stone-200 transition-colors">
                View Details
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
