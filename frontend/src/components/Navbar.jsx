import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserCheck,
  Video,
  Calendar,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  Target
} from 'lucide-react';
import Button from './ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/coaches', label: 'Coaches', icon: UserCheck },
    { to: '/team-builder', label: 'Team Builder', icon: Users },
    { to: '/vods', label: 'VOD Review', icon: Video },
    { to: '/scrims', label: 'Scrims', icon: Calendar },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const getInitials = (name) => {
    if (!name) return 'V';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-valCard border-b border-valBorder sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/coaches"
            className="flex items-center gap-2.5 group select-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-lg bg-valAccent flex items-center justify-center text-white font-black text-xl shadow-md shadow-valAccent/20 group-hover:bg-valAccentDark transition-all duration-180">
              V
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-wider uppercase text-white font-rajdhani group-hover:text-valAccent transition-colors">
                VETERAN
              </span>
            </div>
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-xs lg:text-sm font-semibold tracking-wide flex items-center gap-2 transition-all duration-180 ${
                      isActive
                        ? 'bg-valAccent text-white shadow-md shadow-valAccent/25 font-bold'
                        : 'text-valMuted hover:text-white hover:bg-valCardHover'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* User Chip / Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-[#121C26] border border-valBorder pl-3 pr-2 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                  {getInitials(user.gameName)}
                </div>
                <div className="text-left pr-1">
                  <div className="text-xs font-bold text-white leading-tight">
                    {user.gameName}{' '}
                    <span className="text-valMuted text-[10px]">#{user.tagLine}</span>
                  </div>
                  <div className="text-[10px] text-valMuted font-mono leading-tight">
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 rounded-full text-valMuted hover:text-valAccent hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <NavLink to="/login">
                <Button variant="primary" size="sm">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-valMuted hover:text-white hover:bg-valCardHover transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-valBorder bg-valCard px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                      isActive
                        ? 'bg-valAccent text-white'
                        : 'text-valMuted hover:text-white hover:bg-valCardHover'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-valBorder">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121C26]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                    {getInitials(user.gameName)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {user.gameName} #{user.tagLine}
                    </div>
                    <div className="text-[10px] text-valMuted">{user.role}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  <LogIn className="w-4 h-4" /> Sign In
                </Button>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
