import React from "react";
import { Github } from "lucide-react";
import { Button } from "../ui/Button";
import { t } from "../../i18n";

interface NavProps {
  view: "overview" | "download";
  setView: (v: "overview" | "download") => void;
}

export const Nav: React.FC<NavProps> = ({ view, setView }) => (
  <nav className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-8 max-w-7xl">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("overview")}>
        <span className="text-xl font-bold tracking-tighter">
          Oxide <span className="text-muted-foreground font-medium text-xs ml-1">{t("nav.beta")}</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button onClick={() => setView("overview")} className={`transition-colors hover:text-foreground/80 ${view === 'overview' ? 'text-foreground font-bold' : 'text-foreground/60'}`}>{t("nav.overview")}</button>
        <a href="#performance" className="text-foreground/60 hover:text-foreground/80">{t("nav.performance")}</a>
        <a href="#tech" className="text-foreground/60 hover:text-foreground/80">{t("nav.architecture")}</a>
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com/LetermeFlorent/Oxide" className="text-foreground/60 hover:text-foreground/80 transition-colors"><Github size={20} /></a>
        <Button variant={view === "download" ? "secondary" : "primary"} onClick={() => setView(view === "download" ? "overview" : "download")}>
          {view === "download" ? t("nav.back") : t("nav.download")}
        </Button>
      </div>
    </div>
  </nav>
);
