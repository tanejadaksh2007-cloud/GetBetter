import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function ScrimScheduler() {
  const [scrims, setScrims] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Scrim Form State
  const [teamId, setTeamId] = useState('team-001');
  const [opponent, setOpponent] = useState('Vanguard Esports');
  const [datetime, setDatetime] = useState('2026-11-21T20:00');
  const [map, setMap] = useState('Ascent');
  const [status, setStatus] = useState('scheduled');

  const mapsList = ['Ascent', 'Bind', 'Haven', 'Split', 'Lotus', 'Sunset', 'Abyss'];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [scrimsRes, teamsRes] = await Promise.all([
        fetch('/api/scrims'),
        fetch('/api/teams')
      ]);

      if (!scrimsRes.ok || !teamsRes.ok) throw new Error('Failed to load scrims data');

      const scrimsJson = await scrimsRes.json();
      const teamsJson = await teamsRes.json();

      setTeams(teamsJson.data || []);
      let list = scrimsJson.data || [];

      if (list.length === 0) {
        const seed1 = {
          teamId: 'team-001',
          opponent: 'Team Delta (Collegiate)',
          datetime: '2026-11-18T19:00',
          map: 'Ascent',
          status: 'scheduled'
        };
        const seed2 = {
          teamId: 'team-001',
          opponent: 'Team Echo (Semi-Pro)',
          datetime: '2026-11-15T21:00',
          map: 'Haven',
          status: 'completed'
        };
        await fetch('/api/scrims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seed1)
        });
        await fetch('/api/scrims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seed2)
        });
        const fresh = await (await fetch('/api/scrims')).json();
        list = fresh.data || [];
      }

      setScrims(list);
    } catch (err) {
      console.error(err);
      setError('Could not connect to scrim scheduling service.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScrim = async (e) => {
    e.preventDefault();
    if (!opponent || !datetime) return;
    try {
      const res = await fetch('/api/scrims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, opponent, datetime, map, status })
      });
      const json = await res.json();
      if (json.data) {
        setScrims([json.data, ...scrims]);
        setOpponent('');
      }
    } catch (err) {
      console.error('Failed to create scrim', err);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'completed':
        return <Badge variant="yellow" size="sm">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="loss" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="outline" size="sm">Scheduled</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge={
          <Badge variant="red" size="sm">
            <Calendar className="w-3 h-3 inline mr-1" /> Practice Coordination
          </Badge>
        }
        title="Scrim Schedule"
        description="Coordinate practice lobbies, agree on map vetoes, and track team scrim history."
      />

      {error ? (
        <Card className="text-center py-12 text-red">
          <AlertCircle className="w-8 h-8 text-red mx-auto mb-2" />
          <p className="text-sm font-semibold">{error}</p>
        </Card>
      ) : loading ? (
        <LoadingSkeleton count={2} type="card" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <Card className="h-fit space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-wide text-text font-rajdhani flex items-center gap-2">
              <Plus className="w-5 h-5 text-red" /> Schedule Scrim
            </h2>

            <form onSubmit={handleCreateScrim} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Your Team
                </label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full bg-bg border border-border text-text text-xs p-2.5 focus:border-red focus:outline-none transition-colors"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Opponent Team"
                placeholder="e.g. Spartan Prime"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Map Selection
                </label>
                <select
                  value={map}
                  onChange={(e) => setMap(e.target.value)}
                  className="w-full bg-bg border border-border text-text text-xs p-2.5 focus:border-red focus:outline-none transition-colors"
                >
                  {mapsList.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="w-full bg-bg border border-border text-text text-xs p-2.5 focus:border-red focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-bg border border-border text-text text-xs p-2.5 focus:border-red focus:outline-none transition-colors"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Confirm Scrim Slot
              </Button>
            </form>
          </Card>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase tracking-wide text-text font-rajdhani">
                Scheduled & Recent Scrims
              </h3>
              <Badge variant="outline" size="sm">
                {scrims.length} matches
              </Badge>
            </div>

            {scrims.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Scrims Scheduled"
                description="Book your first practice lobby against a collegiate or semi-pro opponent using the form."
              />
            ) : (
              <div className="space-y-3">
                {scrims.map((scrim) => {
                  const teamName = teams.find((t) => t.id === scrim.teamId)?.name || 'Team';
                  const formattedDate = new Date(scrim.datetime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <Card
                      key={scrim.id}
                      hover
                      padding="p-4 sm:p-5"
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <div className="text-base font-bold text-text uppercase font-rajdhani">
                          {teamName} <span className="text-red font-normal">vs</span> {scrim.opponent}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-muted font-mono">
                          <span className="flex items-center gap-1.5 text-text">
                            <MapPin className="w-3.5 h-3.5 text-red" /> {scrim.map}
                          </span>
                          <span className="flex items-center gap-1.5 text-text">
                            <Clock className="w-3.5 h-3.5 text-yellow" /> {formattedDate}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">{getStatusBadge(scrim.status)}</div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
