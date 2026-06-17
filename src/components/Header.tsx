/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, ServerCrash, Clock, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      className="border-b border-white/10 backdrop-blur-md bg-[#05070A]/90 sticky top-0 z-40 py-4 px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4"
      id="cyber-dashboard-main-header"
    >
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400 flex items-center justify-center rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-bold font-sans text-white tracking-tight uppercase leading-none">
            SENTINEL <span className="text-cyan-400 font-mono text-sm">v4.0</span>
          </h1>
          <p className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-[0.2em] mt-1">
            ADVANCED THREAT INTELLIGENCE // SEC-CORE
          </p>
        </div>
      </div>

      {/* Cyber Compliance Indices / Standards Tags */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] font-mono">
        <div className="bg-[#0F172A] border border-white/10 px-3 py-1.5 rounded-xl text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 block" />
          <span>NIST SP 800-63B</span>
        </div>
        <div className="bg-[#0F172A] border border-white/10 px-3 py-1.5 rounded-xl text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 block" />
          <span>OWASP ASVS v4.0</span>
        </div>

        {/* Real-time military clock display */}
        <div className="bg-[#0F172A] border border-cyan-500/20 px-3.5 py-1.5 rounded-xl font-bold text-green-400 flex items-center gap-2 shadow-[0_0_8px_rgba(34,197,94,0.2)] animate-pulse">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[10px] font-mono tracking-wider shrink-0 select-none uppercase">
            {utcTime || 'STABILIZING SENSORS...'}
          </span>
        </div>
      </div>
    </header>
  );
}
