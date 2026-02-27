import React, { ReactNode } from "react";
import { Terminal, Layout, Zap, Cpu, Undo, ZoomIn, Keyboard, Search } from "lucide-react";
import { t } from "../../i18n";
import { motion } from "framer-motion";

const Card: React.FC<{ title: string; description: string; icon: ReactNode; className?: string }> = ({ 
  title, description, icon, className 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
    className={`group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 p-8 flex flex-col justify-between transition-all duration-500 ease-out hover:border-blue-100 ${className}`}
  >
    <div className="absolute inset-0 bg-dot-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-500 scale-90 group-hover:scale-100">
      {icon}
    </div>
    
    <div className="relative z-10">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-3 group-hover:text-black transition-colors">
        {title}
      </h3>
      <p className="text-sm font-medium text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
        {description}
      </p>
    </div>
  </motion.div>
);

export const BentoGrid: React.FC = () => (
  <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative">
    <div className="text-center mb-24 max-w-2xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">
        {t("bento.future_title")}
      </h2>
      <p className="text-lg text-gray-500 font-medium">
        {t("bento.future_desc")}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[320px]">
      {/* Large Cards */}
      <Card 
        className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-gray-50/50 to-white"
        title={t("bento.native_title")} 
        description={t("bento.native_desc")} 
        icon={<Terminal size={24} />} 
      />
      <Card 
        className="md:col-span-2 lg:col-span-2"
        title={t("bento.glass_title")} 
        description={t("bento.glass_desc")} 
        icon={<Layout size={24} />} 
      />

      {/* Standard Cards */}
      <Card title={t("bento.minimal_title")} description={t("bento.minimal_desc")} icon={<Zap size={24} />} />
      <Card title={t("bento.undo_title")} description={t("bento.undo_desc")} icon={<Undo size={24} />} />
      <Card title={t("bento.zoom_title")} description={t("bento.zoom_desc")} icon={<ZoomIn size={24} />} />
      <Card title={t("bento.shortcuts_title")} description={t("bento.shortcuts_desc")} icon={<Keyboard size={24} />} />
      
      {/* Wide Footer Card */}
      <Card 
        className="md:col-span-2 lg:col-span-4 flex-row items-center !h-auto !py-12"
        title={t("bento.watcher_title")} 
        description={t("bento.watcher_desc")} 
        icon={<Search size={24} />} 
      />
    </div>
  </section>
);
