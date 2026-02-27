import React from "react";
import { Monitor, Apple, Package, Terminal } from "lucide-react";

export interface Asset {
  name: string;
  browser_download_url: string;
}

export interface Release {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  assets: Asset[];
}

export const getAssetIcon = (name: string) => {
  const ext = name.toLowerCase();
  if (ext.endsWith(".exe") || ext.endsWith(".msi")) return <Monitor size={16} />;
  if (ext.endsWith(".dmg")) return <Apple size={16} />;
  const pkg = [".deb", ".rpm", ".appimage"];
  if (pkg.some(p => ext.endsWith(p))) return <Package size={16} />;
  return <Terminal size={16} />;
};

export const getAssetLabel = (name: string) => {
  const parts = name.split(".");
  const ext = parts.pop()?.toLowerCase() || "";
  return ext === "appimage" ? "AppImage" : ext.toUpperCase();
};
