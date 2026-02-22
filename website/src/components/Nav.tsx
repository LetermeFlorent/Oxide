/**
 * Project: Oxide Website
 * Responsibility: Apple-style Sticky Navigation Component
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";
import { Github } from "lucide-react";

interface NavProps {
  view: "overview" | "download";
  setView: (v: "overview" | "download") => void;
}

export const Nav: React.FC<NavProps> = ({ view, setView }) => (
  <nav className="fixed top-0 w-full z-50 apple-blur border-b border-black/5">
    <div className="max-w-screen-xl mx-auto px-6 h-12 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("overview")}>
        <span className="text-[19px] font-bold tracking-tight uppercase">
          Oxide <span className="text-indigo-600 font-black italic text-sm ml-1">Beta</span>
        </span>
      </div>
      <div className="hidden md:flex gap-8 text-[12px] font-medium text-black/70 tracking-tight">
        <button onClick={() => setView("overview")} className={`hover:text-black transition-colors ${view === 'overview' ? 'text-black font-bold' : ''}`}>Overview</button>
        <a href="#performance" className="hover:text-black transition-colors">Performance</a>
        <a href="#tech" className="hover:text-black transition-colors">Architecture</a>
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com/LetermeFlorent/Oxide" className="text-black/70 hover:text-black"><Github size={18} /></a>
        <button onClick={() => setView(view === "download" ? "overview" : "download")} className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1 rounded-full text-[11px] font-bold transition-all">
          {view === "download" ? "Back" : "Download"}
        </button>
      </div>
    </div>
  </nav>
);
