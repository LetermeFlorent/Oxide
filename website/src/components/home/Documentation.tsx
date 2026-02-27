import React, { useState } from "react";
import { 
  Sidebar, Terminal, Settings, Zap, 
  Layout, Columns, Percent, BarChart, 
  FileText, Bookmark, Library, Search, 
  Undo, ZoomIn, Keyboard, MousePointer2,
  ChevronRight, Box, Cpu, RotateCw, Image as ImageIcon,
  FileSearch, Activity, PanelLeft, Monitor
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
        { icon: Search, label: "Barre de Recherche", desc: "Filtrez vos fichiers instantanément avec une barre de recherche intégrée au header." },
        { icon: RotateCw, label: "Réindexation", desc: "Bouton de rafraîchissement pour forcer un scan complet via le moteur Rust (PTY)." },
        { icon: ImageIcon, label: "Galerie d'Images", desc: "Aperçu natif des images et gestion des vignettes dans la sidebar." },
        { icon: FileText, label: "Support PDF", desc: "Visualiseur PDF intégré pour consulter vos documentations sans quitter l'app." },
        { icon: Bookmark, label: "Suivi de Fichier", desc: "Option 'Follow' pour garder un fichier en focus constant et suivre sa progression." },
        { icon: MousePointer2, label: "Actions Contextuelles", desc: "Clic droit pour : Révéler dans l'explorateur OS, Renommer, Supprimer ou Créer." }
      ]
    },
    { 
      id: "terminal", 
      title: "Système Terminal", 
      icon: <Terminal size={18} />,
      content: "Terminaux XTerm.js propulsés par Rust.",
      options: [
        { icon: Zap, label: "Mode Broadcast", desc: "Envoyez la même commande à tous vos terminaux ouverts en un clic." },
        { icon: Layout, label: "Grilles Dynamiques", desc: "Organisez vos terminaux en grilles (2x2, 3x3) selon vos besoins de monitoring." },
        { icon: Activity, label: "Diagnostics", desc: "Suivi en temps réel des erreurs et logs de sortie de vos processus." },
        { icon: RotateCw, label: "Relance Rapide", desc: "Bouton dédié pour redémarrer instantanément une session PTY bloquée." }
      ]
    },
    { 
      id: "display", 
      title: "Affichage & Workspace", 
      icon: <Layout size={18} />,
      content: "Une interface qui s'adapte à votre écran.",
      options: [
        { icon: PanelLeft, label: "Sidebar Toggle", desc: "Masquez ou affichez l'explorateur pour libérer 100% de l'espace au code." },
        { icon: Columns, label: "Tabs Verticales", desc: "Placez vos onglets sur le côté, idéal pour les écrans ultra-larges." },
        { icon: Layout, label: "Mode Compact", desc: "Réduit la taille des icônes et des textes pour voir plus de contenu." },
        { icon: Percent, label: "Barres de Progression", desc: "Indicateur visuel sur les fichiers Markdown pour suivre l'avancement des TODOs." }
      ]
    },
    { 
      id: "session", 
      title: "Session & Restauration", 
      icon: <Settings size={18} />,
      content: "Continuité de travail absolue.",
      options: [
        { icon: Monitor, label: "Vue Overview", desc: "Option pour démarrer systématiquement sur l'aperçu global des projets." },
        { icon: Library, label: "Restauration Groupes", desc: "Réouvre vos groupements d'onglets tels que vous les avez laissés." },
        { icon: Bookmark, label: "Onglet Actif", desc: "Mémorise et restaure l'onglet exact sur lequel vous travailliez." },
        { icon: FileSearch, label: "Recherche Globale", desc: "Fenêtre de recherche transversale accessible via le raccourci global." }
      ]
    },
    { 
      id: "advanced", 
      title: "Fonctions Avancées", 
      icon: <Zap size={18} />,
      content: "Optimisation et performance pure.",
      options: [
        { icon: ZoomIn, label: "Zoom Canvas", desc: "Utilisez Ctrl + Roulette pour zoomer sur l'interface comme sur un canevas Figma." },
        { icon: Keyboard, label: "Shortcuts Map", desc: "Raccourcis pour : Switch de projet, création de fichier, toggle terminal." },
        { icon: Cpu, label: "Accélération GPU", desc: "Utilise le GPU pour le rendu du terminal et des animations pour 0 lag." },
        { icon: Box, label: "LSM / Sled", desc: "Base de données NoSQL haute performance pour stocker vos préférences." }
      ]
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-32 px-6 max-w-7xl mx-auto gap-12 pb-32 relative z-10">
      {/* Navigation Latérale */}
      <aside className="w-full lg:w-72 space-y-2 lg:sticky lg:top-40 h-fit">
        <div className="mb-8 px-4">
          <h2 className="text-2xl font-bold tracking-tighter">Documentation</h2>
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

      {/* Contenu Principal */}
      <main className="flex-1">
        {sections.filter(s => s.id === activeSection).map(s => (
          <div key={s.id} className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-12">
              <h1 className="text-5xl font-bold tracking-tighter mb-4">{s.title}</h1>
              <p className="text-xl text-gray-500 font-medium">{s.content}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {s.options.map((opt, i) => (
                <OptionCard key={i} {...opt} />
              ))}
            </div>

            <div className="mt-16 p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col gap-4">
              <h4 className="font-bold flex items-center gap-2">
                <Zap size={16} className="text-emerald-500" /> Note Technique
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Oxide utilise une architecture hybride. Le moteur de rendu React 19 gère l'UI, tandis que le coeur en Rust s'occupe de la gestion des processus, du système de fichiers et de la base de données LSM. Cette séparation garantit que l'interface reste réactive même lors d'opérations lourdes.
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
