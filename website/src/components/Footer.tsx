/**
 * Project: Oxide Website
 * Responsibility: Footer with Terminal-Oriented IDE focus
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";

export const Footer: React.FC = () => (
  <footer className="py-24 px-6 bg-[#f5f5f7] border-t border-black/5">
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-12 pb-12 border-b border-black/10 text-black/40 font-bold text-xs uppercase tracking-widest">
        <div className="space-y-4">
          <span className="text-black font-black italic">Oxide Beta</span>
          <p className="max-w-xs leading-relaxed text-[10px]">
            A small, terminal-oriented IDE for engineers. Licensed under O.A.S - MS-RSL.
          </p>
        </div>
        <div className="flex gap-16 items-center">
          <a href="https://github.com/LetermeFlorent/Oxide" className="hover:text-black transition-colors text-[10px]">GitHub Repository</a>
        </div>
      </div>
      <div className="pt-8 text-[10px] font-bold text-black/20 tracking-[0.2em] uppercase text-center md:text-left">
        O.A.S Optimization & Quality • All Rights Reserved
      </div>
    </div>
  </footer>
);
