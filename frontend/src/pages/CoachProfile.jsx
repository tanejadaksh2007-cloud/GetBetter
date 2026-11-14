import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Award, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
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

  const parseWinRate = (str) => {
    const match = str?.match(/(\d+)%/);
    return match ? parseInt(match[1], 10) : 50;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
        <LoadingSkeleton count={1} type="card" className="h-96" />
      </div>
    );
  }

  if (error || !coach) {
    return (
      <Card className="text-center py-16 max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-valAccent mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white uppercase font-rajdhani mb-2">Coach Not Found</h2>
        <p className="text-xs text-valMuted mb-6">The requested coach profile does not exist.</p>
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
        className="inline-flex items-center gap-1.5 text-xs text-valMuted hover:text-white transition-colors duration-180"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Coaches
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            {/* Top row with Avatar */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-valBorder">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#121C26] border border-valBorder flex items-center justify-center font-bold text-white text-2xl font-rajdhani">
                  {getInitials(coach.name)}
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white uppercase tracking-wide font-rajdhani">
                    {coach.name}
                  </h1>
                  <span className="text-xs text-valMuted block mt-0.5">
                    Former Role: <strong className="text-slate-300">{coach.formerRole}</strong>
                  </span>
                  <div className="mt-2">
                    <Badge variant="accent" size="sm">
                      Specialty: {coach.specialty}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-[#121C26] border border-valBorder rounded-xl px-4 py-2.5 text-right sm:self-start">
                <span className="text-2xl font-black text-white font-rajdhani">
                  ${coach.hourlyRate}
                </span>
                <span className="text-[10px] text-valMuted block font-mono">per hour</span>
              </div>
            </div>

            {/* Tactical Background */}
            <div className="py-6 border-b border-valBorder space-y-4">
              <div>
                <h3 className="text-xs font-bold text-valMuted uppercase tracking-wider mb-2">
                  Tactical Background & Coaching Philosophy
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {coach.bio}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-valMuted uppercase tracking-wider mb-2">
                  Specialized Agent Pools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {coach.agents?.map((ag) => (
                    <span
                      key={ag}
                      className="bg-[#121C26] text-slate-200 border border-valBorder text-xs px-3 py-1 rounded font-mono"
                    >
                      {ag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Progression Track Record with Bars */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-valMuted uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-valAccent" />
                  Team Progression Results
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-valMuted font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-valBorder">
                  Placeholder data
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coach.results?.map((res, idx) => {
                  const hasWinRateCase =
                    res.before?.includes('%') && res.after?.includes('%');
                  const beforeVal = hasWinRateCase ? parseWinRate(res.before) : 40;
                  const afterVal = hasWinRateCase ? parseWinRate(res.after) : 60;

                  return (
                    <div
                      key={idx}
                      className="bg-[#121C26] border border-valBorder rounded-lg p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="text-xs font-bold text-white">{res.team}</div>

                      {hasWinRateCase ? (
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-[11px] text-valMuted font-mono mb-1">
                              <span>Before Coaching</span>
                              <span>{res.before}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-rose-500 h-full rounded-full"
                                style={{ width: `${beforeVal}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-teal-300 font-mono mb-1">
                              <span>After Coaching</span>
                              <span>{res.after}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-teal-400 h-full rounded-full"
                                style={{ width: `${afterVal}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-valMuted">
                          <span>Before: {res.before}</span>
                          <div className="text-teal-300 font-semibold mt-1">
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
            <h2 className="text-xl font-bold text-white uppercase tracking-wider font-rajdhani mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-valAccent" /> Book Session
            </h2>
            <p className="text-xs text-valMuted mb-5">
              Schedule 1-on-1 VOD review or live scrim observation.
            </p>

            {bookingSuccess && (
              <div className="mb-4 p-3 bg-teal-950/60 border border-teal-800/80 rounded-lg text-teal-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
                <span>Session requested! Coach will confirm via Riot chat mock.</span>
              </div>
            )}

            <form onSubmit={handleBookSession} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-valMuted">
                  Format
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full bg-[#121C26] border border-valBorder text-slate-200 text-xs rounded-lg p-2.5 focus:border-valAccent focus:outline-none transition-colors"
                >
                  <option value="vod">VOD Review & Micro Breakdown (60 min)</option>
                  <option value="scrim">Live Scrim Observation (90 min)</option>
                  <option value="playbook">Tactical Playbook & Utility Mapping (60 min)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-valMuted">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-[#121C26] border border-valBorder text-slate-200 text-xs rounded-lg p-2.5 focus:border-valAccent focus:outline-none transition-colors"
                />
              </div>

              <div className="p-3 bg-[#121C26] rounded-lg border border-valBorder text-xs space-y-1 font-mono">
                <div className="flex justify-between text-valMuted">
                  <span>Rate:</span>
                  <span className="text-white">${coach.hourlyRate}.00 / hr</span>
                </div>
                <div className="flex justify-between text-valMuted">
                  <span>Simulated Deposit:</span>
                  <span className="text-teal-400">$0</span>
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
