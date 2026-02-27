import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { GitHubItem } from "./FileExplorer.types";
import { FileItem } from "./FileItem";
import { Card } from "../ui/Card";

export const FileExplorer: React.FC = () => {
  const [items, setItems] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/LetermeFlorent/Oxide/contents/app")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border">
      <div className="bg-muted/50 px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2"><Github size={18} className="text-muted-foreground" /><span className="text-sm font-semibold">oxide / app</span></div>
        <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" /><div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" /><div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" /></div>
      </div>
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto no-scrollbar">
        {items.map((it) => <FileItem key={it.path} item={it} />)}
      </div>
    </motion.div>
  );
};
