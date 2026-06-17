/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { ShieldAlert, Cpu, HeartHandshake } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 outline-none pb-12">
      {/* Immersive glowing cyber matrix canvas */}
      <AnimatedBackground />

      {/* Military Grade Top Header */}
      <Header />

      {/* Main interactive cockpit */}
      <main className="flex-1">
        <Dashboard />
      </main>

      {/* Zero Knowledge Cybersecurity Disclaimer Footer (Step 21) */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-slate-850/60 w-full text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wide">
            ZERO-KNOWLEDGE SECURITY PROTOCOL INDICES // STRICT OFFLINE RUNTIME
          </span>
          <p className="text-[11px] text-slate-400 mt-1 max-w-2xl font-mono leading-relaxed">
            All algorithms run strictly client-side on your local sandbox CPU thread. Character patterns, sequence arrays, and generated digests are processed locally and never uploaded to any server or cloud database. Your secret keys remain entirely inside your browser's private state index.
          </p>
        </div>
        <div className="flex md:self-end items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
          <HeartHandshake className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>CYBER RECRUIT PORTFOLIO SYSTEM v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
