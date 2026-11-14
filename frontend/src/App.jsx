import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import CoachDirectory from './pages/CoachDirectory';
import CoachProfile from './pages/CoachProfile';
import TeamBuilder from './pages/TeamBuilder';
import VodReview from './pages/VodReview';
import ScrimScheduler from './pages/ScrimScheduler';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-valDark text-slate-100">
      {/* Riot Approval Warning Mockup Banner */}
      <Banner />

      {/* Main Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/coaches" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/coaches" element={<CoachDirectory />} />
          <Route path="/coaches/:id" element={<CoachProfile />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/vods" element={<VodReview />} />
          <Route path="/scrims" element={<ScrimScheduler />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/coaches" replace />} />
        </Routes>
      </main>

      {/* Persistent Compliance Footer */}
      <Footer />
    </div>
  );
}
