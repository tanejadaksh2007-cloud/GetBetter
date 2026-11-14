import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Star, AlertCircle, TrendingUp, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function CoachDirectory() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    setError(null);
    try {
      const params = new URLSearchParams();
      if (specialty !== 'all') params.append('specialty', specialty);
      if (agent !== 'all') params.append('agent', agent);

      const res = await fetch(`/api/coaches?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch coaches');
      const json = await res.json();
      setCoaches(json.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the coaching directory service.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const clean = name.replace(/['"].*?['"]/g, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const parseWinRate = (str) => {
    const match = str?.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 50;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge={
          <Badge variant="accent" size="sm">
            <Star className="w-3 h-3 inline mr-1" /> Tactical Mentorship
          </Badge>
        }
        title="Coach Directory"
        description="Connect with veteran competitive players who translate deep tactical macro, mid-rounding, and anti-stratting to your roster."
      />

      {/* Filter Bar */}
      <Card padding="p-4" className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-valMuted text-xs font-semibold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-valAccent" />
          <span>Filter Coaches</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="bg-[#121C26] border border-valBorder text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-valAccent focus:outline-none transition-colors"
          >
            {specialties.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="bg-[#121C26] border border-valBorder text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-valAccent focus:outline-none transition-colors"
          >
            <option value="all">All Agent Pools</option>
            {agentList.filter((a) => a !== 'all').map((ag) => (
              <option key={ag} value={ag}>
                {ag}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Content Area */}
      {error ? (
        <Card className="text-center py-12 text-rose-300 border-red-900/40">
          <AlertCircle className="w-8 h-8 text-valAccent mx-auto mb-2" />
          <p className="text-sm font-semibold">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchCoaches} className="mt-4">
            Retry
          </Button>
        </Card>
      ) : loading ? (
        <LoadingSkeleton count={6} type="card" />
      ) : coaches.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Coaches Found"
          description="No veteran coaches match the selected specialty or agent filters. Try expanding your search criteria."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSpecialty('all');
                setAgent('all');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map((coach) => {
            const hasWinRateCase =
              coach.results?.[0]?.before?.includes('%') &&
              coach.results?.[0]?.after?.includes('%');

            const beforeVal = hasWinRateCase ? parseWinRate(coach.results[0].before) : 40;
            const afterVal = hasWinRateCase ? parseWinRate(coach.results[0].after) : 60;

            return (
              <Card
                key={coach.id}
                hover
                className="flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header with Avatar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#121C26] border border-valBorder flex items-center justify-center font-bold text-white text-base font-rajdhani group-hover:border-valAccent transition-colors">
                        {getInitials(coach.name)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide font-rajdhani group-hover:text-valAccent transition-colors leading-tight">
                          {coach.name}
                        </h2>
                        <span className="text-xs text-valMuted block mt-0.5">
                          Former: {coach.formerRole}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-white font-rajdhani">
                        ${coach.hourlyRate}
                      </div>
                      <span className="text-[10px] text-valMuted block font-mono">/ hr</span>
                    </div>
                  </div>

                  {/* Specialty Badge */}
                  <div className="mb-3">
                    <Badge variant="accent" size="sm">
                      {coach.specialty}
                    </Badge>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-valMuted line-clamp-3 mb-4 leading-relaxed">
                    {coach.bio}
                  </p>

                  {/* Agent badges */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {coach.agents?.map((ag) => (
                        <span
                          key={ag}
                          className="bg-[#121C26] text-slate-300 border border-valBorder text-[10px] px-2 py-0.5 rounded font-mono"
                        >
                          {ag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Results as Before/After Bars with Placeholder Data label */}
                  {coach.results && coach.results.length > 0 && (
                    <div className="bg-[#121C26] border border-valBorder rounded-lg p-3 mb-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">
                          {coach.results[0].team}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-valMuted font-mono bg-slate-800/80 px-1.5 py-0.5 rounded">
                          Placeholder data
                        </span>
                      </div>

                      {hasWinRateCase ? (
                        <div className="space-y-1.5 pt-1">
                          <div>
                            <div className="flex justify-between text-[10px] text-valMuted font-mono mb-0.5">
                              <span>Before</span>
                              <span>{coach.results[0].before}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-rose-500 h-full rounded-full"
                                style={{ width: `${beforeVal}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] text-teal-300 font-mono mb-0.5">
                              <span>After</span>
                              <span>{coach.results[0].after}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-teal-400 h-full rounded-full"
                                style={{ width: `${afterVal}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-valMuted">
                          <span>{coach.results[0].before}</span> →{' '}
                          <span className="text-teal-300 font-semibold">{coach.results[0].after}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Link Button */}
                <Link to={`/coaches/${coach.id}`} className="w-full mt-2">
                  <Button variant="secondary" size="md" className="w-full">
                    View Profile & Book
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
