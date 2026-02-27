import React from "react";
import { Card, CardTitle } from "../ui/Card";

const TechLine = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between py-5 border-b last:border-0 group">
    <span className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
    <span className="text-xs font-black uppercase tracking-widest text-primary">{value}</span>
  </div>
);

export const TechSpecs: React.FC = () => (
  <section id="tech" className="py-24 px-6 max-w-4xl mx-auto border-t">
    <div className="text-center mb-16 space-y-4">
      <h2 className="text-4xl font-extrabold tracking-tighter">Built on Open Standards.</h2>
      <p className="text-muted-foreground font-medium text-lg">Engineered from the ground up for stability.</p>
    </div>
    <Card className="p-8 shadow-sm">
      <TechLine label="Infrastructure" value="Tauri Core / Rust" />
      <TechLine label="Frontend Layer" value="React / Vite / TypeScript" />
      <TechLine label="Database Engine" value="LSM Sled Storage" />
      <TechLine label="Visual Interface" value="Tailwind / Framer Motion" />
    </Card>
  </section>
);
