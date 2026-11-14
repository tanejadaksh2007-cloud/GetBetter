import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Star, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';

export default function CoachDirectory() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState('all');
  const [agent, setAgent] = useState('all');

  const specialties = [
    { label: 'All Specialties', value: 'all' },
    { label: 'IGL / Shotcalling', value: 'IGL' },
    { label: 'Controller Protocols', value: 'controller' },
    { label: 'Anti-Stratting', value: 'anti-strat' }
  ];

  const agentList = [
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
    try {
      const params = new URLSearchParams();
      if (specialty !== 'all') params.append('specialty', specialty);
      if (agent !== 'all') params.append('agent', agent);

      const res = await fetch(`/api/coaches?${params.toString()}`);
      const json = await res.json();
      setCoaches(json.data || []);
    } catch (err) {
      console.error('Failed to load coaches', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-valCard via-slate-900 to-valDark border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-valRed/30 text-valRed text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5" /> Aim Declining • Brain Peaking
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Veteran Coach Directory
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mt-1">
            Connect with seasoned former Tier 2, collegiate, and CS:GO veterans who translate deep tactical macro, mid-rounding, and anti-stratting to your roster.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-valCard border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Filter className="w-4 h-4 text-valRed" />
          <span className="font-semibold text-slate-200">Filter Roster:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Specialty Dropdown */}
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:border-valRed focus:outline-none"
          >
            {specialties.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Agent Dropdown */}
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:border-valRed focus:outline-none"
          >
            <option value="all">All Agent Focuses</option>
            {agentList.filter((a) => a !== 'all').map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Coach Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading veteran coaches...</div>
      ) : coaches.length === 0 ? (
        <div className="text-center py-16 bg-valCard rounded-xl border border-slate-800 text-slate-400">
          No coaches found matching selected filters. Try broadening your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-valCard border border-slate-800 hover:border-slate-700 rounded-xl p-6 flex flex-col justify-between shadow-xl transition-all hover:translate-y-[-2px] group"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-valRed transition-colors">
                      {coach.name}
                    </h2>
                    <span className="text-xs text-valTeal font-medium">
                      Former: {coach.formerRole}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-300">
                      ${coach.hourlyRate}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/ hour</span>
                  </div>
                </div>

                {/* Specialty Pill */}
                <div className="inline-block bg-slate-900 border border-slate-700 px-2.5 py-1 rounded text-xs text-slate-300 uppercase font-bold tracking-wider mb-3">
                  Specialty: <span className="text-valRed">{coach.specialty}</span>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {coach.bio}
                </p>

                {/* Agent Badges */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Agent Mastery:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {coach.agents.map((ag) => (
                      <span
                        key={ag}
                        className="bg-slate-800/80 text-slate-200 border border-slate-700/60 text-[11px] px-2 py-0.5 rounded font-mono"
                      >
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verified Results Highlight */}
                {coach.results && coach.results.length > 0 && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Verified Progression</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold">
                        {coach.results[0].team}:
                      </span>{' '}
                      Improved from{' '}
                      <span className="text-rose-400 font-mono font-medium">
                        {coach.results[0].before}
                      </span>{' '}
                      to{' '}
                      <span className="text-emerald-400 font-mono font-medium">
                        {coach.results[0].after}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action */}
              <Link
                to={`/coaches/${coach.id}`}
                className="w-full text-center bg-slate-800 hover:bg-valRed text-white text-xs font-bold py-2.5 rounded-lg border border-slate-700 hover:border-valRed transition-colors shadow-sm uppercase tracking-wider"
              >
                View Profile & Book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
