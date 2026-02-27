import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { Button } from "../ui/Button";
import { t } from "../../i18n";
import { motion, useScroll } from "framer-motion";

interface NavProps {
  view: "overview" | "download" | "guide";
  setView: (v: "overview" | "download" | "guide") => void;
}

export const Nav: React.FC<NavProps> = ({ view, setView }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  const handleOverviewClick = () => {
    if (view !== "overview") {
      setView("overview");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (view !== "overview") {
      setView("overview");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
    >
      <nav className={`pointer-events-auto flex items-center gap-2 md:gap-4 px-3 md:px-6 py-2 rounded-full transition-all duration-500 border ${
        isScrolled ? "bg-white/80 backdrop-blur-xl border-black/5 shadow-lg shadow-black/5" : "bg-transparent border-transparent"
      }`}>
        <div className="flex items-center gap-2 cursor-pointer pr-2 md:pr-4 border-r border-black/5" onClick={handleOverviewClick}>
          <span className="text-sm md:text-lg font-bold tracking-tight text-gray-900">Oxide</span>
          <span className="hidden sm:inline-block text-[10px] font-mono bg-black/5 px-1.5 py-0.5 rounded text-gray-500">v1.4.0</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleOverviewClick} className={`rounded-full px-3 h-8 text-xs md:text-sm ${view === 'overview' ? 'bg-black/5 text-black' : 'text-gray-500'}`}>
            {t("nav.overview")}
          </Button>
          <button onClick={(e) => handleNavClick(e, "features")} className="hidden lg:block px-3 h-8 text-sm font-medium text-gray-500 hover:text-black transition-colors">
            {t("nav.performance")}
          </button>
          <button onClick={(e) => handleNavClick(e, "tech")} className="hidden lg:block px-3 h-8 text-sm font-medium text-gray-500 hover:text-black transition-colors">
            {t("nav.architecture")}
          </button>
          <Button variant="ghost" size="sm" onClick={() => setView("guide")} className={`rounded-full px-3 h-8 text-xs md:text-sm ${view === 'guide' ? 'bg-black/5 text-black' : 'text-gray-500'}`}>
            {t("nav.guide")}
          </Button>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-black/5">
          <a href="https://github.com/LetermeFlorent/Oxide" className="text-gray-400 hover:text-black p-2"><Github size={18} /></a>
          <Button 
            size="sm" 
            className="rounded-full px-4 md:px-6 h-8 text-[10px] md:text-xs font-bold bg-black text-white"
            onClick={() => setView(view === "download" ? "overview" : "download")}
          >
            {view === "download" ? t("nav.back") : t("nav.download")}
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};
