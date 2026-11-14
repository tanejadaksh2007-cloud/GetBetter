import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, TrendingUp, Calendar, CheckCircle2, Clock, Award } from 'lucide-react';

export default function CoachProfile() {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [sessionDate, setSessionDate] = useState('2026-11-20T19:00');
  const [sessionType, setSessionType] = useState('vod');

  useEffect(() => {
    fetchCoach();
  }, [id]);

  const fetchCoach = async () => {
    try {
      const res = await fetch(`/api/coaches/${id}`);
      const json = await res.json();
      setCoach(json.data || null);
    } catch (err) {
      console.error('Error loading coach details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading coach profile...</div>;
  }

  if (!coach) {
    return (
      <div className="text-center py-20 bg-valCard rounded-xl border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-2">Coach Not Found</h2>
        <Link to="/coaches" className="text-valRed hover:underline text-sm">
          Return to Coach Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/coaches"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Coaches
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-valCard border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-valRed mb-1 block">
                  Veteran Tactical Mentor
                </span>
                <h1 className="text-3xl font-black text-white">{coach.name}</h1>
                <p className="text-sm text-valTeal mt-1">Former Role: {coach.formerRole}</p>
              </div>

              <div className="bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-right">
                <span className="text-2xl font-black text-amber-300">${coach.hourlyRate}</span>
                <span className="text-xs text-slate-400 block">per hour</span>
              </div>
            </div>

            {/* Specialty & Bio */}
            <div className="py-6 border-b border-slate-800 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Specialty Focus
                </h3>
                <span className="inline-block bg-red-950/70 border border-valRed/40 text-valRed font-bold text-xs uppercase px-3 py-1 rounded">
                  {coach.specialty}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Veteran Background & Philosophy
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {coach.bio}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Agent Pool & Strategic Masterclasses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {coach.agents.map((ag) => (
                    <span
                      key={ag}
                      className="bg-slate-900 text-slate-200 border border-slate-700 text-xs px-3 py-1 rounded-md font-mono"
                    >
                      {ag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Results track record */}
            <div className="pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Verified Track Record & Progression
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coach.results?.map((res, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                  >
                    <div className="text-xs font-bold text-white mb-2">{res.team}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Before:</span>
                        <span className="text-rose-400 font-mono font-semibold">
                          {res.before}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>After Coaching:</span>
                        <span className="text-emerald-400 font-mono font-semibold">
                          {res.after}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <div className="bg-valCard border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-valRed" /> Book a Session
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Select date and format for 1-on-1 VOD review or team scrim observation.
            </p>

            {bookingSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Session requested! Coach will confirm via Riot chat mock.</span>
              </div>
            )}

            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Format
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-valRed focus:outline-none"
                >
                  <option value="vod">VOD Review & Micro Breakdown (60 min)</option>
                  <option value="scrim">Live Scrim Mid-round Observation (90 min)</option>
                  <option value="playbook">Tactical Playbook & Utility Mapping (60 min)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-valRed focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Rate:</span>
                  <span className="text-white">${coach.hourlyRate}.00 / hr</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Deposit:</span>
                  <span className="text-emerald-400">$0 (Simulation)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-valRed hover:bg-valRedDark text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95"
              >
                Book Session Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
