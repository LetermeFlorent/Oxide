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
  <section id="tech" className="pt-16 pb-32 px-6 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
      <div className="sticky top-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 rounded-full text-xs font-mono mb-6 text-gray-700 border border-black/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="tracking-wider font-semibold">SYSTEM STATUS: ONLINE</span>
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative group rounded-3xl p-[1px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(59,130,246,0.8)_360deg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
        <div className="bg-white rounded-[23px] shadow-xl shadow-gray-100/50 relative z-10 h-full w-full">
          <div className="p-8 space-y-2">
            <SpecRow label={t("tech.infra")} value="Tauri Core v2 + Rust" />
            <SpecRow label={t("tech.frontend")} value="React 19 + Vite 6" />
            <SpecRow label={t("tech.db")} value="LSM Sled + SQLite" />
            <SpecRow label={t("tech.visual")} value="Tailwind v4 + Framer" />
            <SpecRow label="Performance" value="< 50MB RAM Idle" />
            <SpecRow label="License" value="O.A.S. - MS-RSL" />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
