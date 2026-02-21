/**
 * Project: Oxide Website
 * Responsibility: Compact Horizontal Release Row
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React from "react";
import { Download, ChevronRight, Box } from "lucide-react";
import { Release } from "./ReleaseSelector.types";

export const ReleaseItem: React.FC<{ release: Release }> = ({ release }) => (
  <div className="w-full bg-white p-10 rounded-[40px] border border-black/5 flex flex-col gap-10 hover:shadow-2xl transition-all duration-500">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-[#f5f5f7] rounded-2xl flex items-center justify-center text-black/20"><Box size={28} /></div>
        <div>
          <h3 className="text-2xl font-black tracking-tight text-[#1d1d1f]">{release.name || release.tag_name}</h3>
          <p className="text-[11px] font-black uppercase text-black/30 tracking-widest mt-1">{new Date(release.published_at).toLocaleDateString()}</p>
        </div>
      </div>
      <a href={release.html_url} target="_blank" className="text-[#0066cc] text-[13px] font-bold hover:underline flex items-center gap-1">Release Notes <ChevronRight size={16} /></a>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
      {release.assets.map(asset => (
        <a key={asset.name} href={asset.browser_download_url} className="flex-none flex items-center gap-3 px-6 py-3 bg-[#f5f5f7] hover:bg-[#0071e3] hover:text-white rounded-2xl text-[12px] font-bold transition-all group">
          <span className="truncate max-w-[150px]">{asset.name.split('.').pop()?.toUpperCase()}</span>
          <Download size={14} className="opacity-30 group-hover:opacity-100" />
        </a>
      ))}
    </div>
  </div>
);
