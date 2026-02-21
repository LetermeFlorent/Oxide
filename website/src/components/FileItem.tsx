/**
 * Project: Oxide Website
 * Responsibility: Individual File/Folder Row Component
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";
import { Folder, File, ChevronRight } from "lucide-react";
import { GitHubItem } from "./FileExplorer.types";

export const FileItem: React.FC<{ item: GitHubItem }> = ({ item }) => (
  <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors group">
    <div className="flex items-center gap-4">
      {item.type === "dir" ? (
        <Folder className="text-indigo-500 fill-indigo-500/10" size={20} />
      ) : (
        <File className="text-zinc-400" size={20} />
      )}
      <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">{item.name}</span>
    </div>
    <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" />
  </a>
);
