import React from "react";
import { Terminal, Layout, Zap, Cpu, Undo, ZoomIn, Keyboard, Search } from "lucide-react";
import { Card, CardTitle } from "../ui/Card";
import { t } from "../../i18n";

export const BentoGrid: React.FC = () => (
  <section id="performance" className="py-24 px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="md:col-span-2 p-6 flex flex-col justify-end min-h-[300px] border-none shadow-none bg-muted/50">
        <Terminal size={48} className="mb-6 text-primary" />
        <CardTitle className="text-3xl font-bold tracking-tight mb-2">{t("bento.native_title")}</CardTitle>
        <p className="text-muted-foreground font-medium max-w-md">{t("bento.native_desc")}</p>
      </Card>
      
      <Card className="p-6 flex flex-col items-center justify-center text-center border-none shadow-none bg-muted/50">
        <Layout size={40} className="mb-4 text-primary" />
        <CardTitle className="text-xl font-bold tracking-tight mb-2">{t("bento.glass_title")}</CardTitle>
        <p className="text-muted-foreground text-sm font-medium">{t("bento.glass_desc")}</p>
      </Card>
      
      <Card className="p-6 flex flex-col items-center justify-center text-center border-none shadow-none bg-muted/50">
        <Zap size={40} className="mb-4 text-primary" />
        <CardTitle className="text-xl font-bold tracking-tight mb-2">{t("bento.minimal_title")}</CardTitle>
        <p className="text-muted-foreground text-sm font-medium">{t("bento.minimal_desc")}</p>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center text-center border-none shadow-none bg-muted/50">
        <Undo size={40} className="mb-4 text-primary" />
        <CardTitle className="text-xl font-bold tracking-tight mb-2">{t("bento.undo_title")}</CardTitle>
        <p className="text-muted-foreground text-sm font-medium">{t("bento.undo_desc")}</p>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center text-center border-none shadow-none bg-muted/50">
        <ZoomIn size={40} className="mb-4 text-primary" />
        <CardTitle className="text-xl font-bold tracking-tight mb-2">{t("bento.zoom_title")}</CardTitle>
        <p className="text-muted-foreground text-sm font-medium">{t("bento.zoom_desc")}</p>
      </Card>

      <Card className="md:col-span-2 p-6 flex flex-col justify-end min-h-[300px] border-none shadow-none bg-muted/50">
        <Cpu size={48} className="mb-6 text-primary" />
        <CardTitle className="text-3xl font-bold tracking-tight mb-2">{t("bento.future_title")}</CardTitle>
        <p className="text-muted-foreground font-medium max-w-lg">{t("bento.future_desc")}</p>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center text-center border-none shadow-none bg-muted/50">
        <Keyboard size={40} className="mb-4 text-primary" />
        <CardTitle className="text-xl font-bold tracking-tight mb-2">{t("bento.shortcuts_title")}</CardTitle>
        <p className="text-muted-foreground text-sm font-medium">{t("bento.shortcuts_desc")}</p>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center text-center border-none shadow-none bg-muted/50">
        <Search size={40} className="mb-4 text-primary" />
        <CardTitle className="text-xl font-bold tracking-tight mb-2">{t("bento.watcher_title")}</CardTitle>
        <p className="text-muted-foreground text-sm font-medium">{t("bento.watcher_desc")}</p>
      </Card>
    </div>
  </section>
);
