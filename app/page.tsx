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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  return (
    <main className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* ================= HERO ================= */}
      <Herosection />

      {/* ================= STATS ================= */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                variants={item}
                className="
                  rounded-xl
                  border border-slate-200 dark:border-slate-800
                  bg-white dark:bg-slate-900
                  px-6 py-8
                  text-center
                  shadow-sm
                "
              >
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Everything you need to manage money
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Thoughtfully designed tools to help you track, analyze,
              and improve your financial habits.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuresData.map((f, i) => (
              <motion.div key={i} variants={item}>
                <Card className="h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-28 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            How FinTrack works
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            {howItWorksData.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.12 
                }}
                className="space-y-4"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="py-28 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Trusted by real users
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:grid-cols-3"
          >
            {testimonialsData.map((t, i) => (
              <motion.div 
                key={i} 
                variants={item}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{t.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{t.quote}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-blue-950/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Take control of your finances
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Start using FinTrack today. No credit card required.
          </p>

          <div className="mt-10 flex justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="
                  h-12
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white
                  hover:from-indigo-700 hover:to-purple-700
                  px-8
                  shadow-lg shadow-indigo-500/25
                  transition-opacity duration-200
                  active:scale-95
                "
              >
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <FintrackFooter />
    </main>
  );
}
