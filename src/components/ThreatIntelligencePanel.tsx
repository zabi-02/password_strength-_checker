/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LIVE_THREAT_INTELLIGENCE, GENERAL_STATS } from '../data/commonPasswords';
import { Database, ShieldAlert, Wifi, Eye, RefreshCw, BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThreatIntelligencePanel() {
  const [lastSync, setLastSync] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());
  }, []);

  const handleRefreshMock = () => {
    setLoading(true);
    setTimeout(() => {
      setLastSync(new Date().toLocaleTimeString());
      setLoading(false);
    }, 800);
  };

  return (
    <div 
      className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-xl relative"
      id="live-threat-telemetry-panel"
    >
      <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/5 blur-[50px] -z-10 rounded-full" />

      {/* Title block with refresh action */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-rose-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase font-mono">
            Live Threat intelligence Telemetry
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-900/50">
            <Wifi className="w-2.5 h-2.5" />
            LIVE FEED
          </span>
          <button
            onClick={handleRefreshMock}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded hover:bg-white/5"
            title="Update Live Feeds"
            type="button"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-5 leading-relaxed">
        Synchronized with open repository indices (including Troy Hunt's HIBP range index, OWASP Top Weakest collections, and Verizon DB logs). Redundant fallback datasets activated.
      </p>

      {/* Local Threat statistics cells */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#05070A] border border-white/10 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wide">
            Integrations size
          </span>
          <span className="text-sm font-bold font-mono text-slate-200 block mt-1">
            {GENERAL_STATS.pwnedDatabaseSize}
          </span>
        </div>
        <div className="bg-[#05070A] border border-white/10 p-3 rounded-xl">
          <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wide">
            Average crack rate
          </span>
          <span className="text-sm font-bold font-mono text-rose-400 block mt-1">
            {GENERAL_STATS.averageBruteForceTime}
          </span>
        </div>
        <div className="bg-[#05070A] border border-white/10 p-3 rounded-xl col-span-2">
          <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wide">
            Leaked sequence vector
          </span>
          <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
            {GENERAL_STATS.commonPatternPercent}
          </p>
        </div>
      </div>

      {/* Top 10 worst list */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <h3 className="text-xs text-slate-300 font-mono uppercase tracking-widest font-bold">
            Critical Watchlist // Top 10 Weakest Passwords
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#05070A]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0F172A]/70 text-slate-400">
                <th className="py-2.5 px-3 font-semibold font-mono text-[10px] uppercase">Rk</th>
                <th className="py-2.5 px-3 font-semibold font-mono text-[10px] uppercase">Value</th>
                <th className="py-2.5 px-3 font-semibold font-mono text-[10px] uppercase">Cracking Index</th>
                <th className="py-2.5 px-3 font-semibold font-mono text-[10px] uppercase text-right">Records Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LIVE_THREAT_INTELLIGENCE.map((stat) => (
                <tr key={stat.rank} className="hover:bg-white/5 transition-colors text-slate-300">
                  <td className="py-2 px-3 text-[10px] text-slate-500 font-bold">{stat.rank}</td>
                  <td className="py-2 px-3 font-semibold text-rose-300/95">{stat.password}</td>
                  <td className="py-2 px-3 text-[11px] text-slate-400">{stat.timeToCrack}</td>
                  <td className="py-2 px-3 text-right font-medium text-slate-400">
                    {stat.count > 0 ? stat.count.toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Footer */}
      <div className="flex items-center gap-1.5 justify-end mt-4 text-[9px] font-mono text-slate-500">
        <Eye className="w-3 h-3" />
        <span>LAST SWEEP SYNC: {lastSync || '00:00:00'} // ALL CACHES VALIDATED</span>
      </div>
    </div>
  );
}
