import React from "react";
import { t } from "../../i18n";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Sidebar, Terminal, Settings, Zap } from "lucide-react";

export const UserGuide: React.FC = () => (
  <section className="py-40 px-6 max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-16">
      <h2 className="text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-black to-gray-500">
        {t("guide.title")}
      </h2>
      <p className="text-xl text-gray-500 font-medium">
        {t("guide.subtitle")}
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-10 border-none shadow-xl bg-white/70 backdrop-blur-md">
        <Sidebar className="w-12 h-12 mb-6 text-primary" />
        <h3 className="text-2xl font-bold mb-4">{t("guide.sections.sidebar.title")}</h3>
        <p className="text-gray-500 leading-relaxed font-medium">{t("guide.sections.sidebar.desc")}</p>
      </Card>
      
      <Card className="p-10 border-none shadow-xl bg-white/70 backdrop-blur-md">
        <Terminal className="w-12 h-12 mb-6 text-primary" />
        <h3 className="text-2xl font-bold mb-4">{t("guide.sections.terminal.title")}</h3>
        <p className="text-gray-500 leading-relaxed font-medium">{t("guide.sections.terminal.desc")}</p>
      </Card>
      
      <Card className="p-10 border-none shadow-xl bg-white/70 backdrop-blur-md">
        <Settings className="w-12 h-12 mb-6 text-primary" />
        <h3 className="text-2xl font-bold mb-4">{t("guide.sections.settings.title")}</h3>
        <p className="text-gray-500 leading-relaxed font-medium">{t("guide.sections.settings.desc")}</p>
      </Card>
      
      <Card className="p-10 border-none shadow-xl bg-white/70 backdrop-blur-md">
        <Zap className="w-12 h-12 mb-6 text-primary" />
        <h3 className="text-2xl font-bold mb-4">{t("guide.sections.features.title")}</h3>
        <p className="text-gray-500 leading-relaxed font-medium">{t("guide.sections.features.desc")}</p>
      </Card>
    </div>
  </section>
);
