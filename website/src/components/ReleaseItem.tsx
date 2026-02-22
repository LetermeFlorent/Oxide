/**
 * Project: Oxide Website
 * Responsibility: Modern Horizontal Release Row with Categorized Assets
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";
import { Download, ChevronRight, Box, Monitor, Terminal, Apple, Package } from "lucide-react";
import { Release } from "./ReleaseSelector.types";

const getAssetIcon = (name: string) => {
  const ext = name.toLowerCase();
  if (ext.endsWith(".exe") || ext.endsWith(".msi")) return <Monitor size={16} />;
  if (ext.endsWith(".dmg")) return <Apple size={16} />;
  if (ext.endsWith(".deb") || ext.endsWith(".rpm") || ext.endsWith(".appimage")) return <Package size={16} />;
  return <Terminal size={16} />;
};

const getAssetLabel = (name: string) => {
  const parts = name.split(".");
  const ext = parts.pop()?.toLowerCase() || "";
  if (ext === "appimage") return "AppImage";
  return ext.toUpperCase();
};

export const ReleaseItem: React.FC<{ release: Release }> = ({ release }) => (
  <div className="w-full bg-white p-6 rounded-[32px] border border-black/5 flex items-center justify-between gap-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 group/card">
    <div className="flex items-center gap-6 flex-none">
      <div className="w-16 h-16 bg-[#f5f5f7] rounded-3xl flex items-center justify-center text-black/20 group-hover/card:scale-110 transition-transform duration-500 shadow-inner">
        <Box size={32} />
      </div>
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black tracking-tight text-[#1d1d1f]">{release.name || release.tag_name}</h3>
          <span className="px-2 py-0.5 rounded-full bg-black/5 text-[9px] font-black uppercase tracking-tighter text-black/40">Latest</span>
        </div>
        <p className="text-[10px] font-black uppercase text-black/20 tracking-widest mt-1.5">{new Date(release.published_at).toLocaleDateString()}</p>
      </div>
    </div>

    <div className="flex-1 min-w-0 flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
      {release.assets.map((asset) => (
        <a
          key={asset.name}
          href={asset.browser_download_url}
          className="flex-none flex items-center gap-2.5 px-4 py-2 bg-[#f5f5f7] hover:bg-black hover:text-white rounded-xl text-[12px] font-bold transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-0.5"
          title={asset.name}
        >
          <span className="opacity-40 group-hover:opacity-100 transition-opacity">
            {getAssetIcon(asset.name)}
          </span>
          <span className="tracking-tight">{getAssetLabel(asset.name)}</span>
          <Download size={14} className="opacity-20 group-hover:opacity-100 transition-all group-hover:translate-y-0.5" />
        </a>
      ))}
    </div>

    <div className="flex-none flex items-center gap-4">
      <div className="h-10 w-px bg-black/5 hidden md:block" />
      <a
        href={release.html_url}
        target="_blank"
        className="h-12 px-6 flex items-center gap-2 text-black/40 hover:text-black text-[13px] font-black tracking-tight transition-colors group/link"
      >
        Notes <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
);
