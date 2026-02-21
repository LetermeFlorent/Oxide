/**
 * Project: Oxide Website
 * Responsibility: GitHub Repository File Browser Component
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React, { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { GitHubItem } from "./FileExplorer.types";
import { FileItem } from "./FileItem";

export const FileExplorer: React.FC = () => {
  const [items, setItems] = useState<GitHubItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/LetermeFlorent/Oxide/contents/app")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-2"><Github size={18} className="text-zinc-600" /><span className="text-sm font-semibold text-zinc-900">oxide / app</span></div>
        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-zinc-200" /><div className="w-3 h-3 rounded-full bg-zinc-200" /><div className="w-3 h-3 rounded-full bg-zinc-200" /></div>
      </div>
      <div className="divide-y divide-zinc-100 max-h-[500px] overflow-y-auto">
        {items.map((it) => <FileItem key={it.path} item={it} />)}
      </div>
    </motion.div>
  );
};
