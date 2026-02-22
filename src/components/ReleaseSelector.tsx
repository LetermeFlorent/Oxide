/**
 * Project: Oxide Website
 * Responsibility: Vertical List Container for Releases
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
      .then(data => { 
        if (Array.isArray(data)) {
          // Sort releases by date descending (newest first)
          const sorted = [...data].sort((a, b) => 
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
          );
          setReleases(sorted); 
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black/20" /></div>;

  if (releases.length === 0) return (
    <div className="p-20 text-center bg-white border border-black/5 rounded-[40px]">
      <Box size={40} className="mx-auto mb-6 text-black/10" />
      <h3 className="text-xl font-black mb-2 text-[#1d1d1f]">Coming Soon</h3>
      <p className="text-black/40 font-bold text-xs uppercase tracking-widest">Stay tuned for the first build.</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-screen-lg mx-auto flex flex-col gap-4">
      {releases.map((rel) => <ReleaseItem key={rel.tag_name} release={rel} />)}
    </motion.div>
  );
};
