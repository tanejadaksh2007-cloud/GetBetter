import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function CoachCard({ coach }) {
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
    return match ? parseInt(match[1], 10) : null;
  };

  const primaryResult = coach.results?.[0];
  const teamLabel = sanitizeTeamName(primaryResult?.team);
  const beforePercent = parseWinRate(primaryResult?.before);
  const afterPercent = parseWinRate(primaryResult?.after);
  const isPercentWinRate = beforePercent !== null && afterPercent !== null;

  return (
    <div className="relative bg-surface border border-border clip-cut-corner-br hover:border-red hover:shadow-[0_0_0_1px_#FF4655] transition-all duration-150 hover:-translate-y-1 group flex flex-col justify-between">
      {/* Top thin red tactical line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-border group-hover:bg-red transition-colors duration-150" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Top: Avatar, Name, Role, Hourly Rate */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Centered padded avatar initials without dot */}
            <div className="w-12 h-12 bg-bg border border-border flex items-center justify-center font-rajdhani font-black text-lg text-text p-2 clip-cut-corner-tl group-hover:border-red/60 transition-colors">
              {getInitials(coach.name)}
            </div>

            <div>
              <h2 className="text-xl font-bold font-rajdhani uppercase tracking-wide text-text group-hover:text-red transition-colors leading-tight">
                {coach.name}
              </h2>
              <span className="text-xs text-muted font-mono block mt-0.5">
                Former: <strong className="text-text font-normal">{coach.formerRole}</strong>
              </span>
            </div>
          </div>

          {/* Rate Badge - Yellow accent */}
          <div className="bg-bg border border-border px-3 py-1 text-right clip-slant-right">
            <span className="text-lg font-black font-rajdhani text-yellow block leading-tight">
              ${coach.hourlyRate}
            </span>
            <span className="text-[9px] font-mono text-muted uppercase block">/ hr</span>
          </div>
        </div>

        {/* Specialty Pill */}
        <div className="inline-block bg-bg border-l-2 border-l-red border-y border-r border-border px-2.5 py-0.5 text-[11px] font-rajdhani font-bold uppercase tracking-widest text-red">
          {coach.specialty}
        </div>

        {/* Middle: Highlighted Result Block with PLACEHOLDER DATA label in Yellow */}
        {primaryResult && (
          <div className="bg-bg border border-border/80 p-3.5 space-y-2 clip-slant-right">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-semibold text-text uppercase tracking-wide">
                {teamLabel}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-yellow bg-yellow/10 border border-yellow/30 px-1.5 py-0.5">
                PLACEHOLDER DATA
              </span>
            </div>

            {isPercentWinRate ? (
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-baseline justify-between font-rajdhani">
                  <span className="text-xs text-muted uppercase font-bold tracking-wider">
                    Win Rate Shift:
                  </span>
                  <div className="text-base font-black tracking-wide">
                    <span className="text-red font-mono">{primaryResult.before}</span>
                    <span className="text-muted mx-1.5">→</span>
                    <span className="text-yellow font-mono text-lg">{primaryResult.after}</span>
                  </div>
                </div>

                {/* Progress Comparison Bar: Red for 'before', Yellow for 'after' */}
                <div className="w-full bg-[#202024] h-2 overflow-hidden flex relative">
                  <div
                    className="bg-red h-full"
                    style={{ width: `${beforePercent}%` }}
                    title={`Before: ${primaryResult.before}`}
                  />
                  <div
                    className="bg-yellow h-full"
                    style={{ width: `${Math.max(0, afterPercent - beforePercent)}%` }}
                    title={`After: ${primaryResult.after}`}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs font-mono text-muted">
                <span>{primaryResult.before}</span>
                <span className="text-muted mx-1.5">→</span>
                <span className="text-yellow font-bold">{primaryResult.after}</span>
              </div>
            )}
          </div>
        )}

        {/* 2-line clamped bio in readable text */}
        <p className="text-xs text-muted line-clamp-2 leading-relaxed">
          {coach.bio}
        </p>

        {/* Agent chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {coach.agents?.map((agent) => (
            <span
              key={agent}
              className="bg-bg text-text border border-border text-[10px] font-mono px-2 py-0.5"
            >
              {agent}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom: Full-width Primary button with solid red */}
      <div className="p-5 sm:p-6 pt-0">
        <Link to={`/coaches/${coach.id}`} className="block w-full">
          <Button variant="primary" size="md" className="w-full text-center">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
