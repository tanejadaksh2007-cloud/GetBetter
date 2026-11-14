import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  LayoutDashboard,
  Award,
  Crosshair,
  Shield,
  TrendingUp,
  AlertCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      fetchTeamMatches(selectedTeamId);
    }
  }, [selectedTeamId]);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      if (!res.ok) throw new Error('Failed to load teams');
      const json = await res.json();
      const list = json.data || [];
      setTeams(list);
      if (list.length > 0) {
        setSelectedTeamId(list[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load team list.');
    }
  };

  const fetchTeamMatches = async (tId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams/${tId}/matches`);
      if (!res.ok) throw new Error('Failed to load match history');
      const json = await res.json();
      setMatches(json.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load matches for this team.');
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const mapStats = {};
  let totalWins = 0;
  let totalLosses = 0;

  matches.forEach((m) => {
    if (!mapStats[m.map]) {
      mapStats[m.map] = { map: m.map, wins: 0, total: 0 };
    }
    mapStats[m.map].total += 1;
    const blueTeam = m.teams?.find((t) => t.teamId === 'Blue');
    if (blueTeam && blueTeam.won) {
      mapStats[m.map].wins += 1;
      totalWins += 1;
    } else {
      totalLosses += 1;
    }
  });

  const winRateByMapData = Object.values(mapStats).map((item) => ({
    map: item.map,
    winRate: Math.round((item.wins / item.total) * 100),
    totalMatches: item.total
  }));

  // Best Map
  const bestMapObj = [...winRateByMapData].sort((a, b) => b.winRate - a.winRate)[0];

  // Overall Win Rate
  const overallWinRate =
    matches.length > 0 ? Math.round((totalWins / matches.length) * 100) : 0;

  // Attack vs Defense Calculations
  let attackWins = 0;
  let attackTotal = 0;
  let defenseWins = 0;
  let defenseTotal = 0;

  matches.forEach((m) => {
    m.rounds?.forEach((r) => {
      if (r.teamRole === 'Attack') {
        attackTotal += 1;
        if (r.winningTeam === 'Blue') attackWins += 1;
      } else if (r.teamRole === 'Defense') {
        defenseTotal += 1;
        if (r.winningTeam === 'Blue') defenseWins += 1;
      }
    });
  });

  const attackVsDefenseData = [
    { name: 'Attack Rounds Won', value: attackWins, color: '#FF4655' },
    { name: 'Attack Rounds Lost', value: Math.max(0, attackTotal - attackWins), color: '#3A141A' },
    { name: 'Defense Rounds Won', value: defenseWins, color: '#00E5BF' },
    { name: 'Defense Rounds Lost', value: Math.max(0, defenseTotal - defenseWins), color: '#0B332C' }
  ];

  const last5Matches = matches.slice(-5).map((m) => {
    const blue = m.teams?.find((t) => t.teamId === 'Blue');
    const red = m.teams?.find((t) => t.teamId === 'Red');
    const won = blue ? blue.won : false;
    return {
      matchId: m.matchId,
      map: m.map,
      score: `${blue?.roundsWon || 0} - ${red?.roundsWon || 0}`,
      won,
      date: new Date(m.startTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    };
  });

  return (
    <div className="space-y-8">
      {/* Header with Team Switcher */}
      <PageHeader
        badge={
          <Badge variant="accent" size="sm">
            <LayoutDashboard className="w-3 h-3 inline mr-1" /> Team Intelligence
          </Badge>
        }
        title="Team Dashboard"
        description="Review aggregate performance, map veto proficiencies, and round side distributions computed from seeded match logs."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-valMuted uppercase font-mono hidden sm:inline">
              Team:
            </span>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="bg-[#121C26] border border-valBorder text-slate-100 text-xs sm:text-sm rounded-lg px-3 py-2 focus:border-valAccent focus:outline-none transition-colors"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {error ? (
        <Card className="text-center py-12 text-rose-300">
          <AlertCircle className="w-8 h-8 text-valAccent mx-auto mb-2" />
          <p className="text-sm font-semibold">{error}</p>
        </Card>
      ) : loading ? (
        <div className="space-y-6">
          <LoadingSkeleton count={3} type="card" />
          <LoadingSkeleton count={2} type="row" />
        </div>
      ) : (
        <>
          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card hover className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-valMuted font-mono block mb-1">
                  Overall Win Rate
                </span>
                <div className="text-4xl font-extrabold text-white font-rajdhani">
                  {overallWinRate}%
                </div>
                <span className="text-[11px] text-valMuted block mt-1">
                  Record: <strong className="text-white font-mono">{totalWins}W - {totalLosses}L</strong>
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-valAccent/10 border border-valAccent/30 flex items-center justify-center text-valAccent">
                <TrendingUp className="w-6 h-6" />
              </div>
            </Card>

            <Card hover className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-valMuted font-mono block mb-1">
                  Side Balance
                </span>
                <div className="text-4xl font-extrabold text-teal-400 font-rajdhani">
                  {attackTotal > 0 ? Math.round((attackWins / attackTotal) * 100) : 0}% /{' '}
                  {defenseTotal > 0 ? Math.round((defenseWins / defenseTotal) * 100) : 0}%
                </div>
                <span className="text-[11px] text-valMuted block mt-1 font-mono">
                  Attack / Defense Win Rate
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-950/40 border border-teal-800/40 flex items-center justify-center text-teal-400">
                <Shield className="w-6 h-6" />
              </div>
            </Card>

            <Card hover className="p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-valMuted font-mono block mb-1">
                  Best Map Veto
                </span>
                <div className="text-4xl font-extrabold text-white font-rajdhani">
                  {bestMapObj ? bestMapObj.map : 'None'}
                </div>
                <span className="text-[11px] text-valMuted block mt-1 font-mono">
                  {bestMapObj ? `${bestMapObj.winRate}% win rate` : 'No data logged'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
                <MapPin className="w-6 h-6" />
              </div>
            </Card>
          </div>

          {/* Recharts Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Win Rate by Map */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide text-white font-rajdhani">
                  Win Rate by Map
                </h3>
                <p className="text-xs text-valMuted">
                  Map performance percentage used for ban/pick strategy.
                </p>
              </div>

              <div className="h-64 w-full">
                {winRateByMapData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-valMuted">
                    No map match data recorded.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={winRateByMapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27384A" vertical={false} />
                      <XAxis dataKey="map" stroke="#8B97A3" fontSize={11} tickLine={false} />
                      <YAxis unit="%" stroke="#8B97A3" fontSize={11} domain={[0, 100]} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1B2733',
                          borderColor: '#27384A',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                        formatter={(val) => [`${val}%`, 'Win Rate']}
                      />
                      <Bar dataKey="winRate" fill="#FF4655" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Chart 2: Attack vs Defense Rounds */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide text-white font-rajdhani">
                  Round Side Distribution
                </h3>
                <p className="text-xs text-valMuted">
                  Execute vs retake round conversion rates.
                </p>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                {attackTotal === 0 && defenseTotal === 0 ? (
                  <div className="text-xs text-valMuted">No round data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attackVsDefenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {attackVsDefenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1B2733',
                          borderColor: '#27384A',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', color: '#8B97A3' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>
          </div>

          {/* Last 5 Matches Clean List */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide text-white font-rajdhani">
                  Last 5 Scrims / Matches
                </h3>
                <p className="text-xs text-valMuted">
                  Recent recorded custom scrim results.
                </p>
              </div>
              <Badge variant="teal" size="sm">
                Seeded Logs
              </Badge>
            </div>

            {last5Matches.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Match Records"
                description="This roster currently has no logged scrims in the seeded data file."
              />
            ) : (
              <div className="space-y-2.5">
                {last5Matches.map((m) => (
                  <div
                    key={m.matchId}
                    className="flex items-center justify-between p-3.5 bg-[#121C26] border border-valBorder hover:border-slate-600 rounded-lg text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {m.won ? (
                        <Badge variant="win" size="sm">
                          VICTORY
                        </Badge>
                      ) : (
                        <Badge variant="loss" size="sm">
                          DEFEAT
                        </Badge>
                      )}
                      <span className="text-white font-bold text-sm uppercase font-rajdhani">
                        {m.map}
                      </span>
                      <span className="text-valMuted font-mono text-[11px] hidden sm:inline">
                        {m.matchId}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-sm text-slate-100">
                        {m.score}
                      </span>
                      <span className="text-valMuted font-mono text-[11px]">{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
