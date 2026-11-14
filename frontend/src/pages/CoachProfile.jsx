import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Award, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function CoachProfile() {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [sessionDate, setSessionDate] = useState('2026-11-20T19:00');
  const [sessionType, setSessionType] = useState('vod');

  useEffect(() => {
    fetchCoach();
  }, [id]);

  const fetchCoach = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/coaches/${id}`);
      if (!res.ok) throw new Error('Coach not found');
      const json = await res.json();
      setCoach(json.data || null);
    } catch (err) {
      console.error('Error loading coach details', err);
      setError('Coach profile could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const clean = name.replace(/['"].*?['"]/g, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const sanitizeTeamName = (teamStr) => {
    if (!teamStr) return 'Team Alpha';
    if (/rutgers/i.test(teamStr)) return 'Team Alpha';
    if (/state college/i.test(teamStr)) return 'Team Bravo';
    if (/blue horizon/i.test(teamStr)) return 'Team Cobalt';
    if (/caltech/i.test(teamStr)) return 'Team Delta';
    if (/eclipse prime/i.test(teamStr)) return 'Team Echo';
    if (/northshore/i.test(teamStr)) return 'Team Nova';
    if (/redline/i.test(teamStr)) return 'Team Vanguard';
    if (/apex/i.test(teamStr)) return 'Team Titan';
    return teamStr;
  };

  const parseWinRate = (str) => {
    const match = str?.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 50;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-surface-hover rounded animate-pulse" />
        <LoadingSkeleton count={1} type="card" className="h-96" />
      </div>
    );
  }

  if (error || !coach) {
    return (
      <Card className="text-center py-16 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-red mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text uppercase font-rajdhani mb-2">Coach Not Found</h2>
        <p className="text-xs text-muted mb-6">The requested coach profile does not exist.</p>
        <Link to="/coaches">
          <Button variant="secondary" size="md">
            Return to Coach Directory
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/coaches"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors duration-150 font-mono"
      >
        <ArrowLeft className="w-4 h-4 text-red" /> Back to Coaches
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            {/* Top row with Avatar */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                {/* Padded and centered avatar initials without dot */}
                <div className="w-16 h-16 bg-bg border border-border flex items-center justify-center font-bold text-yellow text-2xl font-rajdhani clip-cut-corner-tl p-2">
                  {getInitials(coach.name)}
                </div>
                <div>
                  <h1 className="text-3xl font-black text-text uppercase tracking-wide font-rajdhani">
                    {coach.name}
                  </h1>
                  <span className="text-xs text-muted block mt-0.5 font-mono">
                    Former Role: <strong className="text-text font-semibold">{coach.formerRole}</strong>
                  </span>
                  <div className="mt-2">
                    <Badge variant="red" size="sm">
                      Specialty: {coach.specialty}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Rate badge in Yellow */}
              <div className="bg-bg border border-border px-4 py-2.5 text-right sm:self-start clip-slant-right">
                <span className="text-2xl font-black text-yellow font-rajdhani block leading-tight">
                  ${coach.hourlyRate}
                </span>
                <span className="text-[10px] text-muted block font-mono uppercase">per hour</span>
              </div>
            </div>

            {/* Tactical Background */}
            <div className="py-6 border-b border-border space-y-4">
              <div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 font-mono">
                  Tactical Background & Coaching Philosophy
                </h3>
                <p className="text-text/90 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {coach.bio}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2 font-mono">
                  Specialized Agent Pools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {coach.agents?.map((ag) => (
                    <span
                      key={ag}
                      className="bg-bg text-text border border-border text-xs px-3 py-1 font-mono clip-chip"
                    >
                      {ag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progression Track Record with Win-rate bars: Red for Before, Yellow for After */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Award className="w-4 h-4 text-red" />
                  Team Progression Results
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-yellow font-mono bg-yellow/10 px-2 py-0.5 border border-yellow/30 font-bold">
                  PLACEHOLDER DATA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coach.results?.map((res, idx) => {
                  const hasWinRateCase =
                    res.before?.includes('%') && res.after?.includes('%');
                  const beforeVal = hasWinRateCase ? parseWinRate(res.before) : 40;
                  const afterVal = hasWinRateCase ? parseWinRate(res.after) : 60;
                  const teamName = sanitizeTeamName(res.team);

                  return (
                    <div
                      key={idx}
                      className="bg-bg border border-border p-4 flex flex-col justify-between space-y-3 clip-slant-right"
                    >
                      <div className="text-xs font-bold text-text uppercase font-rajdhani tracking-wider">
                        {teamName}
                      </div>

                      {hasWinRateCase ? (
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-[11px] text-muted font-mono mb-1">
                              <span>Before Coaching</span>
                              <span className="text-red font-bold">{res.before}</span>
                            </div>
                            <div className="w-full bg-[#202024] h-2 overflow-hidden">
                              <div
                                className="bg-red h-full"
                                style={{ width: `${beforeVal}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-yellow font-mono mb-1">
                              <span>After Coaching</span>
                              <span className="text-yellow font-bold">{res.after}</span>
                            </div>
                            <div className="w-full bg-[#202024] h-2 overflow-hidden">
                              <div
                                className="bg-yellow h-full"
                                style={{ width: `${afterVal}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted font-mono">
                          <span>Before: <strong className="text-red font-normal">{res.before}</strong></span>
                          <div className="text-yellow font-bold mt-1">
                            After: {res.after}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold text-text uppercase tracking-wider font-rajdhani mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red" /> Book Session
            </h2>
            <p className="text-xs text-muted mb-5">
              Schedule 1-on-1 VOD review or live scrim observation.
            </p>

            {bookingSuccess && (
              <div className="mb-4 p-3 bg-yellow/10 border border-yellow/40 text-yellow text-xs flex items-center gap-2 clip-slant-right">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-yellow" />
                <span>Session requested! Coach will confirm via Riot chat mock.</span>
              </div>
            )}

            <form onSubmit={handleBookSession} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Format
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full bg-bg border border-border text-text text-xs p-2.5 focus:border-red focus:outline-none transition-colors"
                >
                  <option value="vod">VOD Review & Micro Breakdown (60 min)</option>
                  <option value="scrim">Live Scrim Observation (90 min)</option>
                  <option value="playbook">Tactical Playbook & Utility Mapping (60 min)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-bg border border-border text-text text-xs p-2.5 focus:border-red focus:outline-none transition-colors"
                />
              </div>

              <div className="p-3 bg-bg border border-border text-xs space-y-1 font-mono clip-slant-right">
                <div className="flex justify-between text-muted">
                  <span>Rate:</span>
                  <span className="text-yellow font-bold">${coach.hourlyRate}.00 / hr</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Simulated Deposit:</span>
                  <span className="text-yellow font-bold">$0</span>
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Book Session
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
