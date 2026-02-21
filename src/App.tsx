/**
 * Project: Oxide Website
 * Responsibility: Main Application Orchestrator
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React, { useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { BentoGrid } from "./components/BentoGrid";
import { TechSpecs } from "./components/TechSpecs";
import { Footer } from "./components/Footer";
import { ReleaseSelector } from "./components/ReleaseSelector";
import { motion, AnimatePresence } from "framer-motion";

const App: React.FC = () => {
  const [view, setView] = useState<"overview" | "download">("overview");
  return (
    <div className="min-h-screen bg-white">
      <Nav view={view} setView={setView} />
      <AnimatePresence mode="wait">
        {view === "overview" ? (
          <motion.main key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero onDownload={() => setView("download")} />
            <section className="px-6 py-10"><div className="max-w-6xl mx-auto rounded-[40px] shadow-2xl overflow-hidden border border-black/5"><img src="/screenshot.png" alt="Oxide" className="w-full h-auto" /></div></section>
            <BentoGrid /><TechSpecs />
          </motion.main>
        ) : (
          <motion.main key="download" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-32 pb-24 px-6 min-h-screen bg-[#f5f5f7]">
            <div className="max-w-4xl mx-auto text-center mb-16"><h2 className="text-5xl font-black mb-4 tracking-tighter">Get the latest build.</h2><p className="text-black/40 font-bold uppercase tracking-widest text-xs">Direct binaries from GitHub</p></div>
            <ReleaseSelector />
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};
export default App;
