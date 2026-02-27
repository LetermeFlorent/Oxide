import React from "react";
import { Box, ChevronRight } from "lucide-react";
import { Release } from "./ReleaseSelector.types";

interface ReleaseHeaderProps {
  release: Release;
}

export const ReleaseHeader: React.FC<ReleaseHeaderProps> = ({ release }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-6">
      <div className="w-14 h-14 bg-muted/30 rounded-2xl flex items-center justify-center text-muted-foreground group-hover/card:scale-105 transition-transform duration-500 shadow-sm border">
        <Box size={28} />
      </div>
      <div>
        <h3 className="text-xl font-extrabold tracking-tight text-foreground">{release.name || release.tag_name}</h3>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">
          {new Date(release.published_at).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>
    </div>
    <a href={release.html_url} target="_blank" className="text-primary text-[13px] font-bold hover:underline flex items-center gap-1 group/link transition-all">
      Notes <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
    </a>
  </div>
);
