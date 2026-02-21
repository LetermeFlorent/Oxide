import React, { useState } from "react";
import { Download, Terminal, Layers, Shield, Cpu, Github, ChevronRight, Layout, Zap, Package, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FileExplorer } from "./components/FileExplorer";

const App: React.FC = () => {
  const [isInstalling, setIsInstalling] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              O
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 uppercase">Oxide</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition-colors">Explorer</a>
            <a href="#tech" className="hover:text-zinc-900 transition-colors">Infrastructure</a>
            <a href="#install" className="hover:text-zinc-900 transition-colors">Open Source</a>
          </div>
          <a 
            href="https://github.com/LetermeFlorent/Oxide" 
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-zinc-900/10"
          >
            <Github size={16} /> GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-10 shadow-sm shadow-indigo-100/50"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            v1.1.0 Beta Runtime Ready
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight text-zinc-900"
          >
            Develop with <br/> <span className="text-indigo-600 italic">Total Control.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Oxide is a high-end workspace infrastructure that bridges web flexibility and native power. Built for engineers who demand speed and elegance.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <button 
              onClick={() => setIsInstalling(!isInstalling)}
              className="px-10 py-4.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold transition-all flex items-center gap-3 shadow-2xl shadow-zinc-900/30 group"
            >
              <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
              {isInstalling ? "Close Explorer" : "Explore Source Code"}
            </button>
            <a 
              href="https://github.com/LetermeFlorent/Oxide" 
              className="px-10 py-4.5 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-2xl font-bold transition-all shadow-xl shadow-zinc-200/50 flex items-center gap-2"
            >
              Documentation <ChevronRight size={18} />
            </a>
          </motion.div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </header>

      {/* File Explorer Integration */}
      <AnimatePresence>
        {isInstalling && (
          <section id="install" className="px-6 py-10">
            <FileExplorer />
          </section>
        )}
      </AnimatePresence>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Feature 
              icon={<Terminal size={24} />} 
              title="Native PTY Engine" 
              desc="Real-time shell execution via Rust backend. Zero-latency streaming for high-throughput development." 
            />
            <Feature 
              icon={<Layout size={24} />} 
              title="Glassmorphism UI" 
              desc="A modular, translucent interface designed for clarity and aesthetic perfection." 
            />
            <Feature 
              icon={<Zap size={24} />} 
              title="Ultra Low Overhead" 
              desc="Running on Tauri v2 with less than 50MB RAM usage. Performance that feels native." 
            />
          </div>
        </div>
      </section>

      {/* Tech Architecture */}
      <section id="tech" className="py-32 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-600/20">
              <Cpu size={24} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-8 leading-tight italic">Built on Enterprise Standards.</h2>
            <p className="text-zinc-500 text-lg mb-10 leading-relaxed font-medium">
              Oxide isn't just an app; it's a modular system. We leverage the safety of Rust and the flexibility of React 19 to provide a stable, future-proof environment.
            </p>
            <div className="space-y-4">
              <TechItem label="Tauri v2 Core" value="Rust Infrastructure" />
              <TechItem label="React 19" value="Modern Virtual DOM" />
              <TechItem label="LSM Engine" value="Sled High-Speed DB" />
              <TechItem label="Xterm.js" value="Hardware Acceleration" />
            </div>
          </div>
          <div className="flex-1 w-full h-[400px] bg-zinc-200 rounded-[40px] border border-zinc-300 shadow-inner overflow-hidden flex items-center justify-center">
            <Package size={80} className="text-zinc-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-zinc-900 text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center font-bold text-[10px] text-white">O</div>
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Oxide Framework © 2026</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold">
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline italic">Architecture</a>
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline italic">Benchmarks</a>
            <a href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline italic">Contributors</a>
          </div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            Open Source Excellence
          </p>
        </div>
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <motion.div whileHover={{ y: -5 }} className="group">
    <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 mb-8 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-zinc-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-zinc-500 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const TechItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between py-4 border-b border-zinc-200">
    <span className="font-bold text-zinc-900 text-sm tracking-tight">{label}</span>
    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{value}</span>
  </div>
);

export default App;
