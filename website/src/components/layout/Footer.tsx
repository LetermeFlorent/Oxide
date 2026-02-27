import React from "react";
import { Github } from "lucide-react";

export const Footer: React.FC = () => (
  <footer className="border-t py-12 px-6 bg-background">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-2 items-center md:items-start">
        <span className="text-xl font-bold tracking-tighter">Oxide</span>
        <p className="text-sm text-muted-foreground font-medium italic">High performance, elegant environment.</p>
      </div>
      <div className="flex items-center gap-8 text-sm text-muted-foreground font-medium tracking-tight uppercase">
        <a href="https://github.com/LetermeFlorent/Oxide" className="hover:text-foreground transition-colors flex items-center gap-2">
          <Github size={16} /> GitHub
        </a>
        <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
        <span className="text-xs opacity-50">© 2026 Oxide</span>
      </div>
    </div>
  </footer>
);
