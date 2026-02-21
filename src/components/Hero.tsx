/**
 * Project: Oxide Website
 * Responsibility: Hero Section with Terminal-Oriented IDE focus
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const Hero: React.FC<{ onDownload: () => void }> = ({ onDownload }) => (
  <header id="hero" className="pt-40 pb-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <motion.h1 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl md:text-[96px] font-black leading-[1.05] tracking-tighter text-[#1d1d1f] mb-8">
        Efficiency <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">in every pixel.</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl md:text-2xl text-black/60 font-semibold mb-12 max-w-3xl mx-auto leading-tight">
        A lightweight IDE designed for command-line mastery. <br/> Native terminal power meets modern engineering.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center gap-8">
        <button onClick={onDownload} className="bg-[#0071e3] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0077ed] transition-all">
          Download Oxide
        </button>
      </motion.div>
    </div>
  </header>
);
