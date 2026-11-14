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
      <Card className="p-7 sm:p-8 relative overflow-hidden shadow-2xl border-valBorder">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-valAccent" />

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-valAccent/10 border border-valAccent/30 rounded-xl mx-auto flex items-center justify-center mb-3">
            <span className="text-valAccent font-black text-2xl font-rajdhani">V</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider font-rajdhani">
            Sign in with Riot (mockup)
          </h1>
          <p className="text-xs text-valMuted mt-1">
            Authenticate a simulated account to test the platform
          </p>
        </div>

        {/* Mock Notice Box */}
        <div className="bg-[#1C1417] border border-valAccent/30 rounded-lg p-3 text-xs text-rose-200 mb-6 flex gap-2.5 items-start">
          <Info className="w-4 h-4 text-valAccent shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Mockup - real Riot Sign On requires production API approval.
          </div>
        </div>

        <form onSubmit={handleContinue} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-valMuted uppercase tracking-wider mb-2">
              Select Profile
            </label>
            <div className="space-y-2">
              {mockProfiles.map((p) => (
                <div
                  key={p.puuid}
                  onClick={() => setSelectedProfile(p.puuid)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-180 ${
                    selectedProfile === p.puuid
                      ? 'bg-valCardHover border-valAccent text-white shadow-sm'
                      : 'bg-[#121C26] border-valBorder text-valMuted hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-white">
                      {p.gameName}
                    </span>{' '}
                    <span className="text-xs text-valMuted">#{p.tagLine}</span>
                    <div className="text-[11px] text-valMuted capitalize mt-0.5">
                      {p.type} • {p.role}
                    </div>
                  </div>
                  <Badge variant={p.type === 'coach' ? 'accent' : 'teal'} size="sm">
                    {p.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Opt-in Policy Checkbox */}
          <div
            onClick={() => setOptIn(!optIn)}
            className="flex items-start gap-3 p-3.5 rounded-lg bg-[#121C26] border border-valBorder cursor-pointer select-none transition-colors hover:border-slate-600"
          >
            <button
              type="button"
              className="text-valAccent shrink-0 mt-0.5 focus:outline-none"
            >
              {optIn ? (
                <CheckSquare className="w-5 h-5 text-valAccent" />
              ) : (
                <Square className="w-5 h-5 text-valMuted" />
              )}
            </button>
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white">Data consent:</span>{' '}
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
