import React, { useEffect, useState } from "react";
import { Box } from "lucide-react";
import { motion } from "framer-motion";
import { Release } from "./ReleaseSelector.types";
import { ReleaseItem } from "./ReleaseItem";
import { Card } from "../ui/Card";
import { t } from "../../i18n";

export const ReleaseSelector: React.FC = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/LetermeFlorent/Oxide/releases")
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) {
          const sorted = [...data].sort((a, b) => 
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
          );
          setReleases(sorted); 
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/20" /></div>;

  if (releases.length === 0) return (
    <Card className="p-20 text-center bg-muted/30">
      <Box size={40} className="mx-auto mb-6 text-muted-foreground/30" />
      <h3 className="text-xl font-extrabold mb-2 text-foreground">{t("download.coming_soon")}</h3>
      <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">{t("download.stay_tuned")}</p>
    </Card>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-screen-lg mx-auto flex flex-col gap-4">
      {releases.map((rel) => <ReleaseItem key={rel.tag_name} release={rel} />)}
    </motion.div>
  );
};
