import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border py-6 text-xs text-muted mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-red shrink-0" />
          <span className="font-bold text-text uppercase tracking-wider font-rajdhani text-sm">
            VETERAN
          </span>
          <span className="text-muted hidden sm:inline">•</span>
          <span className="text-muted">
            Veteran - Bridging the esports experience gap. Built for Valorant competitors.
          </span>
        </div>
        <div className="text-muted font-mono text-[11px]">
          Placeholder data. Live Riot data needs production API approval.
        </div>
      </div>
    </footer>
  );
}
