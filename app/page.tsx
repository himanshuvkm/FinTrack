"use client";

import Herosection from "@/components/compo/herosection";
import FintrackFooter from "@/components/compo/footer";
import {
  howItWorksData,
  featuresData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0, 0, 0.58, 1] },
  },
};

/* ─── Dot grid backdrop shared across sections ─────────────── */
function DotGrid() {
  return (
    <div
      className="absolute inset-0 opacity-[0.25] pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle, #c8c4bb 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/* ─── Section label ─────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 border border-[#5a7a52]/30 bg-[#5a7a52]/10 px-4 py-2 text-xs font-semibold text-[#3d5c35] uppercase tracking-widest mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-[#5a7a52]" />
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Herosection />

      {/* ── Stats Section ────────────────────────────────────── */}
      <section className="relative py-20 bg-[#1a1a16] overflow-hidden">
        <DotGrid />

        {/* Olive glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#5a7a52] opacity-10 blur-[80px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Thin rule top */}
          <div className="flex items-center gap-4 mb-14">
            <div className="flex-1 h-px bg-[#5a7a52]/20" />
            <span className="text-xs font-semibold text-[#5a7a52] uppercase tracking-widest">
              By the numbers
            </span>
            <div className="flex-1 h-px bg-[#5a7a52]/20" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative border border-[#5a7a52]/20 bg-[#5a7a52]/5 p-8 text-center group hover:border-[#5a7a52]/50 transition-all"
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#5a7a52]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#c0714a]" />

                <div
                  className="text-4xl md:text-5xl font-black text-[#faf9f6] mb-2 tracking-tight"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-[#9a958e] text-sm font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────── */}
      <section id="features" className="relative py-24 bg-[#faf9f6] overflow-hidden">
        <DotGrid />

        {/* Olive blob top right */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#e8f0e4] opacity-70 blur-[70px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <SectionLabel>Features</SectionLabel>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tighter text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Everything you need
              <br />
              <em className="not-italic text-[#5a7a52]">to master</em> your finances
            </h2>
            <p className="mt-4 text-[#6b6860] text-lg max-w-xl mx-auto leading-relaxed">
              Smart tools to help you track, save, and grow with confidence.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuresData.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative border border-[#e4e1db] bg-white p-8 group hover:border-[#5a7a52]/40 hover:shadow-lg transition-all"
              >
                {/* Top stripe on hover */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-[#5a7a52] opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#5a7a52]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c0714a]" />

                {/* Icon */}
                <div className="w-12 h-12 border border-[#5a7a52]/30 bg-[#e8f0e4] flex items-center justify-center text-[#5a7a52] mb-6 group-hover:scale-105 transition-transform">
                  <div className="w-6 h-6">{feature.icon}</div>
                </div>

                {/* Content */}
                <h3
                  className="text-lg font-bold text-[#1a1a16] mb-3 tracking-tight"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-[#6b6860] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works Section ──────────────────────────────── */}
      <section className="relative py-24 bg-white border-y border-[#e4e1db] overflow-hidden">
        <DotGrid />

        {/* Terracotta blob */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#f5e8df] opacity-60 blur-[60px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <SectionLabel>How it works</SectionLabel>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tighter text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Financial freedom
              <br />
              in <em className="not-italic text-[#5a7a52]">3 simple steps</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Dashed connector */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px border-t-2 border-dashed border-[#5a7a52]/20" />

            {howItWorksData.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.55 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step circle */}
                <div className="relative z-10 mb-8">
                  <div className="w-20 h-20 border border-[#e4e1db] bg-white flex items-center justify-center shadow-sm group-hover:border-[#5a7a52]/30 transition-colors">
                    <div className="w-12 h-12 bg-[#1a1a16] flex items-center justify-center text-[#faf9f6]">
                      <div className="w-6 h-6">{step.icon}</div>
                    </div>
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#5a7a52] flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                </div>

                <h3
                  className="text-lg font-bold text-[#1a1a16] mb-3 tracking-tight"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#6b6860] text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ──────────────────────────────── */}
      <section id="testimonials" className="relative py-24 bg-[#faf9f6] overflow-hidden">
        <DotGrid />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#e8f0e4] opacity-50 blur-[60px]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <SectionLabel>Testimonials</SectionLabel>
            <h2
              className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tighter text-[#1a1a16]"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              What our users say
            </h2>
            <p className="mt-4 text-[#6b6860] text-lg">
              Trusted by thousands of people who take their finances seriously.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="relative border border-[#e4e1db] bg-white p-8 group hover:border-[#5a7a52]/40 hover:shadow-lg transition-all"
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#5a7a52]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#c0714a]" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#5a7a52] text-[#5a7a52]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#1a1a16] text-sm leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-[#f0ede8] pt-5">
                  <div
                    className="w-10 h-10 bg-[#1a1a16] flex items-center justify-center text-[#faf9f6] font-bold text-sm"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[#1a1a16] text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-[#9a958e] text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────── */}
      <section className="relative py-28 bg-[#1a1a16] overflow-hidden">
        <DotGrid />

        {/* Olive glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#5a7a52] opacity-10 blur-[100px]" />
        {/* Terracotta glow */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#c0714a] opacity-10 blur-[80px]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-[#5a7a52]/40 bg-[#5a7a52]/10 px-4 py-2 text-xs font-semibold text-[#5a7a52] uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5a7a52]" />
              Get started today
            </div>

            <h2
              className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-[0.92] tracking-tighter text-[#faf9f6] mb-6"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Ready to take control
              <br />
              of your <em className="not-italic text-[#5a7a52]">finances?</em>
            </h2>

            <p className="text-[#9a958e] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of users already managing their money smarter with Fintrack.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <button className="w-full sm:w-auto px-10 py-4 bg-[#5a7a52] hover:bg-[#3d5c35] text-[#faf9f6] text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <button className="w-full sm:w-auto px-10 py-4 border border-[#faf9f6]/20 hover:border-[#faf9f6]/40 text-[#faf9f6] hover:bg-[#faf9f6]/5 text-sm font-bold tracking-wide uppercase transition-all flex items-center justify-center">
                    See Features
                  </button>
                </motion.div>
              </Link>
            </div>

            <p className="text-[#6b6860] text-xs mt-6 uppercase tracking-widest px-4">
              No credit card required · 14-day free trial
            </p>
          </motion.div>
        </div>
      </section>

      <FintrackFooter />
    </div>
  );
}