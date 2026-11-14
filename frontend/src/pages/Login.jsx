import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckSquare, Square, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [optIn, setOptIn] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState('ply-001');

  const mockProfiles = [
    {
      puuid: 'ply-001',
      gameName: 'ViperMain24',
      tagLine: 'NA1',
      role: 'Controller',
      type: 'coach',
      agents: ['Viper', 'Omen', 'Brimstone']
    },
    {
      puuid: 'ply-002',
      gameName: 'AimDecay99',
      tagLine: 'VAL',
      role: 'Initiator',
      type: 'coach',
      agents: ['Sova', 'Fade', 'Breach']
    },
    {
      puuid: 'ply-007',
      gameName: 'FlashBlink',
      tagLine: 'FAST',
      role: 'Duelist',
      type: 'player',
      agents: ['Jett', 'Reyna', 'Raze']
    },
    {
      puuid: 'ply-008',
      gameName: 'DizzyDrone',
      tagLine: 'EYES',
      role: 'Initiator',
      type: 'player',
      agents: ['Skye', 'Fade', 'Gekko']
    }
  ];

  const handleContinue = (e) => {
    e.preventDefault();
    const prof = mockProfiles.find((p) => p.puuid === selectedProfile);
    login({
      ...prof,
      optedIn: optIn
    });
    navigate('/coaches');
  };

  return (
    <div className="max-w-md mx-auto my-10 sm:my-16 px-4">
      <Card className="p-7 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red" />

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-bg border border-border clip-cut-corner-tl mx-auto flex items-center justify-center mb-3">
            <span className="text-red font-black text-2xl font-rajdhani">V</span>
          </div>
          <h1 className="text-3xl font-black text-text uppercase tracking-wider font-rajdhani">
            Sign in with Riot (mockup)
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">
            Authenticate a simulated account to test the platform
          </p>
        </div>

        {/* Mock Notice Box */}
        <div className="bg-bg border border-border p-3 text-xs text-text mb-6 flex gap-2.5 items-start clip-slant-right">
          <Info className="w-4 h-4 text-red shrink-0 mt-0.5" />
          <div className="leading-relaxed font-mono text-[11px]">
            Mockup - real Riot Sign On requires production API approval.
          </div>
        </div>

        <form onSubmit={handleContinue} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 font-mono">
              Select Profile
            </label>
            <div className="space-y-2">
              {mockProfiles.map((p) => (
                <div
                  key={p.puuid}
                  onClick={() => setSelectedProfile(p.puuid)}
                  className={`flex items-center justify-between p-3 border cursor-pointer transition-all duration-150 clip-slant-right ${
                    selectedProfile === p.puuid
                      ? 'bg-surface-hover border-red text-text shadow-sm'
                      : 'bg-bg border-border text-muted hover:border-muted hover:text-text'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-text font-rajdhani uppercase">
                      {p.gameName}
                    </span>{' '}
                    <span className="text-xs text-muted font-mono">#{p.tagLine}</span>
                    <div className="text-[11px] text-muted capitalize mt-0.5 font-mono">
                      {p.type} • {p.role}
                    </div>
                  </div>
                  <Badge variant={p.type === 'coach' ? 'red' : 'yellow'} size="sm">
                    {p.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Opt-in Policy Checkbox */}
          <div
            onClick={() => setOptIn(!optIn)}
            className="flex items-start gap-3 p-3.5 bg-bg border border-border cursor-pointer select-none transition-colors hover:border-muted clip-slant-right"
          >
            <button
              type="button"
              className="text-red shrink-0 mt-0.5 focus:outline-none cursor-pointer"
            >
              {optIn ? (
                <CheckSquare className="w-5 h-5 text-red" />
              ) : (
                <Square className="w-5 h-5 text-muted" />
              )}
            </button>
            <div className="text-xs text-text/80 leading-relaxed font-mono">
              <span className="font-bold text-text">Data consent:</span>{' '}
              I allow this app to display my Valorant match data.
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            <ShieldCheck className="w-4 h-4" /> Continue to Veteran
          </Button>
        </form>
      </Card>
    </div>
  );
}
