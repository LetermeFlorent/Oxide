import React, { useState } from "react";
import { 
  Sidebar, Terminal, Settings, Zap, 
  Layout, Columns, Percent, BarChart, 
  FileText, Bookmark, Library, Search, 
  Undo, ZoomIn, Keyboard, MousePointer2,
  ChevronRight, Box, Cpu
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
      content: "Gérez vos projets avec une précision chirurgicale.",
      options: [
        { icon: Search, label: "Recherche Globale", desc: "Recherche instantanée dans tout le projet grâce à l'indexation SQLite." },
        { icon: Box, label: "Indexation LSM", desc: "Moteur Sled pour une découverte de fichiers ultra-rapide, même sur de gros volumes." },
        { icon: Cpu, label: "Mode GPU", desc: "Basculez sur le rendu matériel pour un monitoring en temps réel des ressources." },
        { icon: MousePointer2, label: "Context Menu", desc: "Clic droit complet pour créer, renommer, supprimer ou réindexer vos dossiers." }
      ]
    },
    { 
      id: "terminal", 
      title: "Système Terminal", 
      icon: <Terminal size={18} />,
      content: "Un écosystème de terminaux piloté par Rust (PTY).",
      options: [
        { icon: Zap, label: "Mode Broadcast", desc: "Diffusez vos commandes sur tous les terminaux actifs simultanément." },
        { icon: Layout, label: "Terminal Grid", desc: "Affichez vos terminaux en grille pour une surveillance multi-projets." },
        { icon: Terminal, label: "Sessions Persistantes", desc: "Vos sessions PTY survivent aux rechargements grâce à la couche native Rust." },
        { icon: Columns, label: "Split View", desc: "Divisez votre vue terminal pour comparer logs et exécutions." }
      ]
    },
    { 
      id: "display", 
      title: "Affichage & Tabs", 
      icon: <Layout size={18} />,
      content: "Personnalisez l'interface selon votre flux de travail.",
      options: [
        { icon: Layout, label: "Mode Compact", desc: "Réduit l'interface au minimum pour maximiser l'espace de code." },
        { icon: Columns, label: "Onglets Verticaux", desc: "Basculez les onglets de projet sur le côté pour une meilleure lisibilité." },
        { icon: Percent, label: "Score de Progression", desc: "Affiche le pourcentage d'avancement de vos tâches en cours." },
        { icon: BarChart, label: "Jauge Visuelle", desc: "Indicateur graphique de charge et de progression dans la sidebar." }
      ]
    },
    { 
      id: "session", 
      title: "Session & Sécurité", 
      icon: <Settings size={18} />,
      content: "Ne perdez jamais votre travail, même après un crash.",
      options: [
        { icon: FileText, label: "Réouverture Auto", desc: "Restaure automatiquement les derniers fichiers ouverts au lancement." },
        { icon: Bookmark, label: "Restore Followed", desc: "Garde le focus sur les fichiers que vous suiviez spécifiquement." },
        { icon: Library, label: "Groupes d'Onglets", desc: "Restaure vos groupements d'onglets personnalisés." },
        { icon: Undo, label: "Infinite Undo", desc: "Historique d'annulation robuste pour toutes les opérations de fichiers." }
      ]
    },
    { 
      id: "advanced", 
      title: "Fonctions Avancées", 
      icon: <Zap size={18} />,
      content: "Des outils conçus pour les Power Users.",
      options: [
        { icon: ZoomIn, label: "Zoom Canevas", desc: "Zoom fluide sur toute l'interface pour s'adapter à votre confort visuel." },
        { icon: Keyboard, label: "Power Shortcuts", desc: "Mapping complet des touches pour piloter Oxide sans la souris." },
        { icon: Search, label: "Surgical Watcher", desc: "Surveille les changements fichiers avec un debounce de 2s pour éviter le flicker." },
        { icon: Box, label: "Zero-Bloat", desc: "Architecture sans librairies lourdes pour une empreinte RAM < 50MB." }
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
                <Zap size={16} className="text-emerald-500" /> Note de l'Ingénieur
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Toutes ces options sont synchronisées avec le backend Rust pour garantir une latence minimale. 
                Si vous modifiez un réglage dans la Sidebar, il est instantanément persisté dans votre configuration locale.
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
