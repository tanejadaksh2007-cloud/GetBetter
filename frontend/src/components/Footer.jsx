import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-valDark border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-valTeal" />
          <span>Veteran App • For Semi-Pro & Collegiate VALORANT</span>
        </div>
        <div className="text-slate-400">
          <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium mr-2">
            PLACEHOLDER DATA
          </span>
          Live Riot data needs production API approval. Not affiliated with Riot Games.
        </div>
      </div>
    </footer>
  );
}
