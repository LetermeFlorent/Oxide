import React, { useState } from "react";
import { 
  Sidebar, Terminal, Settings, Zap, 
  Layout, Columns, Percent, BarChart, 
  FileText, Bookmark, Library, Search, 
  Undo, ZoomIn, Keyboard, MousePointer2,
  ChevronRight, Box, Cpu, RotateCw, Image as ImageIcon,
  FileSearch, Activity, PanelLeft, Monitor,
  Plus, FolderTree, Trash2, Edit3, Grid3X3, Layers
} from "lucide-react";

const OptionCard = ({ icon: Icon, label, desc }: any) => (
  <div className="group flex flex-col gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
      <Icon size={18} />
    </div>
    <div>
      <h4 className="font-bold text-gray-900 mb-1">{label}</h4>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("explorer");

  const sections = [
    { 
      id: "explorer", 
      title: "Explorateur & Fichiers", 
      icon: <Sidebar size={18} />,
      content: "Navigation chirurgicale et gestion d'actifs.",
      options: [
        { icon: Search, label: "Recherche Header", desc: "Filtrez vos fichiers instantanément avec une barre de recherche intégrée." },
        { icon: RotateCw, label: "Réindexation", desc: "Forcez un scan complet du projet via le moteur Rust (PTY) pour synchroniser les changements." },
        { icon: ImageIcon, label: "Galerie d'Images", desc: "Aperçu natif haute résolution et gestion des vignettes dans la sidebar." },
        { icon: FileText, label: "Visualiseur PDF", desc: "Support natif pour consulter vos documentations PDF directement dans l'éditeur." },
        { icon: Bookmark, label: "File Follow", desc: "Épinglez un fichier pour garder un focus constant, même en changeant de dossier." },
        { icon: MousePointer2, label: "Actions Fichiers", desc: "Clic droit complet : Révéler dans l'OS, Renommer, Supprimer ou Création rapide." }
      ]
    },
    { 
      id: "terminal", 
      title: "Système Terminal", 
      icon: <Terminal size={18} />,
      content: "Terminaux multi-sessions propulsés par Rust.",
      options: [
        { icon: Plus, label: "Multi-Sessions", desc: "Ouvrez plusieurs sessions (Bash, Zsh, etc.) dans un seul projet via le header terminal." },
        { icon: Zap, label: "Mode Broadcast", desc: "Envoyez la même commande à tous vos terminaux actifs simultanément." },
        { icon: Grid3X3, label: "Grilles Dynamiques", desc: "Organisez vos terminaux en grilles personnalisables (2x2, 3x3) pour le monitoring." },
        { icon: FolderTree, label: "Path Tracking", desc: "Le header affiche le chemin actuel et permet de naviguer rapidement dans les dossiers." },
        { icon: Activity, label: "Système PTY", desc: "Sessions persistantes gérées par le backend Rust pour une stabilité maximale." },
        { icon: Trash2, label: "Kill Session", desc: "Arrêtez instantanément tout processus bloqué via le bouton de fermeture de session." }
      ]
    },
    { 
      id: "tabs", 
      title: "Gestion des Onglets", 
      icon: <Layers size={18} />,
      content: "Une organisation de travail sans compromis.",
      options: [
        { icon: Library, label: "Groupement", desc: "Regroupez vos projets et vues par thématiques via le menu contextuel des onglets." },
        { icon: Edit3, label: "Renommage", desc: "Personnalisez le nom de vos onglets pour une identification rapide." },
        { icon: Columns, label: "Tabs Verticales", desc: "Basculez les onglets sur le côté pour libérer de l'espace vertical (idéal Wide Screen)." },
        { icon: Trash2, label: "Fermeture Intelligente", desc: "Fermez les groupes, les projets ou les aperçus via un clic droit dédié." }
      ]
    },
    { 
      id: "display", 
      title: "Affichage & Workspace", 
      icon: <Layout size={18} />,
      content: "Une interface qui s'adapte à votre workflow.",
      options: [
        { icon: PanelLeft, label: "Focus Mode", desc: "Masquez ou affichez la Sidebar en un clic pour une immersion totale dans le code." },
        { icon: Layout, label: "Mode Compact", desc: "Interface condensée pour maximiser la visibilité sur les petits écrans." },
        { icon: Percent, label: "Visual Score", desc: "Pourcentage de progression calculé sur vos fichiers Markdown (TODOs)." },
        { icon: BarChart, label: "Performance Gauge", desc: "Indicateur graphique de charge et de progression intégré à la barre latérale." }
      ]
    },
    { 
      id: "advanced", 
      title: "Fonctions Avancées", 
      icon: <Zap size={18} />,
      content: "Des outils conçus pour la performance pure.",
      options: [
        { icon: ZoomIn, label: "Zoom Canvas", desc: "Zoom fluide sur l'interface complète (style Figma) pour un confort visuel total." },
        { icon: Keyboard, label: "Power Shortcuts", desc: "Mapping clavier complet pour naviguer, créer et fermer sans souris." },
        { icon: Cpu, label: "Hardware Render", desc: "Utilise le GPU pour le rendu du terminal et des transitions fluides." },
        { icon: Box, label: "LSM Database", desc: "Stockage Sled ultra-rapide pour vos préférences et l'état de vos sessions." }
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
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-semibold ${
              activeSection === s.id ? "bg-black text-white shadow-xl shadow-black/10 scale-[1.02]" : "text-gray-500 hover:bg-black/5"
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

      <main className="flex-1">
        {sections.filter(s => s.id === activeSection).map(s => (
          <div key={s.id} className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tighter mb-4 text-gray-900">{s.title}</h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">{s.content}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {s.options.map((opt, i) => (
                <OptionCard key={i} {...opt} />
              ))}
            </div>

            <div className="mt-16 p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col gap-4">
              <h4 className="font-bold flex items-center gap-2 text-gray-900">
                <Zap size={16} className="text-emerald-500" /> Note de Conception
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                "Oxide a été bâti sur l'idée que l'outil ne doit jamais ralentir la pensée. Chaque option documentée ici est le fruit d'une optimisation native pour garantir fluidité et persistance."
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
