import React, { useState, useEffect } from 'react';
import { Filter, Star, AlertCircle, Search, Crosshair } from 'lucide-react';
import CoachCard from '../components/ui/CoachCard';
import Chip from '../components/ui/Chip';
import StatBadge from '../components/ui/StatBadge';
import Button from '../components/ui/Button';

export default function CoachDirectory() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialty, setSpecialty] = useState('all');
  const [agent, setAgent] = useState('all');

  const specialtyFilters = [
    { label: 'All Specialties', value: 'all' },
    { label: 'IGL', value: 'IGL' },
    { label: 'Controller', value: 'controller' },
    { label: 'Anti-Strat', value: 'anti-strat' }
  ];

  const agentFilters = [
    'all',
    'Viper',
    'Omen',
    'Astra',
    'Brimstone',
    'Sova',
    'Fade',
    'Breach',
    'Cypher',
    'Killjoy',
    'Gekko'
  ];

  useEffect(() => {
    fetchCoaches();
  }, [specialty, agent]);

  const fetchCoaches = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (specialty !== 'all') params.append('specialty', specialty);
      if (agent !== 'all') params.append('agent', agent);

      const res = await fetch(`/api/coaches?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load coaches');
      const json = await res.json();
      setCoaches(json.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the coach directory.');
    } finally {
      setLoading(false);
    }
  };

  // Compute stats from data
  const totalCoaches = coaches.length;
  const uniqueSpecialtiesCount = new Set(coaches.map((c) => c.specialty)).size;
  const averageHourlyRate =
    totalCoaches > 0
      ? Math.round(coaches.reduce((sum, c) => sum + (c.hourlyRate || 0), 0) / totalCoaches)
      : 0;

  return (
    <div className="space-y-8">
      {/* 1. Hero Section with Angular accents & dynamic stats strip */}
      <div className="relative bg-[#14202C]/60 border border-valBorder p-6 sm:p-8 clip-cut-corner-br overflow-hidden">
        {/* Subtle diagonal background red tactical accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-valAccent/10 rotate-45 pointer-events-none border-l border-b border-valAccent/30" />
        <div className="absolute top-0 left-0 w-2 h-12 bg-valAccent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-black/40 border-l-2 border-l-valAccent text-[10px] font-mono uppercase tracking-widest text-valMuted">
              <Crosshair className="w-3 h-3 text-valAccent" />
              <span>Tactical Roster Growth // Season 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-valText font-rajdhani leading-none">
              Coach Directory
            </h1>
            <p className="text-xs sm:text-sm text-valMuted leading-relaxed">
              Connect with veteran competitive players who translate deep tactical macro, mid-rounding, and anti-stratting to your roster.
            </p>
          </div>

          {/* Stats strip computed from coach data */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <StatBadge
              label="Available"
              value={totalCoaches}
              sublabel="Active coaches"
            />
            <StatBadge
              label="Specialties"
              value={uniqueSpecialtiesCount || 3}
              sublabel="Macro roles"
            />
            <StatBadge
              label="Avg Rate"
              value={`$${averageHourlyRate}`}
              sublabel="Per hour"
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </div>
      </div>

      {/* 2. Tactical Pill Filter Bar */}
      <div className="bg-valCard border border-valBorder p-4 sm:p-5 clip-cut-corner-br space-y-4">
        {/* Specialty Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-valMuted">
            <Filter className="w-3.5 h-3.5 text-valAccent" />
            <span>Specialty Focus:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {specialtyFilters.map((s) => (
              <Chip
                key={s.value}
                label={s.label}
                active={specialty === s.value}
                onClick={() => setSpecialty(s.value)}
              />
            ))}
          </div>
        </div>

        {/* Compact Agent Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-valBorderSubtle">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-valMuted">
            Agent Focus:
          </span>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {agentFilters.map((ag) => (
              <button
                key={ag}
                type="button"
                onClick={() => setAgent(ag)}
                className={`text-[11px] font-mono px-2.5 py-1 transition-all duration-150 uppercase cursor-pointer select-none border ${
                  agent === ag
                    ? 'bg-valAccent text-white border-valAccent font-bold'
                    : 'bg-[#121C26] text-valMuted border-valBorder hover:text-white hover:border-slate-500'
                }`}
              >
                {ag === 'all' ? 'All Agents' : ag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Coach Cards Grid / Loading Skeletons / Empty State */}
      {error ? (
        <div className="bg-valCard border border-red-900/40 p-12 text-center text-rose-300 clip-cut-corner-br space-y-3">
          <AlertCircle className="w-8 h-8 text-valAccent mx-auto" />
          <p className="text-sm font-semibold">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchCoaches}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-valCard border border-valBorder p-6 animate-pulse clip-cut-corner-br space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-slate-800 clip-cut-corner-tl" />
                <div className="h-6 w-16 bg-slate-800" />
              </div>
              <div className="h-4 w-32 bg-slate-800" />
              <div className="h-16 w-full bg-slate-800/60" />
              <div className="h-4 w-full bg-slate-800/40" />
              <div className="h-10 w-full bg-slate-800" />
            </div>
          ))}
        </div>
      ) : coaches.length === 0 ? (
        <div className="bg-valCard border border-valBorder p-12 text-center text-valMuted clip-cut-corner-br space-y-3">
          <Search className="w-8 h-8 text-valMuted mx-auto mb-1" />
          <h3 className="text-xl font-bold uppercase font-rajdhani text-valText">
            No Coaches Found
          </h3>
          <p className="text-xs text-valMuted max-w-sm mx-auto">
            No coaches match the chosen specialty and agent parameters.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSpecialty('all');
                setAgent('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      )}
    </div>
  );
}
