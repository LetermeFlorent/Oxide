import React from "react";
import { Button } from "../ui/Button";
import { t } from "../../i18n";
import { Download, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export const Hero: React.FC<{ onDownload: () => void; onGuide: () => void }> = ({ onDownload, onGuide }) => (
  <section id="overview" className="relative pt-32 pb-24 px-6 md:px-0 max-w-7xl mx-auto overflow-hidden text-center flex flex-col items-center">

    {/* Subtle Gradient Spot */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-[100px] opacity-60 pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center gap-6 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/50 backdrop-blur-sm pl-2 pr-3 py-1 shadow-sm hover:shadow-md transition-shadow cursor-default"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{t("hero.version")}</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-5xl md:text-7xl lg:text-8xl leading-[1.1] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black via-gray-800 to-gray-500 max-w-4xl mx-auto drop-shadow-sm py-2"
      >
        {t("hero.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-500 max-w-2xl font-medium tracking-tight leading-relaxed"
      >
        {t("hero.subtitle")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-8"
      >
        <Button
          size="lg"
          onClick={onDownload}
          className="rounded-full h-12 px-8 text-base bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-xl shadow-black/10 transition-all duration-300"
        >
          {t("hero.cta")} <Download className="ml-2 w-4 h-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onGuide}
          className="rounded-full h-12 px-8 text-base border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-black hover:border-gray-300 transition-all duration-300"
        >
          {t("hero.docs")} <BookOpen className="ml-2 w-4 h-4 text-gray-400" />
        </Button>
      </motion.div>

      {/* Code Badge Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 relative group perspective-[2000px]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          e.currentTarget.style.setProperty('--x', `${x}px`);
          e.currentTarget.style.setProperty('--y', `${y}px`);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.setProperty('--x', `0px`);
          e.currentTarget.style.setProperty('--y', `0px`);
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <motion.div
          className="relative rounded-2xl border border-black/10 shadow-2xl overflow-hidden bg-white max-w-5xl mx-auto transition-transform duration-200 ease-out"
          style={{
            transform: "rotateY(calc(var(--x) * 0.02deg)) rotateX(calc(var(--y) * -0.02deg))",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle at calc(50% + var(--x)) calc(50% + var(--y)), rgba(255,255,255,0.1) 0%, transparent 40%)"
            }}
          />
          <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 relative z-10">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <img src="/terminal-overview.png" alt="Oxide Welcome Screen" className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </motion.div>
    </div>
  </section>
);
