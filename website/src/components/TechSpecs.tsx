/**
 * Project: Oxide Website
 * Responsibility: Technical Specifications Table
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";

const TechLine = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between py-6 border-b border-black/5 group">
    <span className="text-lg font-black text-black/40 group-hover:text-black transition-colors">{label}</span>
    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0066cc]">{value}</span>
  </div>
);

export const TechSpecs: React.FC = () => (
  <section id="tech" className="py-32 px-6 bg-white border-t border-black/5">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black tracking-tight mb-4">Built on Open Standards.</h2>
        <p className="text-black/40 font-semibold">Engineered from the ground up for stability.</p>
      </div>
      <TechLine label="Infrastructure" value="Tauri Core / Rust" />
      <TechLine label="Frontend Layer" value="React / Vite / TypeScript" />
      <TechLine label="Database Engine" value="LSM Sled Storage" />
      <TechLine label="Visual Interface" value="Tailwind / Framer Motion" />
    </div>
  </section>
);
