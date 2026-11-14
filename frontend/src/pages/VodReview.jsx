import React, { useState, useEffect } from 'react';
import { Video, Plus, Clock, ExternalLink, MessageSquare, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

export default function VodReview() {
  const [vods, setVods] = useState([]);
  const [activeVod, setActiveVod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New VOD form state
  const [newLink, setNewLink] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [newTitle, setNewTitle] = useState('Ascent A-Site Retake & Smokes Breakdown');
  const [newMatchId, setNewMatchId] = useState('match-val-001');

  // New Note form state
  const [noteTimestamp, setNoteTimestamp] = useState('04:12');
  const [noteText, setNoteText] = useState('');
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);

  useEffect(() => {
    fetchVods();
  }, []);

  const fetchVods = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vods');
      if (!res.ok) throw new Error('Failed to fetch VOD reviews');
      const json = await res.json();
      const list = json.data || [];
      if (list.length === 0) {
        // Seed initial demo VOD if empty
        const initialVod = {
          link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Ascent Split-A Execution & Mid Control VOD',
          matchId: 'match-val-001',
          coachName: "Marcus 'ViperMain24' Vance",
          notes: [
            { id: '1', timestamp: '01:25', text: 'Omen smoked tree too late; Jett forced to dry peek garden.' },
            { id: '2', timestamp: '04:18', text: 'Post-plant crossfire setup: Sova was isolated in wine with no trade.' },
            { id: '3', timestamp: '09:40', text: 'Clean fake on B main drew out both Killjoy utility pieces before full A hit.' }
          ]
        };
        const createRes = await fetch('/api/vods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(initialVod)
        });
        const created = await createRes.json();
        setVods([created.data]);
        setActiveVod(created.data);
      } else {
        setVods(list);
        setActiveVod(list[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the VOD review service.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVod = async (e) => {
    e.preventDefault();
    if (!newLink) return;
    try {
      const res = await fetch('/api/vods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link: newLink,
          title: newTitle || 'Untitled Match Review',
          matchId: newMatchId,
          coachName: 'Veteran Coach',
          notes: []
        })
      });
      const json = await res.json();
      if (json.data) {
        setVods([json.data, ...vods]);
        setActiveVod(json.data);
        setNewTitle('');
      }
    } catch (err) {
      console.error('Failed to add vod', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!activeVod || !noteText) return;
    try {
      const res = await fetch(`/api/vods/${activeVod.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: noteTimestamp || '00:00',
          text: noteText
        })
      });
      const json = await res.json();
      if (json.data) {
        setActiveVod(json.data);
        setVods(vods.map((v) => (v.id === json.data.id ? json.data : v)));
        setNoteText('');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('embed/')) return url;
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge={
          <Badge variant="accent" size="sm">
            <Video className="w-3 h-3 inline mr-1" /> Tactical Analysis
          </Badge>
        }
        title="VOD Review & Timestamps"
        description="Inspect scrim recordings with interactive timestamped coach critique. Click any note to highlight the tactical timestamp."
      />

      {error ? (
        <Card className="text-center py-12 text-rose-300">
          <AlertCircle className="w-8 h-8 text-valAccent mx-auto mb-2" />
          <p className="text-sm font-semibold">{error}</p>
        </Card>
      ) : loading ? (
        <LoadingSkeleton count={2} type="card" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Video Player */}
          <div className="lg:col-span-2 space-y-5">
            <Card padding="p-0" className="overflow-hidden">
              {activeVod ? (
                <div>
                  <div className="aspect-video bg-black relative">
                    <iframe
                      src={getEmbedUrl(activeVod.link)}
                      title={activeVod.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-5 border-t border-valBorder flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-wide text-white font-rajdhani">
                        {activeVod.title}
                      </h2>
                      <div className="text-xs text-valMuted mt-1 flex flex-wrap items-center gap-3 font-mono">
                        <span>Match ID: <strong className="text-slate-200">{activeVod.matchId}</strong></span>
                        <span>•</span>
                        <span>Reviewer: <strong className="text-teal-300">{activeVod.coachName}</strong></span>
                      </div>
                    </div>

                    <a
                      href={activeVod.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-valMuted hover:text-white bg-[#121C26] border border-valBorder hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Direct Link
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center text-valMuted text-xs">
                  No active VOD selected.
                </div>
              )}
            </Card>

            {/* Import New VOD Box */}
            <Card className="p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-valMuted">
                Import New Scrim Replay
              </h3>
              <form onSubmit={handleAddVod} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  placeholder="YouTube Video URL"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  required
                />
                <Input
                  placeholder="Session Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Button type="submit" variant="primary" size="md">
                  <Plus className="w-4 h-4" /> Import VOD
                </Button>
              </form>
            </Card>
          </div>

          {/* Right: Timestamped Notes & Feedback */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-valBorder">
                <h3 className="text-lg font-bold uppercase tracking-wide text-white font-rajdhani flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  Timestamp Notes
                </h3>
                <Badge variant="teal" size="sm">
                  {activeVod?.notes?.length || 0} notes
                </Badge>
              </div>

              {selectedTimestamp && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-valAccent/30 text-xs text-rose-200 flex items-center justify-between">
                  <span>
                    Highlighting timestamp: <strong className="font-mono text-white">{selectedTimestamp}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedTimestamp(null)}
                    className="text-valMuted hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Note List */}
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {activeVod?.notes?.length === 0 ? (
                  <div className="text-center py-8 text-valMuted text-xs">
                    No timestamp notes added yet. Use the form below.
                  </div>
                ) : (
                  activeVod?.notes?.map((n, i) => {
                    const isSelected = selectedTimestamp === n.timestamp;
                    return (
                      <div
                        key={n.id || i}
                        onClick={() => setSelectedTimestamp(n.timestamp)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-180 text-xs space-y-1 ${
                          isSelected
                            ? 'bg-valCardHover border-valAccent text-white shadow-sm'
                            : 'bg-[#121C26] border-valBorder hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {n.timestamp}
                          </span>
                          <span className="text-[10px] text-valMuted">Click to focus</span>
                        </div>
                        <p className="pt-1 leading-relaxed text-slate-200">{n.text}</p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="pt-3 border-t border-valBorder space-y-2.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-valMuted">
                  Add Timestamp Note
                </span>
                <div className="flex gap-2">
                  <div className="w-28 shrink-0">
                    <Input
                      placeholder="05:20"
                      value={noteTimestamp}
                      onChange={(e) => setNoteTimestamp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Critique note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="secondary" size="sm" className="w-full">
                  Save Note
                </Button>
              </form>
            </Card>

            {/* Sessions Selector */}
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-valMuted">
                Active Scrim Sessions
              </h4>
              <div className="space-y-2">
                {vods.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVod(v)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      activeVod?.id === v.id
                        ? 'bg-valCardHover border-valAccent text-white'
                        : 'bg-[#121C26] border-valBorder text-valMuted hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2 font-medium">{v.title}</span>
                    <Badge variant="outline" size="sm">
                      {v.notes?.length || 0}
                    </Badge>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
