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

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("explorer");

  const sections = [
    { 
      id: "explorer", 
      title: t("guide.sections.explorer"), 
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
      title: t("guide.sections.terminal"), 
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
      id: "editor", 
      title: t("guide.sections.editor"), 
      icon: <FileCode size={18} />,
      content: "Une expérience d'édition hybride et fluide.",
      options: [
        { icon: Split, label: "Split View", desc: "Divisez votre vue pour afficher le code et la prévisualisation simultanément." },
        { icon: Eye, label: "Markdown Preview", desc: "Rendu temps réel de vos fichiers .md avec support des GitHub Flavored Markdown." },
        { icon: Box, label: "Binary Viewer", desc: "Détection automatique et affichage sécurisé des fichiers binaires et images." },
        { icon: RotateCw, label: "Sync Status", desc: "Indicateur Working/Idle synchronisé avec Rust pour surveiller les tâches de fond." }
      ]
    },
    { 
      id: "performance", 
      title: t("guide.sections.performance"), 
      icon: <CpuIcon size={18} />,
      content: "La puissance de Rust au service de votre workflow.",
      options: [
        { icon: ZapOff, label: "Mmap File Reading", desc: "Lecture de fichiers volumineux via Memory Mapping pour une consommation RAM quasi-nulle." },
        { icon: RefreshCcw, label: "Directory Sync", desc: "Algorithme de diff ultra-rapide pour synchroniser vos dossiers locaux et distants." },
        { icon: Activity, label: "Streaming Scan", desc: "Scan de projet asynchrone streamé pour un affichage immédiat de l'arborescence." },
        { icon: Puzzle, label: "Plugin WASM", desc: "Système d'extension modulaire permettant d'exécuter du code WebAssembly natif." }
      ]
    },
    { 
      id: "tabs", 
      title: t("guide.sections.tabs"), 
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
      id: "advanced", 
      title: t("guide.sections.advanced"), 
      icon: <Layout size={18} />,
      content: "Personnalisation complète de votre environnement.",
      options: [
        { icon: ZoomIn, label: "Zoom Canvas", desc: "Zoom fluide sur l'interface complète (style Figma) pour un confort visuel total." },
        { icon: Keyboard, label: "Power Shortcuts", desc: "Mapping clavier complet pour naviguer, créer et fermer sans souris." },
        { icon: Cpu, label: "Hardware Render", desc: "Utilise le GPU pour le rendu du terminal et des transitions fluides." },
        { icon: Box, label: "LSM Database", desc: "Stockage Sled ultra-rapide pour vos préférences et l'état de vos sessions." }
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
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-semibold ${
              activeSection === s.id ? "bg-black text-white shadow-xl shadow-black/10 scale-[1.02]" : "text-gray-500 hover:bg-black/5"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
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
                <ShieldCheck size={16} className="text-blue-500" /> Note Juridique
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                Oxide est protégé par la licence MS-RSL. Le code source est ouvert à la consultation pour garantir la transparence, mais reste la propriété exclusive de O.A.S (Optimization & Quality).
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
