import React, { useEffect, useState } from "react";
import { Folder, File, ChevronRight, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GitHubItem {
  name: string;
  path: string;
  type: "dir" | "file";
  html_url: string;
}

export const FileExplorer: React.FC = () => {
  const [items, setItems] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/LetermeFlorent/Oxide/contents/app"
        );
        if (!response.ok) throw new Error("Failed to fetch GitHub files");
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError("Impossible de charger les fichiers GitHub. Vérifiez le dépôt.");
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-red-500 text-center bg-red-50 rounded-2xl border border-red-100">
      {error}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github size={18} className="text-zinc-600" />
          <span className="text-sm font-semibold text-zinc-900">letermeflorent / oxide / app</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
          <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
          <div className="w-3 h-3 rounded-full bg-zinc-200"></div>
        </div>
      </div>
      
      <div className="divide-y divide-zinc-100 max-h-[500px] overflow-y-auto">
        {items.map((item) => (
          <a 
            key={item.path}
            href={item.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              {item.type === "dir" ? (
                <Folder className="text-indigo-500 fill-indigo-500/10" size={20} />
              ) : (
                <File className="text-zinc-400" size={20} />
              )}
              <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">
                {item.name}
              </span>
            </div>
            <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" />
          </a>
        ))}
      </div>
      
      <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-200 text-[10px] text-zinc-400 font-medium uppercase tracking-widest text-center">
        Powered by GitHub API & Oxide Infrastructure
      </div>
    </motion.div>
  );
};
