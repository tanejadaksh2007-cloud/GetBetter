import React, { useState, useEffect } from 'react';
import { Users, UserPlus, CheckCircle, Search, Target, Shield, Sparkles } from 'lucide-react';

export default function TeamBuilder() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [missingRoles, setMissingRoles] = useState([]);
  const [matchedPlayers, setMatchedPlayers] = useState([]);
  const [matchedCoaches, setMatchedCoaches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLevel, setNewTeamLevel] = useState('college');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const availableRoles = [
    'Duelist',
    'Initiator',
    'Controller',
    'Sentinel',
    'IGL',
    'anti-strat'
  ];

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      const json = await res.json();
      const list = json.data || [];
      setTeams(list);
      if (list.length > 0 && !selectedTeamId) {
        setSelectedTeamId(list[0].id);
        setMissingRoles(list[0].missingRoles || []);
      }
    } catch (err) {
      console.error('Failed to load teams', err);
    }
  };

  const handleSelectTeam = (e) => {
    const tId = e.target.value;
    setSelectedTeamId(tId);
    const found = teams.find((t) => t.id === tId);
    if (found) {
      setMissingRoles(found.missingRoles || []);
    }
  };

  const toggleRole = (role) => {
    if (missingRoles.includes(role)) {
      setMissingRoles(missingRoles.filter((r) => r !== role));
    } else {
      setMissingRoles([...missingRoles, role]);
    }
  };

  const findCandidates = async () => {
    if (missingRoles.length === 0) return;
    setLoadingMatches(true);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missingRoles, agentsPreference: [] })
      });
      const json = await res.json();
      setMatchedPlayers(json.data?.matchedPlayers || []);
      setMatchedCoaches(json.data?.matchedCoaches || []);
    } catch (err) {
      console.error('Error fetching matches', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Run automatically when missingRoles changes
  useEffect(() => {
    if (missingRoles.length > 0) {
      findCandidates();
    } else {
      setMatchedPlayers([]);
      setMatchedCoaches([]);
    }
  }, [missingRoles]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeamName,
          level: newTeamLevel,
          members: [
            { puuid: 'ply-007', gameName: 'FlashBlink', role: 'Duelist' }
          ],
          missingRoles: ['Controller', 'IGL']
        })
      });
      const json = await res.json();
      if (json.data) {
        setTeams([...teams, json.data]);
        setSelectedTeamId(json.data.id);
        setMissingRoles(json.data.missingRoles);
        setShowCreateModal(false);
        setNewTeamName('');
      }
    } catch (err) {
      console.error('Error creating team', err);
    }
  };

  const currentTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-valCard border border-slate-800 rounded-2xl p-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-valRed" /> Team Builder & Role Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick your collegiate or semi-pro roster, declare missing roles, and discover ranked veterans or free agents.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-700 flex items-center gap-2 shadow-sm uppercase tracking-wider"
        >
          <UserPlus className="w-4 h-4 text-valTeal" /> New Team
        </button>
      </div>

      {/* Team Selection and Missing Role Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Team Selector & Current Roster */}
        <div className="bg-valCard border border-slate-800 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Active Team
            </label>
            <select
              value={selectedTeamId}
              onChange={handleSelectTeam}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:border-valRed focus:outline-none"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.level})
                </option>
              ))}
            </select>
          </div>

          {currentTeam && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Current Roster ({currentTeam.members?.length || 0}/5)
                </span>
                <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  {currentTeam.level}
                </span>
              </div>

              <div className="space-y-2">
                {currentTeam.members?.map((m) => (
                  <div
                    key={m.puuid}
                    className="flex justify-between items-center p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                  >
                    <span className="font-semibold text-white">{m.gameName}</span>
                    <span className="text-slate-400 font-mono">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Missing Roles Selector */}
        <div className="md:col-span-2 bg-valCard border border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-valRed" /> Missing Roles & Tactical Needs
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select what your squad is missing. Our engine ranks free agent players and veteran tactical mentors.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {availableRoles.map((role) => {
              const active = missingRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-valRed text-white border-valRed shadow-md shadow-red-950/40'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      active ? 'bg-white' : 'bg-slate-500'
                    }`}
                  />
                  {role}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-3 rounded border border-slate-800">
            Current filter tags:{' '}
            {missingRoles.length > 0 ? (
              <span className="text-valTeal font-bold">{missingRoles.join(', ')}</span>
            ) : (
              <span className="text-slate-500">None selected (Click roles above to match)</span>
            )}
          </div>
        </div>
      </div>

      {/* Matching Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Ranked Recommendations
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {loadingMatches ? 'Scoring roster...' : `${matchedCoaches.length} Coaches • ${matchedPlayers.length} Players`}
          </span>
        </div>

        {missingRoles.length === 0 ? (
          <div className="text-center py-12 bg-valCard rounded-xl border border-slate-800 text-slate-400 text-xs">
            Select at least one missing role above to view ranked candidate matches.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Veteran Coaches Matches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-valRed uppercase tracking-wider">
                  Veteran Coaches (Mid-Round / Macro)
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Ranked by synergy</span>
              </div>

              <div className="space-y-3">
                {matchedCoaches.slice(0, 3).map((coach) => (
                  <div
                    key={coach.id}
                    className="bg-valCard border border-slate-800 hover:border-valRed/50 rounded-xl p-4 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-base font-bold text-white block">
                          {coach.name}
                        </span>
                        <span className="text-xs text-valTeal">
                          Specialty: {coach.specialty}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {coach.matchScore} pts
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          ${coach.hourlyRate}/hr
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 text-xs text-slate-400 space-y-1">
                      {coach.matchReasons?.map((reason, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-emerald-300">
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-between items-center pt-2 border-t border-slate-800/80">
                      <div className="flex gap-1">
                        {coach.agents?.map((a) => (
                          <span
                            key={a}
                            className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded font-mono"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                      <a
                        href={`/coaches/${coach.id}`}
                        className="text-xs text-valRed font-bold hover:underline"
                      >
                        Profile →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Free Agent Players Matches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-valTeal uppercase tracking-wider">
                  Active Players / Free Agents
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Role compatibility</span>
              </div>

              <div className="space-y-3">
                {matchedPlayers.slice(0, 4).map((p) => (
                  <div
                    key={p.puuid}
                    className="bg-valCard border border-slate-800 hover:border-teal-500/50 rounded-xl p-4 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-base font-bold text-white block">
                          {p.gameName} <span className="text-xs text-slate-400">#{p.tagLine}</span>
                        </span>
                        <span className="text-xs text-amber-300 font-mono font-bold">
                          {p.role}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800">
                        {p.matchScore} pts
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-400 space-y-1">
                      {p.matchReasons?.map((reason, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-teal-300">
                          <CheckCircle className="w-3 h-3 text-teal-400 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-1 pt-2 border-t border-slate-800/80">
                      {p.agents?.map((a) => (
                        <span
                          key={a}
                          className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded font-mono"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-valCard border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 uppercase">Create New Team</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Spartan Prime"
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-valRed focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Competition Level
                </label>
                <select
                  value={newTeamLevel}
                  onChange={(e) => setNewTeamLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-valRed focus:outline-none"
                >
                  <option value="college">Collegiate (NACE / Red Bull Campus)</option>
                  <option value="semi-pro">Semi-Pro / Premier Contender</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-valRed hover:bg-valRedDark text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
