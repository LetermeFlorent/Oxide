import React from "react";
import { Github } from "lucide-react";
import { t } from "../../i18n";

interface FooterProps {
  setView?: (v: "overview" | "download" | "guide") => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => (
  <footer className="border-t py-12 px-6 bg-background relative z-10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-2 items-center md:items-start">
        <span className="text-xl font-bold tracking-tighter text-gray-900">Oxide</span>
        <p className="text-sm text-muted-foreground font-medium italic">{t("footer.tagline")}</p>
      </div>
      <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium tracking-tight uppercase">
        <a href="https://github.com/LetermeFlorent/Oxide" className="hover:text-foreground transition-colors flex items-center gap-2">
          <Github size={16} /> GitHub
        </a>
        <button 
          onClick={() => setView?.("guide")}
          className="hover:text-foreground transition-colors uppercase"
        >
          {t("footer.docs")}
        </button>
        <span className="text-xs opacity-50 lowercase">© 2026 Oxide</span>
      </div>
    </div>
  </footer>
);
