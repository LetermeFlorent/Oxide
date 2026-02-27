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
    <div className="min-h-screen bg-background">
      <Nav view={view} setView={setView} />
      <AnimatePresence mode="wait">
        {view === "overview" ? (
          <motion.main key="o" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Hero onDownload={() => setView("download")} />
            <section className="px-6 py-10 max-w-6xl mx-auto"><div className="rounded-2xl shadow-2xl overflow-hidden border border-border/50"><img src="/screenshot.png" alt="Oxide" className="w-full h-auto" /></div></section>
            <BentoGrid /><TechSpecs />
          </motion.main>
        ) : (
          <motion.main key="d" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-32 pb-24 px-6 min-h-screen bg-muted/30">
            <div className="max-w-4xl mx-auto text-center mb-16"><h2 className="text-5xl font-extrabold mb-4 tracking-tighter">{t("download.title")}</h2><p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">{t("download.subtitle")}</p></div>
            <ReleaseSelector />
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};
export default App;
