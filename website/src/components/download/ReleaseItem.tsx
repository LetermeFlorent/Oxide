import React, { useMemo } from "react";
import { Release } from "./Release.types";
import { ReleaseHeader } from "./ReleaseHeader";
import { AssetItem } from "./AssetItem";
import { Card } from "../ui/Card";

export const ReleaseItem: React.FC<{ release: Release }> = ({ release }) => {
  const userOS = useMemo(() => {
    if (typeof window === "undefined") return null;
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("win")) return "windows";
    if (ua.includes("mac")) return "macos";
    if (ua.includes("fedora")) return "fedora";
    if (ua.includes("ubuntu") || ua.includes("debian")) return "debian";
    if (ua.includes("linux")) return "linux";
    return null;
  }, []);

  const isRec = (name: string) => {
    const ext = name.toLowerCase();
    if (!userOS) return false;
    if (userOS === "windows" && (ext.endsWith(".exe") || ext.endsWith(".msi"))) return true;
    if (userOS === "macos" && ext.endsWith(".dmg")) return true;
    if (userOS === "fedora" && ext.endsWith(".rpm")) return true;
    if (userOS === "debian" && ext.endsWith(".deb")) return true;
    if (userOS === "linux" && (ext.endsWith(".appimage") || ext.endsWith(".deb") || ext.endsWith(".rpm"))) return true;
    return false;
  };

  return (
    <Card className="w-full p-8 flex flex-col gap-8 hover:shadow-lg transition-all duration-500 group/card">
      <ReleaseHeader release={release} />
      <div className="flex flex-wrap gap-2.5">
        {release.assets.map((asset) => (
          <AssetItem key={asset.name} asset={asset} recommended={isRec(asset.name)} />
        ))}
      </div>
    </Card>
  );
};
