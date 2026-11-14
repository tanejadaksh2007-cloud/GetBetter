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
  X
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
    <nav className="bg-surface border-b border-border sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/coaches"
            className="flex items-center gap-2.5 group select-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 bg-red flex items-center justify-center text-white font-black text-lg clip-cut-corner-tl group-hover:bg-red-hover transition-colors">
              V
            </div>
            <div>
              <span className="font-black text-2xl tracking-wider uppercase text-text font-rajdhani group-hover:text-red transition-colors">
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
                    `px-3.5 py-2 text-xs lg:text-sm font-rajdhani font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-150 ${
                      isActive
                        ? 'bg-red text-white shadow-sm clip-cut-corner-br'
                        : 'text-muted hover:text-text hover:bg-surface-hover'
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
              <div className="flex items-center gap-2.5 bg-bg border border-border pl-2.5 pr-2 py-1.5 clip-slant-right">
                <div className="w-7 h-7 bg-surface border border-border flex items-center justify-center font-bold text-xs text-yellow font-rajdhani">
                  {getInitials(user.gameName)}
                </div>
                <div className="text-left pr-1">
                  <div className="text-xs font-bold text-text leading-tight font-rajdhani uppercase">
                    {user.gameName}{' '}
                    <span className="text-muted text-[10px] font-mono font-normal">#{user.tagLine}</span>
                  </div>
                  <div className="text-[10px] text-muted font-mono leading-tight">
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1 text-muted hover:text-red transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <NavLink to="/login">
                <Button variant="primary" size="sm">
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted hover:text-text hover:bg-surface-hover transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-surface px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-sm font-rajdhani font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-red text-white clip-cut-corner-br'
                        : 'text-muted hover:text-text hover:bg-surface-hover'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border">
            {user ? (
              <div className="flex items-center justify-between p-2.5 bg-bg border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-surface border border-border flex items-center justify-center font-bold text-xs text-yellow font-rajdhani">
                    {getInitials(user.gameName)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text font-rajdhani uppercase">
                      {user.gameName} #{user.tagLine}
                    </div>
                    <div className="text-[10px] text-muted font-mono">{user.role}</div>
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
