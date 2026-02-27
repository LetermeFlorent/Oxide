import React from "react";
import { Button } from "../ui/Button";
import { t } from "../../i18n";
import { ArrowRight } from "lucide-react";

export const Hero: React.FC<{ onDownload: () => void }> = ({ onDownload }) => (
  <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
    <div className="flex flex-col items-center text-center space-y-8">
      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring bg-secondary text-secondary-foreground">
        Alpha Version 1.1.12
      </div>
      <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter max-w-4xl text-foreground">
        {t("hero.title")}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium tracking-tight">
        {t("hero.subtitle")}
      </p>
      <div className="flex items-center gap-4">
        <Button size="lg" onClick={onDownload} className="rounded-full shadow-lg">
          {t("hero.cta")} <ArrowRight className="ml-2" size={18} />
        </Button>
        <Button size="lg" variant="outline" className="rounded-full">
          {t("hero.docs")}
        </Button>
      </div>
    </div>
  </section>
);
