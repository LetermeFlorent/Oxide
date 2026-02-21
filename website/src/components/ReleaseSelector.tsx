/**
 * Project: Oxide Website
 * Responsibility: Release List Container & Fetching Logic
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import React, { useEffect, useState } from "react";
import { Box } from "lucide-react";
import { motion } from "framer-motion";
import { Release } from "./ReleaseSelector.types";
import { ReleaseItem } from "./ReleaseItem";

export const ReleaseSelector: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/LetermeFlorent/Oxide/releases")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setReleases(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black/20" />
    </div>
  );

  if (releases.length === 0) return (
    <div className="p-16 text-center bg-white border border-black/[0.03] rounded-[40px] shadow-sm">
      <div className="w-16 h-16 bg-[#f5f5f7] rounded-[24px] flex items-center justify-center mx-auto mb-6 text-black/10">
        <Box size={32} />
      </div>
      <h3 className="text-[#1d1d1f] text-2xl font-black mb-2">No releases yet</h3>
      <p className="text-black/40 font-bold text-sm max-w-xs mx-auto">Please check back later.</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {releases.map((rel) => <ReleaseItem key={rel.tag_name} release={rel} />)}
    </motion.div>
  );
};
