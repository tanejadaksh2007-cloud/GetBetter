import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function CoachCard({ coach }) {
  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return 'C';
    const clean = name.replace(/['"].*?['"]/g, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Anonymize real university/team names into fictional tactical team names
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
    return match ? parseInt(match[1], 10) : null;
  };

  const primaryResult = coach.results?.[0];
  const teamLabel = sanitizeTeamName(primaryResult?.team);
  const beforePercent = parseWinRate(primaryResult?.before);
  const afterPercent = parseWinRate(primaryResult?.after);
  const isPercentWinRate = beforePercent !== null && afterPercent !== null;

  return (
    <div className="relative bg-valCard border border-valBorder clip-cut-corner-br hover:border-valAccent transition-all duration-150 hover:-translate-y-1 hover:shadow-xl hover:shadow-valAccent/10 group flex flex-col justify-between">
      {/* Top thin red tactical line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-valBorder group-hover:bg-valAccent transition-colors duration-150" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Top: Avatar with cut corner, Name, Role, Hourly Rate */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Initials Avatar with diagonal cut */}
            <div className="w-12 h-12 bg-[#121C26] border border-valBorder flex items-center justify-center font-rajdhani font-black text-lg text-valText clip-cut-corner-tl group-hover:border-valAccent/60 transition-colors">
              <span className="text-valAccent mr-0.5">•</span>
              {getInitials(coach.name)}
            </div>

            <div>
              <h2 className="text-xl font-bold font-rajdhani uppercase tracking-wide text-valText group-hover:text-valAccent transition-colors leading-tight">
                {coach.name}
              </h2>
              <span className="text-xs text-valMuted font-mono block mt-0.5">
                Former: <strong className="text-slate-300 font-normal">{coach.formerRole}</strong>
              </span>
            </div>
          </div>

          {/* Rate Badge */}
          <div className="bg-[#121C26] border border-valBorder px-2.5 py-1 text-right clip-slant-right">
            <span className="text-base font-black font-rajdhani text-valText block leading-tight">
              ${coach.hourlyRate}
            </span>
            <span className="text-[9px] font-mono text-valMuted uppercase block">/ hr</span>
          </div>
        </div>

        {/* Specialty Pill */}
        <div className="inline-block bg-[#121C26] border-l-2 border-l-valAccent border-y border-r border-valBorder px-2.5 py-0.5 text-[11px] font-rajdhani font-bold uppercase tracking-widest text-valAccent">
          {coach.specialty}
        </div>

        {/* Middle: Highlighted Result Block (Placeholder data) */}
        {primaryResult && (
          <div className="bg-[#121C26] border border-valBorder/80 p-3.5 space-y-2 clip-slant-right">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-semibold text-slate-300 uppercase tracking-wide">
                {teamLabel}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-valMuted bg-black/40 px-1.5 py-0.5 rounded border border-valBorderSubtle">
                Placeholder data
              </span>
            </div>

            {isPercentWinRate ? (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-baseline justify-between font-rajdhani">
                  <span className="text-xs text-valMuted uppercase font-bold tracking-wider">
                    Win Rate Shift:
                  </span>
                  <div className="text-base font-black tracking-wide">
                    <span className="text-rose-400 font-mono">{primaryResult.before}</span>
                    <span className="text-valMuted mx-1.5">→</span>
                    <span className="text-teal-400 font-mono text-lg">{primaryResult.after}</span>
                  </div>
                </div>

                {/* Progress Comparison Bar */}
                <div className="w-full bg-[#1A2633] h-2 overflow-hidden flex relative">
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${beforePercent}%` }}
                    title={`Before: ${primaryResult.before}`}
                  />
                  <div
                    className="bg-teal-400 h-full"
                    style={{ width: `${Math.max(0, afterPercent - beforePercent)}%` }}
                    title={`After: ${primaryResult.after}`}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs font-mono text-valMuted">
                <span>{primaryResult.before}</span>
                <span className="text-valMuted mx-1.5">→</span>
                <span className="text-teal-400 font-bold">{primaryResult.after}</span>
              </div>
            )}
          </div>
        )}

        {/* Below: 2-line clamped bio */}
        <p className="text-xs text-valMuted line-clamp-2 leading-relaxed">
          {coach.bio}
        </p>

        {/* Agent chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {coach.agents?.map((agent) => (
            <span
              key={agent}
              className="bg-[#121C26] text-slate-300 border border-valBorder/80 text-[10px] font-mono px-2 py-0.5"
            >
              {agent}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom: Full-width "View profile" button */}
      <div className="p-5 sm:p-6 pt-0">
        <Link to={`/coaches/${coach.id}`} className="block w-full">
          <Button variant="secondary" size="md" className="w-full text-center group-hover:bg-valAccent group-hover:text-white group-hover:border-valAccent transition-colors">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
