import React, { useEffect, useState, useCallback } from "react";
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
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const updateScrolled = (latest: number) => setIsScrolled(latest > 50);
    const unsubscribe = scrollY.onChange(updateScrolled);
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    if (view !== "overview") {
      setActiveSection(view);
      return;
    }

    const observerOptions = {
      root: null,
      threshold: 0.3,
      rootMargin: "-20% 0px -20% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = ["overview", "features", "tech"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [view]);

  const handleOverviewClick = () => {
    if (view !== "overview") {
      setView("overview");
      setActiveSection("overview");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveSection(id);
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

  const NavItem = ({ id, label, onClick, isActive, hiddenMobile = false }: any) => (
    <button
      onClick={onClick}
      className={`relative px-3 h-8 text-xs md:text-sm font-medium transition-colors duration-300 z-10 ${
        isActive ? "text-black" : "text-gray-500 hover:text-gray-900"
      } ${hiddenMobile ? "hidden lg:block" : ""}`}
    >
      {isActive && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-black/5 rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {label}
    </button>
  );

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
          <NavItem 
            id="overview" 
            label={t("nav.overview")} 
            onClick={handleOverviewClick} 
            isActive={activeSection === "overview"} 
          />
          <NavItem 
            id="features" 
            label={t("nav.performance")} 
            onClick={(e: any) => handleNavClick(e, "features")} 
            isActive={activeSection === "features"}
            hiddenMobile
          />
          <NavItem 
            id="tech" 
            label={t("nav.architecture")} 
            onClick={(e: any) => handleNavClick(e, "tech")} 
            isActive={activeSection === "tech"}
            hiddenMobile
          />
          <NavItem 
            id="guide" 
            label={t("nav.guide")} 
            onClick={() => setView("guide")} 
            isActive={activeSection === "guide"} 
          />
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-black/5">
          <a href="https://github.com/LetermeFlorent/Oxide" className="text-gray-400 hover:text-black p-2 transition-colors"><Github size={18} /></a>
          <Button 
            size="sm" 
            className="rounded-full px-4 md:px-6 h-8 text-[10px] md:text-xs font-bold bg-black text-white hover:bg-gray-800 transition-all"
            onClick={() => setView(view === "download" ? "overview" : "download")}
          >
            {view === "download" ? t("nav.back") : t("nav.download")}
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};

