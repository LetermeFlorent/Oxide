import React, { useState } from "react";
import { t } from "../../i18n";
import { Sidebar, Terminal, Settings, Zap, ChevronRight } from "lucide-react";

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("sidebar");

  const sections = [
    { id: "sidebar", title: t("guide.sections.sidebar.title"), icon: <Sidebar size={18} />, content: t("guide.sections.sidebar.desc") },
    { id: "terminal", title: t("guide.sections.terminal.title"), icon: <Terminal size={18} />, content: t("guide.sections.terminal.desc") },
    { id: "settings", title: t("guide.sections.settings.title"), icon: <Settings size={18} />, content: t("guide.sections.settings.desc") },
    { id: "features", title: t("guide.sections.features.title"), icon: <Zap size={18} />, content: t("guide.sections.features.desc") },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white/50 backdrop-blur-sm pt-32 px-6 max-w-7xl mx-auto gap-12 pb-20">
      {/* Sidebar de Documentation */}
      <aside className="w-full md:w-64 space-y-2 sticky top-40 h-fit">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 px-4">Capitres</h2>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
              activeSection === s.id ? "bg-black text-white shadow-lg shadow-black/10 scale-[1.02]" : "text-gray-500 hover:bg-black/5"
            }`}
          >
            <div className="flex items-center gap-3">
              {s.icon}
              <span className="text-sm">{s.title}</span>
            </div>
            {activeSection === s.id && <ChevronRight size={14} />}
          </button>
        ))}
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 space-y-12">
        {sections.filter(s => s.id === activeSection).map(s => (
          <div key={s.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-black">
                {s.icon}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{s.title}</h1>
            </div>
            
            <div className="prose prose-gray max-w-3xl">
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {s.content}
              </p>
              
              <div className="mt-12 p-8 rounded-3xl bg-gray-50 border border-gray-100 italic text-gray-500">
                Plus de détails techniques sur le module {s.title} seront bientôt disponibles. Oxide est actuellement en phase Bêta v1.4.0.
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
