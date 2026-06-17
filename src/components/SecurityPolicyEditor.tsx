/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityPolicy } from '../types';
import { ShieldCheck, Settings, AlertTriangle } from 'lucide-react';

interface PolicyEditorProps {
  policy: SecurityPolicy;
  onPolicyChange: (policy: SecurityPolicy) => void;
}

export default function SecurityPolicyEditor({ policy, onPolicyChange }: PolicyEditorProps) {
  const handleToggle = (key: keyof SecurityPolicy) => {
    if (key === 'minLength') return;
    onPolicyChange({
      ...policy,
      [key]: !policy[key]
    });
  };

  const handleLengthChange = (val: number) => {
    onPolicyChange({
      ...policy,
      minLength: val
    });
  };

  return (
    <div 
      className="bg-[#0F172A] border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden"
      id="security-policy-compliance-panel"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-[50px] -z-10 rounded-full" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2.5">
        <Settings className="w-4 h-4 text-emerald-400 animate-spin-slow" />
        <h2 className="text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono">
          Strict Compliance Standards Policy
        </h2>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
        Customize administrative policies dynamically. Restructure threshold rules to trigger active compliance checklist audits during telemetry tests.
      </p>

      <div className="space-y-3">
        {/* Min Length Config */}
        <div className="bg-[#05070A] border border-white/10 p-2.5 rounded-xl">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono text-slate-300">Minimum Permitted Length</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{policy.minLength} Chars</span>
          </div>
          <input
            type="range"
            min={6}
            max={32}
            value={policy.minLength}
            onChange={(e) => handleLengthChange(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 h-1 bg-[#0F172A] rounded-lg cursor-pointer appearance-none"
            id="policy-len-slider"
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => handleToggle('requireUppercase')}
            className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-with-all ${
              policy.requireUppercase
                ? 'bg-[#05070A] border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700'
            }`}
            type="button"
          >
            <span className="font-mono">Require Uppercase</span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policy.requireUppercase ? 'border-emerald-500 bg-emerald-950 text-emerald-400' : 'border-slate-700'}`}>
              {policy.requireUppercase && <span className="text-[9px] font-bold">✔</span>}
            </div>
          </button>

          <button
            onClick={() => handleToggle('requireLowercase')}
            className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-with-all ${
              policy.requireLowercase
                ? 'bg-[#05070A] border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700'
            }`}
            type="button"
          >
            <span className="font-mono">Require Lowercase</span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policy.requireLowercase ? 'border-emerald-500 bg-emerald-950 text-emerald-400' : 'border-slate-700'}`}>
              {policy.requireLowercase && <span className="text-[9px] font-bold">✔</span>}
            </div>
          </button>

          <button
            onClick={() => handleToggle('requireNumbers')}
            className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-with-all ${
              policy.requireNumbers
                ? 'bg-[#05070A] border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700'
            }`}
            type="button"
          >
            <span className="font-mono">Require Digits</span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policy.requireNumbers ? 'border-emerald-500 bg-emerald-950 text-emerald-400' : 'border-slate-700'}`}>
              {policy.requireNumbers && <span className="text-[9px] font-bold">✔</span>}
            </div>
          </button>

          <button
            onClick={() => handleToggle('requireSymbols')}
            className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-with-all ${
              policy.requireSymbols
                ? 'bg-[#05070A] border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700'
            }`}
            type="button"
          >
            <span className="font-mono">Require Special Syms</span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policy.requireSymbols ? 'border-emerald-500 bg-emerald-950 text-emerald-400' : 'border-slate-700'}`}>
              {policy.requireSymbols && <span className="text-[9px] font-bold">✔</span>}
            </div>
          </button>

          <button
            onClick={() => handleToggle('banSequential')}
            className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-with-all ${
              policy.banSequential
                ? 'bg-[#05070A] border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700'
            }`}
            type="button"
          >
            <span className="font-mono">Ban Sequential Patterns</span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policy.banSequential ? 'border-emerald-500 bg-emerald-950 text-emerald-400' : 'border-slate-700'}`}>
              {policy.banSequential && <span className="text-[9px] font-bold">✔</span>}
            </div>
          </button>

          <button
            onClick={() => handleToggle('banRepeats')}
            className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-with-all ${
              policy.banRepeats
                ? 'bg-[#05070A] border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700'
            }`}
            type="button"
          >
            <span className="font-mono">Ban Repeating Strings</span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policy.banRepeats ? 'border-emerald-500 bg-emerald-950 text-emerald-400' : 'border-slate-700'}`}>
              {policy.banRepeats && <span className="text-[9px] font-bold">✔</span>}
            </div>
          </button>

          <button
            onClick={() => handleToggle('banCommon')}
            className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-with-all ${
              policy.banCommon
                ? 'bg-[#05070A] border-emerald-500/50 text-emerald-300 font-bold'
                : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700'
            }`}
            type="button"
          >
            <span className="font-mono">Block Leaked Lists</span>
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policy.banCommon ? 'border-emerald-500 bg-emerald-950 text-emerald-400' : 'border-slate-700'}`}>
              {policy.banCommon && <span className="text-[9px] font-bold">✔</span>}
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 pt-2 text-[10px] text-amber-500 font-mono">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <span>TIGHTENING CONTROLS REDUCES AVERAGE SCORE MARGINS.</span>
      </div>
    </div>
  );
}
