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
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function HomePage() {
  return (
    <main className="bg-neutral-950 text-white">
      {/* ================= HERO ================= */}
      <Herosection />

      {/* ================= STATS ================= */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                variants={item}
                className="
                  rounded-xl
                  border border-white/10
                  bg-neutral-900
                  px-6 py-8
                  text-center
                "
              >
                <p className="text-3xl font-semibold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20 max-w-3xl"
          >
            <h2 className="text-4xl font-semibold">
              Everything you need to manage money
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Thoughtfully designed tools to help you track, analyze,
              and improve your financial habits.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuresData.map((f, i) => (
              <motion.div key={i} variants={item}>
                <Card className="h-full border border-white/10 bg-neutral-900">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800 text-white">
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="text-sm text-white/60">
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
      <section className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-4xl font-semibold">
            How Fintrack works
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            {howItWorksData.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="space-y-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-800">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-white/60">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-4xl font-semibold">
            Trusted by real users
          </h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {testimonialsData.map((t, i) => (
              <motion.div key={i} variants={item}>
                <Card className="h-full border border-white/10 bg-neutral-900">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 font-semibold">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-xs text-white/50">
                          {t.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-sm text-white/70">
                      “{t.quote}”
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-28 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-semibold">
            Take control of your finances
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Start using Fintrack today. No credit card required.
          </p>

          <div className="mt-10 flex justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="
                  h-12
                  bg-white
                  px-8
                  text-black
                  hover:bg-white/90
                "
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FintrackFooter />
    </main>
  );
}
