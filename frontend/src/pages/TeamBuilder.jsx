import React, { useState, useEffect } from 'react';
import { Users, UserPlus, CheckCircle, Target, Sparkles, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/ui/PageHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function TeamBuilder() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [missingRoles, setMissingRoles] = useState([]);
  const [matchedPlayers, setMatchedPlayers] = useState([]);
  const [matchedCoaches, setMatchedCoaches] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLevel, setNewTeamLevel] = useState('college');

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
    setLoadingTeams(true);
    setError(null);
    try {
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error('Failed to fetch teams');
      const json = await res.json();
      const list = json.data || [];
      setTeams(list);
      if (list.length > 0 && !selectedTeamId) {
        setSelectedTeamId(list[0].id);
        setMissingRoles(list[0].missingRoles || []);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load team rosters from the server.');
    } finally {
      setLoadingTeams(false);
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
        setMissingRoles(json.data.missingRoles || []);
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
      {/* Page Header */}
      <PageHeader
        badge={
          <Badge variant="accent" size="sm">
            <Users className="w-3 h-3 inline mr-1" /> Roster Architecture
          </Badge>
        }
        title="Team Builder & Role Matcher"
        description="Pick your squad, declare missing tactical requirements, and match with ranked free agents or veteran coaches based on utility overlap."
        actions={
          <Button variant="secondary" size="md" onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 text-valAccent" /> Create Team
          </Button>
        }
      />

      {error ? (
        <Card className="text-center py-12 text-rose-300">
          <AlertCircle className="w-8 h-8 text-valAccent mx-auto mb-2" />
          <p className="text-sm font-semibold">{error}</p>
        </Card>
      ) : loadingTeams ? (
        <LoadingSkeleton count={2} type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Team Selector & Roster */}
          <Card className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-valMuted mb-2">
                Select Active Team
              </label>
              <select
                value={selectedTeamId}
                onChange={handleSelectTeam}
                className="w-full bg-[#121C26] border border-valBorder text-slate-200 text-xs sm:text-sm rounded-lg p-2.5 focus:border-valAccent focus:outline-none transition-colors"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.level})
                  </option>
                ))}
              </select>
            </div>

            {currentTeam && (
              <div className="space-y-3 pt-2 border-t border-valBorder">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-valMuted uppercase tracking-wider">
                    Current Roster ({currentTeam.members?.length || 0}/5)
                  </span>
                  <Badge variant="teal" size="sm">
                    {currentTeam.level}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {currentTeam.members?.map((m) => (
                    <div
                      key={m.puuid}
                      className="flex justify-between items-center p-2.5 rounded-lg bg-[#121C26] border border-valBorder text-xs"
                    >
                      <span className="font-semibold text-white">{m.gameName}</span>
                      <span className="text-valMuted font-mono">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Missing Roles Chips Selector */}
          <Card className="md:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider font-rajdhani flex items-center gap-2">
                <Target className="w-5 h-5 text-valAccent" /> Missing Tactical Roles
              </h2>
              <p className="text-xs text-valMuted mt-0.5">
                Toggle the missing roles below to recalculate compatibility scores across candidates.
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
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-180 flex items-center gap-2 cursor-pointer select-none ${
                      active
                        ? 'bg-valAccent text-white border-valAccent shadow-md shadow-valAccent/30 scale-[1.02]'
                        : 'bg-[#121C26] text-valMuted border-valBorder hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? 'bg-white' : 'bg-slate-600'
                      }`}
                    />
                    {role}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-valMuted font-mono bg-[#121C26] p-3 rounded-lg border border-valBorder">
              Selected Tags:{' '}
              {missingRoles.length > 0 ? (
                <span className="text-teal-300 font-bold">{missingRoles.join(', ')}</span>
              ) : (
                <span className="text-valMuted">None selected (Click roles above to match)</span>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Ranked Candidate Results */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-valBorder pb-3">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide font-rajdhani flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-valAccent" />
            Ranked Recommendations
          </h2>
          <span className="text-xs text-valMuted font-mono">
            {loadingMatches
              ? 'Computing scores...'
              : `${matchedCoaches.length} Coaches • ${matchedPlayers.length} Players`}
          </span>
        </div>

        {missingRoles.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Select Missing Roles"
            description="Toggle one or more tactical roles above to view candidates ranked by role synergy and agent overlap."
          />
        ) : loadingMatches ? (
          <LoadingSkeleton count={4} type="card" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Veteran Coaches Matches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-valAccent uppercase tracking-wider font-rajdhani">
                  Veteran Coaches (Mid-Round & Macro)
                </h3>
                <span className="text-[11px] text-valMuted font-mono">Ranked by tactical fit</span>
              </div>

              <div className="space-y-3">
                {matchedCoaches.slice(0, 3).map((coach) => {
                  const scoreWidth = Math.min(100, Math.max(15, coach.matchScore));
                  return (
                    <Card
                      key={coach.id}
                      hover
                      padding="p-4 sm:p-5"
                      className="border-valBorder group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-lg font-bold text-white uppercase font-rajdhani block group-hover:text-valAccent transition-colors">
                            {coach.name}
                          </span>
                          <span className="text-xs text-valMuted">
                            Specialty: <strong className="text-slate-300">{coach.specialty}</strong>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-white block">
                            ${coach.hourlyRate}/hr
                          </span>
                          <span className="text-[10px] text-valMuted block font-mono">
                            Placeholder data
                          </span>
                        </div>
                      </div>

                      {/* Match Score Bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-valMuted">Match Synergy</span>
                          <span className="text-teal-300 font-bold">{coach.matchScore} pts</span>
                        </div>
                        <div className="w-full bg-[#121C26] h-2 rounded-full overflow-hidden border border-valBorder">
                          <div
                            className="bg-valAccent h-full rounded-full transition-all duration-300"
                            style={{ width: `${scoreWidth}%` }}
                          />
                        </div>
                      </div>

                      {/* Match Reasons */}
                      <div className="mt-3 text-xs space-y-1">
                        {coach.matchReasons?.map((reason, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-slate-300">
                            <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-valBorder flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {coach.agents?.map((a) => (
                            <Badge key={a} variant="default" size="sm">
                              {a}
                            </Badge>
                          ))}
                        </div>
                        <a
                          href={`/coaches/${coach.id}`}
                          className="text-xs text-valAccent font-bold hover:underline font-mono"
                        >
                          View Profile →
                        </a>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Free Agent Players Matches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-teal-400 uppercase tracking-wider font-rajdhani">
                  Free Agents & Role Specialists
                </h3>
                <span className="text-[11px] text-valMuted font-mono">Compatibility score</span>
              </div>

              <div className="space-y-3">
                {matchedPlayers.slice(0, 4).map((p) => {
                  const scoreWidth = Math.min(100, Math.max(15, p.matchScore));
                  return (
                    <Card
                      key={p.puuid}
                      hover
                      padding="p-4 sm:p-5"
                      className="border-valBorder group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-lg font-bold text-white uppercase font-rajdhani block group-hover:text-teal-400 transition-colors">
                            {p.gameName}{' '}
                            <span className="text-xs text-valMuted font-mono">#{p.tagLine}</span>
                          </span>
                          <span className="text-xs text-slate-300 font-mono font-bold">
                            {p.role}
                          </span>
                        </div>
                        <Badge variant="teal" size="sm">
                          {p.role}
                        </Badge>
                      </div>

                      {/* Match Score Bar */}
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-valMuted">Role Fit Score</span>
                          <span className="text-teal-300 font-bold">{p.matchScore} pts</span>
                        </div>
                        <div className="w-full bg-[#121C26] h-2 rounded-full overflow-hidden border border-valBorder">
                          <div
                            className="bg-teal-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${scoreWidth}%` }}
                          />
                        </div>
                      </div>

                      {/* Match Reasons */}
                      <div className="mt-3 text-xs space-y-1">
                        {p.matchReasons?.map((reason, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-slate-300">
                            <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t border-valBorder flex flex-wrap gap-1">
                        {p.agents?.map((a) => (
                          <Badge key={a} variant="default" size="sm">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Team Roster"
      >
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <Input
            label="Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="e.g. Phoenix Rising"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-valMuted">
              Competition Circuit
            </label>
            <select
              value={newTeamLevel}
              onChange={(e) => setNewTeamLevel(e.target.value)}
              className="w-full bg-[#121C26] border border-valBorder text-slate-200 text-xs rounded-lg p-2.5 focus:border-valAccent focus:outline-none transition-colors"
            >
              <option value="college">Collegiate League</option>
              <option value="semi-pro">Semi-Pro Circuit</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
