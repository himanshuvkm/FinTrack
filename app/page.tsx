"use client";
import Herosection from "@/components/compo/herosection";
import {
  howItWorksData,
  featuresData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import Link from "next/link";
import FintrackFooter from "@/components/compo/footer";
import { motion } from "framer-motion";

import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1],
    },
  },
};


export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      <Herosection />

      {/* Stats Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Animated background blob */}
        <motion.div
          className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-200 to-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-gray-100 hover:border-blue-200 transform-gpu"
              >
                <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Everything you need
              </span>
              <br />
              to manage your finances
            </h2>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Smart tools to help you track, save, and grow with confidence.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {featuresData.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex justify-center"
              >
                <Card
                  className="
            w-full max-w-xs 
            min-h-[300px]
            bg-white 
            border border-gray-200 
            rounded-2xl 
            shadow-sm 
            hover:shadow-xl 
            transition-all
            p-8
            text-center
            flex flex-col items-center
          "
                >
                  {/* Icon */}
                  <div
                    className="
              w-16 h-16 
              rounded-2xl 
              bg-gradient-to-br from-blue-600 to-green-500
              flex items-center justify-center
              text-white
              shadow-lg
              mb-6
            "
                  >
                    <div className="w-8 h-8">{feature.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

     {/* How It Works Section */}
      <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-500 text-lg">
              Financial freedom in 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connected Dashed Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-blue-100" />

            {howItWorksData.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="relative z-10 mb-8">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-50 flex items-center justify-center shadow-sm group-hover:border-blue-100 transition-colors duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white shadow-inner">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-lg md:text-xl">
              Trusted by thousands of happy users
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonialsData.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-blue-200 shadow-lg">
                  <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-gray-900 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-base text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic leading-relaxed text-base">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-r from-blue-700 to-green-600">
        {/* Animated background to create dynamic effect */}
        <motion.div
          className="absolute inset-0 z-0 opacity-30"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
            backgroundImage:
              "linear-gradient(to right, #4A90E2, #50C878, #4A90E2)", // subtle internal gradient shift
          }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their finances
              smarter with Fintrack.
            </p>
            <Link href="/dashboard" passHref>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-gray-100 px-10 py-5 text-xl font-semibold rounded-full shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
            </Link>
            <p className="text-white/80 text-sm mt-4">
              No credit card required • 14-day free trial
            </p>
          </motion.div>
        </div>
      </section>
      <FintrackFooter />
    </div>
  );
}
