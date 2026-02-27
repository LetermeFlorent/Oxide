import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { Button } from "../ui/Button";
import { t } from "../../i18n";
import { motion, useScroll } from "framer-motion";

interface NavProps {
  view: "overview" | "download";
  setView: (v: "overview" | "download") => void;
}

export const Nav: React.FC<NavProps> = ({ view, setView }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none"
    >
      <nav className={`pointer-events-auto flex items-center gap-4 px-2 pl-6 py-2 rounded-full transition-all duration-500 ease-out border ${
        isScrolled ? "bg-white/80 backdrop-blur-xl border-black/5 shadow-lg shadow-black/5 scale-[0.98]" : "bg-transparent border-transparent scale-100"
      }`}>
        <div className="flex items-center gap-2 cursor-pointer pr-4 border-r border-black/5" onClick={() => setView("overview")}>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Oxide
          </span>
          <span className="text-[10px] font-mono bg-black/5 px-1.5 py-0.5 rounded text-gray-500">{t("nav.beta")}</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Button variant="ghost" size="sm" onClick={() => setView("overview")} className="text-gray-600 hover:text-black hover:bg-black/5 rounded-full px-4 h-8 transition-colors">
            {t("nav.overview")}
          </Button>
          <a href="#performance" className="text-gray-600 hover:text-black hover:bg-black/5 rounded-full px-4 py-1.5 h-8 text-sm inline-flex items-center transition-colors">
            {t("nav.performance")}
          </a>
          <a href="#tech" className="text-gray-600 hover:text-black hover:bg-black/5 rounded-full px-4 py-1.5 h-8 text-sm inline-flex items-center transition-colors">
            {t("nav.architecture")}
          </a>
        </div>

        <div className="flex items-center gap-2 pl-2">
          <a href="https://github.com/LetermeFlorent/Oxide" className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-black/5 rounded-full">
            <Github size={18} />
          </a>
          <Button 
            size="sm" 
            className="rounded-full px-5 h-8 text-xs font-semibold bg-black text-white hover:bg-gray-800 shadow-md transition-all active:scale-95"
            onClick={() => setView(view === "download" ? "overview" : "download")}
          >
            {view === "download" ? t("nav.back") : t("nav.download")}
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};
