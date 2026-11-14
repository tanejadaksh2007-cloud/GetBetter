import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, UserCheck, Video, Calendar, LayoutDashboard, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/coaches', label: 'Coaches', icon: UserCheck },
    { to: '/team-builder', label: 'Team Builder', icon: Users },
    { to: '/vods', label: 'VOD Review', icon: Video },
    { to: '/scrims', label: 'Scrims', icon: Calendar },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="bg-valCard border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <NavLink to="/coaches" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-valRed flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                V
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider uppercase text-white group-hover:text-valRed transition-colors">
                  Veteran
                </span>
                <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                  VALORANT Coaching Hub
                </span>
              </div>
            </NavLink>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-valRed text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Auth Status */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-white">
                    {user.gameName} <span className="text-valMuted text-xs">#{user.tagLine}</span>
                  </div>
                  <div className="text-[11px] text-valTeal uppercase font-bold tracking-wider">
                    {user.type} • {user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-valRed hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-valRed hover:bg-valRedDark text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in with Riot
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden border-t border-slate-800 px-2 py-2 flex justify-around bg-valDark/90 overflow-x-auto text-xs">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-2 py-1 rounded text-center shrink-0 ${
                isActive ? 'text-valRed font-bold' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
