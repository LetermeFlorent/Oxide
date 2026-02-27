import React from "react";
import { Folder, File, ChevronRight } from "lucide-react";
import { GitHubItem } from "./FileExplorer.types";

export const FileItem: React.FC<{ item: GitHubItem }> = ({ item }) => (
  <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors group border-b last:border-0">
    <div className="flex items-center gap-4">
      {item.type === "dir" ? (
        <Folder className="text-primary fill-primary/10" size={18} />
      ) : (
        <File className="text-muted-foreground" size={18} />
      )}
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
    </div>
    <ChevronRight size={14} className="text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
  </a>
);
