import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function ScrimScheduler() {
  const [scrims, setScrims] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Scrim Form State
  const [teamId, setTeamId] = useState('team-001');
  const [opponent, setOpponent] = useState('NYU Violets');
  const [datetime, setDatetime] = useState('2026-11-21T20:00');
  const [map, setMap] = useState('Ascent');
  const [status, setStatus] = useState('scheduled');

  const mapsList = ['Ascent', 'Bind', 'Haven', 'Split', 'Lotus', 'Sunset', 'Abyss'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [scrimsRes, teamsRes] = await Promise.all([
        fetch('/api/scrims'),
        fetch('/api/teams')
      ]);
      const scrimsJson = await scrimsRes.json();
      const teamsJson = await teamsRes.json();

      setTeams(teamsJson.data || []);
      let list = scrimsJson.data || [];

      // If empty, seed initial dummy scrims
      if (list.length === 0) {
        const seed1 = {
          teamId: 'team-001',
          opponent: 'NYU Violets (Collegiate)',
          datetime: '2026-11-18T19:00',
          map: 'Ascent',
          status: 'scheduled'
        };
        const seed2 = {
          teamId: 'team-001',
          opponent: 'Penn State Nittany Gaming',
          datetime: '2026-11-15T21:00',
          map: 'Haven',
          status: 'completed'
        };
        await fetch('/api/scrims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seed1)
        });
        await fetch('/api/scrims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seed2)
        });
        const fresh = await (await fetch('/api/scrims')).json();
        list = fresh.data || [];
      }

      setScrims(list);
    } catch (err) {
      console.error('Error fetching scrim data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScrim = async (e) => {
    e.preventDefault();
    if (!opponent || !datetime) return;
    try {
      const res = await fetch('/api/scrims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, opponent, datetime, map, status })
      });
      const json = await res.json();
      if (json.data) {
        setScrims([json.data, ...scrims]);
        setOpponent('');
      }
    } catch (err) {
      console.error('Failed to create scrim', err);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            <Clock className="w-3 h-3" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-valCard border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Calendar className="w-7 h-7 text-valRed" /> Scrim Schedule & Tactical Warmups
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Book private practice lobbies against fellow collegiate and semi-pro teams with pre-agreed map vetoes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to Book Scrim */}
        <div className="bg-valCard border border-slate-800 rounded-xl p-6 shadow-xl h-fit">
          <h2 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-valRed" /> Schedule Practice Scrim
          </h2>

          <form onSubmit={handleCreateScrim} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Your Team
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:border-valRed focus:outline-none"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Opponent Team
              </label>
              <input
                type="text"
                placeholder="e.g. Rutgers Scarlet or Team Liquid Academy"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:border-valRed focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Map Selection
              </label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:border-valRed focus:outline-none"
              >
                {mapsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:border-valRed focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Match Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:border-valRed focus:outline-none"
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-valRed hover:bg-valRedDark text-white font-bold py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow-md"
            >
              Confirm Scrim Slot
            </button>
          </form>
        </div>

        {/* Scrims List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Upcoming & Recent Scrims
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {scrims.length} matches logged
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading scrim records...</div>
          ) : scrims.length === 0 ? (
            <div className="text-center py-12 bg-valCard rounded-xl border border-slate-800 text-slate-400 text-xs">
              No scrims scheduled. Use the form to book your first practice lobby.
            </div>
          ) : (
            <div className="space-y-3">
              {scrims.map((scrim) => {
                const teamName = teams.find((t) => t.id === scrim.teamId)?.name || 'Team 1';
                const formattedDate = new Date(scrim.datetime).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={scrim.id}
                    className="bg-valCard border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-white">
                          {teamName} <span className="text-valRed font-normal">vs</span> {scrim.opponent}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-valTeal" /> {scrim.map}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">{getStatusBadge(scrim.status)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
