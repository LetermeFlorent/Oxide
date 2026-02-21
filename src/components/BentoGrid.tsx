/**
 * Project: Oxide Website
 * Responsibility: Bento Grid with Aligned Icons
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";
import { Terminal, Layout, Zap, Cpu } from "lucide-react";

export const BentoGrid: React.FC = () => (
  <section id="performance" className="py-32 px-6">
    <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[400px]">
      <div className="bento-card col-span-1 md:col-span-2 p-12 flex flex-col justify-end bg-[#f5f5f7]">
        <Terminal size={48} className="mb-8 text-indigo-500" />
        <h3 className="text-4xl font-black mb-4 tracking-tighter">Native Performance.</h3>
        <p className="text-black/50 text-lg font-semibold max-w-md leading-tight">Real-time shell execution via Rust backend.</p>
      </div>
      <div className="bento-card p-12 flex flex-col items-center justify-center text-center bg-[#f5f5f7]">
        <Layout size={40} className="mb-8 text-rose-500" />
        <h3 className="text-2xl font-black mb-4 tracking-tight">Pure Glass.</h3>
        <p className="text-black/50 font-semibold leading-tight text-sm">A refined interface that fades away.</p>
      </div>
      <div className="bento-card p-12 flex flex-col items-center justify-center text-center bg-[#f5f5f7]">
        <Zap size={40} className="mb-8 text-yellow-500" />
        <h3 className="text-2xl font-black mb-4 tracking-tight">Minimalist.</h3>
        <p className="text-black/50 font-semibold leading-tight text-sm">Under 50MB RAM usage.</p>
      </div>
      <div className="bento-card col-span-1 md:col-span-2 p-12 flex flex-col justify-end bg-[#f5f5f7]">
        <Cpu size={48} className="mb-8 text-indigo-400" />
        <h3 className="text-4xl font-black mb-4 tracking-tighter">Future Architecture.</h3>
        <p className="text-black/50 text-lg font-semibold max-w-lg leading-tight">Tauri, React, and Rust. The perfect trifecta.</p>
      </div>
    </div>
  </section>
);
