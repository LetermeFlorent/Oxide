/**
 * Project: Oxide Website
 * Responsibility: Apple-style Minimalist Footer
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";

export const Footer: React.FC = () => (
  <footer className="py-24 px-6 bg-[#f5f5f7] border-t border-black/5">
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-12 pb-12 border-b border-black/10 text-black/40 font-bold text-xs uppercase tracking-widest">
        <div className="space-y-4">
          <span className="text-black font-black italic">Oxide Beta Framework</span>
          <p className="max-w-xs leading-relaxed text-[10px]">Professional workspace for engineers. Open source excellence.</p>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-3"><a href="#" className="hover:text-black">GitHub</a><a href="#" className="hover:text-black">Docs</a></div>
          <div className="flex flex-col gap-3"><a href="#" className="hover:text-black">Benchmarks</a><a href="#" className="hover:text-black">Security</a></div>
        </div>
      </div>
      <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-black/30 tracking-widest uppercase">
        <span>Copyright © 2026 LetermeFlorent.</span>
        <div className="flex gap-8 italic"><a href="#">Privacy Policy</a><a href="#">Terms</a></div>
      </div>
    </div>
  </footer>
);
