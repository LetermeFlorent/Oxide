import React, { useState } from "react";
import { 
  Sidebar, Terminal, Settings, Zap, 
  Layout, Columns, Percent, BarChart, 
  FileText, Bookmark, Library, Search, 
  Undo, ZoomIn, Keyboard, MousePointer2,
  ChevronRight, Box, Cpu, RotateCw, Image as ImageIcon,
  FileSearch, Activity, PanelLeft, Monitor,
  Plus, FolderTree, Trash2, Edit3, Grid3X3, Layers,
  Split, FileCode, Eye, ZapOff, RefreshCcw, Cpu as CpuIcon, Puzzle,
  Scale, ShieldCheck, AlertTriangle
} from "lucide-react";
import { t } from "../../i18n";

const OptionCard = ({ icon: Icon, label, desc }: any) => (
  <div className="group flex flex-col gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-left">
    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
      <Icon size={18} />
    </div>
    <div>
      <h4 className="font-bold text-gray-900 mb-1">{label}</h4>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const DocImage = ({ src, alt }: { src: string, alt: string }) => (
  <div className="my-8 rounded-2xl border border-black/5 overflow-hidden shadow-2xl bg-white group relative">
    <div className="h-6 bg-gray-50 border-b border-gray-100 flex items-center px-3 gap-1.5">
      <div className="w-2 h-2 rounded-full bg-red-400/40" />
      <div className="w-2 h-2 rounded-full bg-yellow-400/40" />
      <div className="w-2 h-2 rounded-full bg-green-400/40" />
    </div>
    <img src={src} alt={alt} className="w-full h-auto" />
  </div>
);

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("explorer");

  const sections = [
    { 
      id: "explorer", 
      title: t("guide.sections.explorer"), 
      icon: <Sidebar size={18} />,
      content: "Navigation chirurgicale et gestion d'actifs.",
      image: "/workspace-empty.png",
      options: [
        { icon: Search, label: "Recherche Header", desc: "Filtrez vos fichiers instantanément avec une barre de recherche intégrée." },
        { icon: RotateCw, label: "Réindexation", desc: "Forcez un scan complet du projet via le moteur Rust (PTY)." },
        { icon: ImageIcon, label: "Galerie d'Images", desc: "Aperçu natif haute résolution et gestion des vignettes." }
      ]
    },
    { 
      id: "terminal", 
      title: t("guide.sections.terminal"), 
      icon: <Terminal size={18} />,
      content: "Terminaux multi-sessions propulsés par Rust.",
      image: "/terminal-overview.png",
      options: [
        { icon: Plus, label: "Multi-Sessions", desc: "Ouvrez plusieurs sessions (Bash, Zsh) dans un seul projet." },
        { icon: Zap, label: "Mode Broadcast", desc: "Diffusez vos commandes sur tous vos terminaux actifs." },
        { icon: Grid3X3, label: "Grilles Dynamiques", desc: "Organisez vos terminaux en grilles personnalisables." }
      ]
    },
    { 
      id: "editor", 
      title: t("guide.sections.editor"), 
      icon: <FileCode size={18} />,
      content: "Une expérience d'édition hybride et fluide.",
      image: "/workspace-full.png",
      options: [
        { icon: Split, label: "Split View", desc: "Divisez votre vue pour afficher le code et la prévisualisation." },
        { icon: Eye, label: "Markdown Preview", desc: "Rendu temps réel de vos fichiers .md avec support GFM." },
        { icon: Box, label: "Binary Viewer", desc: "Détection automatique et affichage sécurisé des fichiers binaires." }
      ]
    },
    { 
      id: "advanced", 
      title: t("guide.sections.advanced"), 
      icon: <Layout size={18} />,
      content: "Personnalisation complète de votre environnement.",
      image: "/settings-ui.png",
      options: [
        { icon: Layout, label: "Mode Compact", desc: "Interface condensée pour maximiser la visibilité." },
        { icon: Columns, label: "Tabs Verticales", desc: "Basculez les onglets sur le côté pour les écrans larges." },
        { icon: ZoomIn, label: "Zoom Canvas", desc: "Zoom fluide sur l'interface complète style Figma." }
      ]
    },
    {
      id: "session",
      title: "Session & Persistence",
      icon: <Settings size={18} />,
      content: "Ne perdez jamais votre contexte de travail.",
      image: "/settings-session.png",
      options: [
        { icon: RotateCw, label: "Auto-Restore", desc: "Restaure vos fichiers, groupes et onglets au démarrage." },
        { icon: Bookmark, label: "Focus Tracking", desc: "Mémorise l'onglet actif et le fichier suivi." },
        { icon: Cpu, label: "LSM Sled", desc: "Base de données haute performance pour vos préférences." }
      ]
    },
    {
      id: "license",
      title: t("guide.sections.license"),
      icon: <Scale size={18} />,
      content: t("guide.license.desc"),
      options: [
        { icon: ShieldCheck, label: t("guide.license.msrsl"), desc: t("guide.license.msrsl_desc") },
        { icon: AlertTriangle, label: "Violations", desc: "Toute utilisation non autorisée du code source ou distribution commerciale fera l'objet de poursuites." }
      ]
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-32 px-6 max-w-7xl mx-auto gap-12 pb-32 relative z-10">
      <aside className="w-full lg:w-72 space-y-2 lg:sticky lg:top-40 h-fit">
        <div className="mb-8 px-4">
          <h2 className="text-2xl font-bold tracking-tighter text-gray-900">Documentation</h2>
          <p className="text-sm text-gray-500 font-medium italic">Oxide Bêta v1.4.0</p>
        </div>
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-semibold ${
              activeSection === s.id ? "bg-black text-white shadow-xl shadow-black/10 scale-[1.02]" : "text-gray-500 hover:bg-black/5"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              {s.icon} <span className="text-sm">{s.title}</span>
            </div>
            {activeSection === s.id && <ChevronRight size={14} />}
          </button>
        ))}
      </aside>

      <main className="flex-1 min-w-0">
        {sections.filter(s => s.id === activeSection).map(s => (
          <div key={s.id} className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tighter mb-4 text-gray-900">{s.title}</h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">{s.content}</p>
            </div>
            
            {s.image && <DocImage src={s.image} alt={s.title} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {s.options.map((opt, i) => <OptionCard key={i} {...opt} />)}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
