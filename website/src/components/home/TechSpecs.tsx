import React from "react";
import { t } from "../../i18n";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const SpecRow = ({ label, value }: { label: string, value: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-20px" }}
    className="flex items-center justify-between py-6 border-b border-gray-100 group hover:bg-gray-50/50 px-4 transition-colors rounded-lg"
  >
    <span className="font-mono text-sm text-gray-500 group-hover:text-black transition-colors flex items-center gap-3">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-blue-500 transition-colors" />
      {label}
    </span>
    <span className="font-bold text-gray-900 tracking-tight">{value}</span>
  </motion.div>
);

export const TechSpecs: React.FC = () => (
  <section id="tech" className="py-32 px-6 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
      <div className="sticky top-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full text-xs font-mono mb-6 text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          SYSTEM STATUS: ONLINE
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 leading-[0.9]">
          {t("tech.title")}
        </h2>
        <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-md">
          {t("tech.subtitle")}
        </p>
        
        <div className="mt-12 flex flex-col gap-4">
          {["Zero-Bloat Philosophy", "Native Rust Bindings", "Hardware Accelerated"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-semibold text-gray-800">
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Check size={14} strokeWidth={3} />
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-2 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="p-8 space-y-2">
          <SpecRow label={t("tech.infra")} value="Tauri Core v2 + Rust" />
          <SpecRow label={t("tech.frontend")} value="React 19 + Vite 6" />
          <SpecRow label={t("tech.db")} value="LSM Sled + SQLite" />
          <SpecRow label={t("tech.visual")} value="Tailwind v4 + Framer" />
          <SpecRow label="Performance" value="< 50MB RAM Idle" />
          <SpecRow label="License" value="O.A.S. - MS-RSL" />
        </div>
      </div>
    </div>
  </section>
);
