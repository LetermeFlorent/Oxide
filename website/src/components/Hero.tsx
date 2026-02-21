/**
 * Project: Oxide Website
 * Responsibility: Impactful Landing Page Hero Section
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const Hero: React.FC<{ onDownload: () => void }> = ({ onDownload }) => (
  <header id="hero" className="pt-40 pb-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl md:text-[96px] font-black leading-[1.05] tracking-tighter text-[#1d1d1f] mb-8">
        Efficiency <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">in every pixel.</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-black/60 font-semibold mb-12 max-w-3xl mx-auto leading-tight">
        The ultimate developer environment that bridges native power and web elegance. Built for those who demand excellence.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center">
        <button onClick={onDownload} className="flex items-center gap-2 text-[#0066cc] text-xl font-bold hover:underline group">
          Download Oxide <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  </header>
);
