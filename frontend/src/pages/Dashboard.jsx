import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LayoutDashboard, Award, Crosshair, Shield, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('team-001');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const json = await res.json();
      const list = json.data || [];
      setTeams(list);
      if (list.length > 0) {
        setSelectedTeamId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load teams', err);
    }
  };

  const fetchTeamMatches = async (tId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${tId}/matches`);
      const json = await res.json();
      setMatches(json.data || []);
    } catch (err) {
      console.error('Failed to load matches', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Compute Win Rate by Map
  const mapStats = {};
  matches.forEach((m) => {
    if (!mapStats[m.map]) {
      mapStats[m.map] = { map: m.map, wins: 0, total: 0 };
    }
    mapStats[m.map].total += 1;
    const blueTeam = m.teams.find((t) => t.teamId === 'Blue');
    if (blueTeam && blueTeam.won) {
      mapStats[m.map].wins += 1;
    }
  });

  const winRateByMapData = Object.values(mapStats).map((item) => ({
    map: item.map,
    winRate: Math.round((item.wins / item.total) * 100),
    totalMatches: item.total
  }));

  // 2. Compute Attack vs Defense Round Win Rate
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
    {
      name: 'Attack Won',
      value: attackWins,
      color: '#ff4655'
    },
    {
      name: 'Attack Lost',
      value: Math.max(0, attackTotal - attackWins),
      color: '#471419'
    },
    {
      name: 'Defense Won',
      value: defenseWins,
      color: '#00e5bf'
    },
    {
      name: 'Defense Lost',
      value: Math.max(0, defenseTotal - defenseWins),
      color: '#0a3d34'
    }
  ];

  const attackWinRatePercent = attackTotal > 0 ? Math.round((attackWins / attackTotal) * 100) : 0;
  const defenseWinRatePercent = defenseTotal > 0 ? Math.round((defenseWins / defenseTotal) * 100) : 0;

  // 3. Last 5 Matches Timeline
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

  const currentTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-valCard border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-valRed" /> Team Analytics & Progression
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated scrim rounds, map veto proficiencies, and side win rates computed from verified match logs.
          </p>
        </div>

        {/* Team Switcher */}
        <div className="w-full sm:w-auto">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Select Team Roster
          </label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-valRed focus:outline-none"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-valCard border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">
            <span>Attack Half Win Rate</span>
            <Crosshair className="w-4 h-4 text-valRed" />
          </div>
          <div className="text-3xl font-black text-white">{attackWinRatePercent}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {attackWins} won of {attackTotal} attack rounds
          </div>
        </div>

        <div className="bg-valCard border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">
            <span>Defense Hold Rate</span>
            <Shield className="w-4 h-4 text-valTeal" />
          </div>
          <div className="text-3xl font-black text-white">{defenseWinRatePercent}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {defenseWins} won of {defenseTotal} defense rounds
          </div>
        </div>

        <div className="bg-valCard border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">
            <span>Total Recorded Scrims</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{matches.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Opted-in custom game logs
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Win Rate by Map */}
        <div className="bg-valCard border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Win Rate by Map
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies map pool strengths and ideal veto targets.
            </p>
          </div>

          <div className="h-64 w-full">
            {winRateByMapData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No match logs found for this team.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={winRateByMapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#233247" />
                  <XAxis dataKey="map" stroke="#8b9bb4" fontSize={11} />
                  <YAxis unit="%" stroke="#8b9bb4" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#182333', borderColor: '#334155', fontSize: '12px' }}
                    formatter={(val) => [`${val}%`, 'Win Rate']}
                  />
                  <Bar dataKey="winRate" fill="#ff4655" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Attack vs Defense Rounds */}
        <div className="bg-valCard border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Attack vs Defense Round Distribution
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Balance breakdown between offensive executes vs site retakes.
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {attackTotal === 0 && defenseTotal === 0 ? (
              <div className="text-slate-500 text-xs">No round data available.</div>
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
                    contentStyle={{ backgroundColor: '#182333', borderColor: '#334155', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Last 5 Matches Table */}
      <div className="bg-valCard border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Last 5 Matches
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recent scrim and tournament match performance.
            </p>
          </div>
          <span className="text-xs text-valTeal font-mono font-bold">
            {matches.filter((m) => m.teams.find((t) => t.teamId === 'Blue')?.won).length}W -{' '}
            {matches.filter((m) => !m.teams.find((t) => t.teamId === 'Blue')?.won).length}L
          </span>
        </div>

        {last5Matches.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No match records found.
          </div>
        ) : (
          <div className="space-y-2">
            {last5Matches.map((m) => (
              <div
                key={m.matchId}
                className="flex items-center justify-between p-3.5 bg-slate-900/70 border border-slate-800 rounded-lg text-xs"
              >
                <div className="flex items-center gap-3">
                  {m.won ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      <CheckCircle className="w-3.5 h-3.5" /> VICTORY
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                      <XCircle className="w-3.5 h-3.5" /> DEFEAT
                    </span>
                  )}
                  <span className="text-white font-bold text-sm">{m.map}</span>
                  <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
                    {m.matchId}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-extrabold text-sm text-slate-200">
                    {m.score}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
