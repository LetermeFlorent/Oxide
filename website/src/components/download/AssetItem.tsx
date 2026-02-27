import React from "react";
import { Download, Star } from "lucide-react";
import { Asset } from "./Release.types";
import { getAssetIcon, getAssetLabel } from "./ReleaseIcons";
import { Button } from "../ui/Button";
import { t } from "../../i18n";

export const AssetItem: React.FC<{ asset: Asset; recommended: boolean }> = ({ asset, recommended }) => (
  <Button
    key={asset.name}
    variant="secondary"
    className="h-auto py-3 px-5 rounded-xl group relative shadow-sm border bg-muted/50 hover:bg-muted"
    onClick={() => window.open(asset.browser_download_url)}
  >
    {recommended && (
      <div className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground p-1 rounded-full shadow-lg z-10">
        <Star size={10} fill="currentColor" />
      </div>
    )}
    <span className="opacity-40 group-hover:opacity-100 transition-opacity mr-3">
      {getAssetIcon(asset.name)}
    </span>
    <div className="flex flex-col items-start leading-tight">
      <span className="font-bold tracking-tight text-xs">{getAssetLabel(asset.name)}</span>
      {recommended && <span className="text-[9px] opacity-60 font-black uppercase text-primary">{t("download.recommended")}</span>}
    </div>
    <Download size={14} className="ml-3 opacity-20 group-hover:opacity-100 transition-all" />
  </Button>
);
