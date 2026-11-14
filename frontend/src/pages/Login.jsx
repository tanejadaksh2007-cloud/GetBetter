import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckSquare, Square, Info } from 'lucide-react';

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
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-valCard border border-slate-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-valRed via-rose-500 to-amber-500" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600/10 border border-valRed/30 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <span className="text-valRed font-black text-3xl">V</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide uppercase">
            Sign In with Riot
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate your VALORANT account identity
          </p>
        </div>

        {/* Mock Notice Box */}
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-lg p-3 text-xs text-amber-200 mb-6 flex gap-2.5">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-300 mb-0.5">Mockup Authentication</strong>
            Real Riot Sign On (RSO) requires production API keys and registered redirect URIs. Choose a pre-seeded account below to simulate login.
          </div>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Simulated Account
            </label>
            <div className="space-y-2">
              {mockProfiles.map((p) => (
                <label
                  key={p.puuid}
                  onClick={() => setSelectedProfile(p.puuid)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedProfile === p.puuid
                      ? 'bg-slate-800 border-valRed text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm text-white">
                      {p.gameName}
                    </span>{' '}
                    <span className="text-xs text-slate-400">#{p.tagLine}</span>
                    <div className="text-[11px] text-slate-400 capitalize">
                      {p.type} • {p.role}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      p.type === 'coach'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-teal-950 text-teal-300 border border-teal-800'
                    }`}
                  >
                    {p.type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Opt-in Policy Checkbox */}
          <div
            onClick={() => setOptIn(!optIn)}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800 cursor-pointer select-none"
          >
            <button
              type="button"
              className="text-valRed shrink-0 mt-0.5 focus:outline-none"
            >
              {optIn ? (
                <CheckSquare className="w-5 h-5 text-valRed" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </button>
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Data Privacy Opt-In:</span>{' '}
              I allow this app to display my Valorant match data. Opponents and non-opted players remain private.
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-valRed hover:bg-valRedDark text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <ShieldCheck className="w-5 h-5" />
            Continue to Veteran
          </button>
        </form>
      </div>
    </div>
  );
}
