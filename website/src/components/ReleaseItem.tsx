/**
 * Project: Oxide Website
 * Responsibility: Individual Release Card Component
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 * See root LICENSE for full terms.
 */
import React from "react";
import { Box, Download, Calendar, ChevronRight } from "lucide-react";
import { Release } from "./ReleaseSelector.types";

export const ReleaseItem: React.FC<{ release: Release }> = ({ release }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/[0.03] flex flex-col justify-between">
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-black text-white rounded-[16px] flex items-center justify-center">
          <Box size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#1d1d1f] tracking-tight">{release.name || release.tag_name}</h3>
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black/30">
            <Calendar size={12} /> {new Date(release.published_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {release.assets.map(asset => (
          <a key={asset.name} href={asset.browser_download_url} className="flex items-center gap-3 px-5 py-2.5 bg-[#f5f5f7] hover:bg-[#0071e3] hover:text-white rounded-full text-[12px] font-black transition-all duration-300">
            <Download size={14} /> {asset.name.split('.').pop()?.toUpperCase() || 'DL'}
          </a>
        ))}
      </div>
    </div>
    <a href={release.html_url} target="_blank" className="flex items-center gap-2 text-[12px] font-black text-[#0066cc] hover:underline">
      Details <ChevronRight size={14} />
    </a>
  </div>
);
