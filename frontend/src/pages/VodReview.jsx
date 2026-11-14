import React, { useState, useEffect } from 'react';
import { Video, Plus, Clock, ExternalLink, MessageSquare, Play } from 'lucide-react';

export default function VodReview() {
  const [vods, setVods] = useState([]);
  const [activeVod, setActiveVod] = useState(null);
  const [loading, setLoading] = useState(true);

  // New VOD form state
  const [newLink, setNewLink] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [newTitle, setNewTitle] = useState('Ascent A-Site Retake & Smokes Failure Breakdown');
  const [newMatchId, setNewMatchId] = useState('match-val-001');

  // New Note form state
  const [noteTimestamp, setNoteTimestamp] = useState('04:12');
  const [noteText, setNoteText] = useState('');
  const [selectedTimestamp, setSelectedTimestamp] = useState(null);

  useEffect(() => {
    fetchVods();
  }, []);

  const fetchVods = async () => {
    try {
      const res = await fetch('/api/vods');
      const json = await res.json();
      const list = json.data || [];
      if (list.length === 0) {
        // Seed an initial demo VOD if empty
        const initialVod = {
          link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Ascent Split-A Execution & Mid Control VOD',
          matchId: 'match-val-001',
          coachName: "Marcus 'ViperMain24' Vance",
          notes: [
            { id: '1', timestamp: '01:25', text: 'Omen smoked tree too late; Jett forced to dry peek garden.' },
            { id: '2', timestamp: '04:18', text: 'Post-plant crossfire setup: Sova was isolated in wine with no trade.' },
            { id: '09:40', text: 'Clean fake on B main drew out both Killjoy utility pieces before full A hit.' }
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
      console.error('Error fetching vods', err);
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

  // Convert youtube watch URL to embed URL if needed
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-valCard border border-slate-800 rounded-2xl p-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Video className="w-7 h-7 text-valRed" /> VOD Review & Tactical Timestamps
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze scrim replays, identify utility miscommunications, and tag actionable timestamps for your roster.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: VOD Player + Embedded Frame */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-valCard border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            {activeVod ? (
              <div>
                <div className="aspect-video bg-black relative flex items-center justify-center">
                  <iframe
                    src={getEmbedUrl(activeVod.link)}
                    title={activeVod.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-4 sm:p-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{activeVod.title}</h2>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>Match ID: <strong className="text-slate-300 font-mono">{activeVod.matchId}</strong></span>
                      <span>Reviewer: <strong className="text-valTeal">{activeVod.coachName}</strong></span>
                    </div>
                  </div>

                  <a
                    href={activeVod.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Direct Link
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-slate-500 text-sm">
                No active VOD selected.
              </div>
            )}
          </div>

          {/* New VOD Input Box */}
          <div className="bg-valCard border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Add New Scrim VOD Link
            </h3>
            <form onSubmit={handleAddVod} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="YouTube or Twitch URL"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-valRed focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Session Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:border-valRed focus:outline-none"
              />
              <button
                type="submit"
                className="bg-valRed hover:bg-valRedDark text-white text-xs font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Import VOD
              </button>
            </form>
          </div>
        </div>

        {/* Right: Timestamped Notes & Feedback */}
        <div className="space-y-6">
          <div className="bg-valCard border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-valTeal" />
                Coach Timestamp Notes
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {activeVod?.notes?.length || 0} notes
              </span>
            </div>

            {selectedTimestamp && (
              <div className="mb-3 p-2.5 rounded bg-red-950/40 border border-valRed/30 text-xs text-rose-300 flex items-center justify-between">
                <span>
                  Focused on timestamp: <strong className="font-mono text-white">{selectedTimestamp}</strong>
                </span>
                <button
                  onClick={() => setSelectedTimestamp(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Note List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {activeVod?.notes?.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No timestamped notes yet for this session. Add one below.
                </div>
              ) : (
                activeVod?.notes?.map((n, i) => (
                  <div
                    key={n.id || i}
                    onClick={() => setSelectedTimestamp(n.timestamp)}
                    className="p-3 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg cursor-pointer transition-colors text-xs space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {n.timestamp}
                      </span>
                      <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to highlight
                      </span>
                    </div>
                    <p className="text-slate-300 pt-1 leading-relaxed">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
              <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Add Timestamp Note
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM:SS (e.g. 05:40)"
                  value={noteTimestamp}
                  onChange={(e) => setNoteTimestamp(e.target.value)}
                  className="w-28 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 font-mono focus:border-valRed focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Note (e.g. Flash was too high, blinded team)"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:border-valRed focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-valRed text-white text-xs font-bold py-2 rounded-lg transition-colors uppercase tracking-wider"
              >
                Save Timestamp Note
              </button>
            </form>
          </div>

          {/* VOD Selector List */}
          <div className="bg-valCard border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Recorded Scrim Sessions
            </h3>
            <div className="space-y-2">
              {vods.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVod(v)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                    activeVod?.id === v.id
                      ? 'bg-slate-800 border-valRed text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate pr-2">{v.title}</span>
                  <span className="text-[10px] text-valTeal shrink-0 font-mono">
                    {v.notes?.length || 0} notes
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
