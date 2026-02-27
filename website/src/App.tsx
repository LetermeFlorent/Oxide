import React, { useState } from "react";
import { Nav } from "./components/layout/Nav";
import { Hero } from "./components/home/Hero";
import { BentoGrid } from "./components/home/BentoGrid";
import { TechSpecs } from "./components/home/TechSpecs";
import { Footer } from "./components/layout/Footer";
import { ReleaseSelector } from "./components/download/ReleaseSelector";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "./i18n";

const App: React.FC = () => {
  const [view, setView] = useState<"overview" | "download">("overview");

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Global Background Pattern */}
      <div className="fixed inset-0 bg-dot-pattern pointer-events-none opacity-[0.4]" />
      
      <Nav view={view} setView={setView} />
      
      <AnimatePresence mode="wait">
        {view === "overview" ? (
          <motion.main 
            key="overview" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <Hero onDownload={() => setView("download")} />
            
            <BentoGrid />
            <TechSpecs />
          </motion.main>
        ) : (
          <motion.main 
            key="download" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            className="pt-40 pb-24 px-6 min-h-screen relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-6xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-500">
                {t("download.title")}
              </h2>
              <p className="text-gray-500 font-medium uppercase tracking-[0.2em] text-sm">
                {t("download.subtitle")}
              </p>
            </div>
            <ReleaseSelector />
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};
export default App;
