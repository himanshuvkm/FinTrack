'use client'

import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FintrackFooter() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-white to-green-100 py-12  border-gray-200">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          {/* Social Icons */}
          <motion.div variants={itemVariants} className="flex gap-4">
            {[
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Mail, href: '#', label: 'Email' }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="bg-gradient-to-r from-blue-600 to-green-500 p-3 rounded-full text-white hover:shadow-lg transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright and Links */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} Fintrack. All rights reserved. |{' '}
              <motion.a
                href="#"
                className="text-blue-600 hover:text-green-500 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                style={{ display: 'inline-block' }}
              >
                Privacy Policy
              </motion.a>
              {' '}|{' '}
              <motion.a
                href="#"
                className="text-blue-600 hover:text-green-500 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                style={{ display: 'inline-block' }}
              >
                Terms of Service
              </motion.a>
            </p>
          </motion.div>

          {/* Made with love text */}
          <motion.div
            variants={itemVariants}
            className="text-xs text-gray-500"
          >
            Made with <span className="text-red-500">♥</span> for smarter financial management
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}