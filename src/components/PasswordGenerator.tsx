/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GeneratorOptions } from '../types';
import { generatePassword } from '../utils/generator';
import { ShieldCheck, Copy, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';

interface GeneratorProps {
  onUsePassword: (password: string) => void;
}

export default function PasswordGenerator({ onUsePassword }: GeneratorProps) {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false,
  });

  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const pw = generatePassword(options);
    setGenerated(pw);
    setCopied(false);
  };

  // Re-generate on any options change
  useEffect(() => {
    handleGenerate();
  }, [options]);

  const handleCopyToClipboard = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed: ', err);
    }
  };

  const setLength = (l: number) => {
    setOptions(prev => ({ ...prev, length: l }));
  };

  return (
    <div 
      className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden" 
      id="cyber-password-generator-box"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] -z-10 rounded-full" />
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
        <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase font-mono">
          Security Sandbox Generator
        </h2>
      </div>

      {/* Output Display */}
      <div className="relative mb-6">
        <label className="text-[10px] font-mono text-slate-500 block mb-1 uppercase tracking-widest">
          Cryptographically Isolated Output
        </label>
        <div className="flex items-center gap-2 bg-[#05070A] border border-white/10 rounded-xl p-3 pr-2 select-all font-mono text-cyan-200 tracking-wider text-sm md:text-base break-all min-h-[50px] overflow-hidden justify-between">
          <span>{generated || "Configure parameters..."}</span>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              onClick={handleCopyToClipboard}
              disabled={!generated}
              className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg"
              title="Copy to clipboard"
              type="button"
              id="copy-gen-btn"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copied && (
          <span className="text-[10px] font-mono text-emerald-400 absolute right-1 -bottom-4 translate-y-1 block animate-bounce">
            COPIED SUCCESSFULLY // SECURED
          </span>
        )}
      </div>

      {/* Configuration Sliders & Toggles */}
      <div className="space-y-4">
        {/* Preset Length Blocks */}
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-2 font-medium">
            Secret Key Length: <span className="text-cyan-400 font-bold font-mono">{options.length} Chars</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5 mb-2.5">
            {[12, 16, 20, 24, 32].map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`py-1.5 px-1 rounded-lg text-xs font-mono text-center border transition-all ${
                  options.length === len
                    ? 'bg-cyan-950/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-bold'
                    : 'bg-[#05070A] border-white/10 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
                type="button"
              >
                {len}
              </button>
            ))}
          </div>
          {/* Custom Slider */}
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 h-1 bg-[#05070A] rounded-lg cursor-pointer appearance-none"
            id="length-slider"
          />
        </div>

        {/* Check options grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => setOptions(prev => ({ ...prev, includeUppercase: e.target.checked }))}
              className="rounded bg-[#05070A] border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-mono">Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => setOptions(prev => ({ ...prev, includeLowercase: e.target.checked }))}
              className="rounded bg-[#05070A] border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-mono">Lowercase (a-z)</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions(prev => ({ ...prev, includeNumbers: e.target.checked }))}
              className="rounded bg-[#05070A] border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-mono">Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions(prev => ({ ...prev, includeSymbols: e.target.checked }))}
              className="rounded bg-[#05070A] border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-mono">Special Symbols</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
              className="rounded bg-[#05070A] border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-mono text-cyan-400" title="Exclude easily confused characters: i, l, 1, o, 0, O">
              Filter Similar (l, 1, 0, o)
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => setOptions(prev => ({ ...prev, excludeAmbiguous: e.target.checked }))}
              className="rounded bg-[#05070A] border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-mono" title='Exclude ambiguous symbols like { } [ ] ( ) / \ " ` ~ , ; :'>
              Exclude Ambiguous Key
            </span>
          </label>
        </div>

        {/* Action Triggers */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={handleGenerate}
            className="flex-1 py-2.5 bg-[#05070A] hover:bg-white/5 border border-white/10 text-slate-200 hover:text-white font-mono rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            type="button"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            CYCLE ENTROPY
          </button>
          
          <button
            onClick={() => onUsePassword(generated)}
            disabled={!generated}
            className="flex-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            type="button"
            id="use-password-btn"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            USE GENERATED VALUE
          </button>
        </div>
      </div>
    </div>
  );
}
