import express from 'express';
import cors from 'cors';
import { readJson, writeJson } from './utils/jsonStorage.js';
import * as matchService from './services/matchService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Label middleware for compliance and transparency
app.use((req, res, next) => {
  res.setHeader('X-Data-Source', 'PLACEHOLDER DATA - not from Riot API');
  next();
});

// -------------------------------------------------------------
// COACHES ENDPOINTS
// -------------------------------------------------------------
// GET /api/coaches - list coaches with optional specialty & agent filter
app.get('/api/coaches', (req, res) => {
  const { specialty, agent } = req.query;
  let coaches = readJson('coaches.json');

  if (specialty && specialty !== 'all') {
    coaches = coaches.filter(
      (c) => c.specialty.toLowerCase() === specialty.toLowerCase()
    );
  }

  if (agent && agent !== 'all') {
    coaches = coaches.filter((c) =>
      c.agents.some((a) => a.toLowerCase() === agent.toLowerCase())
    );
  }

  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: coaches
  });
});

// GET /api/coaches/:id - get single coach profile
app.get('/api/coaches/:id', (req, res) => {
  const coaches = readJson('coaches.json');
  const coach = coaches.find((c) => c.id === req.params.id);
  if (!coach) {
    return res.status(404).json({ error: 'Coach not found' });
  }
  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: coach
  });
});

// -------------------------------------------------------------
// TEAMS ENDPOINTS
// -------------------------------------------------------------
// GET /api/teams - list all teams
app.get('/api/teams', (req, res) => {
  const teams = readJson('teams.json');
  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: teams
  });
});

// POST /api/teams - create team with missing roles
app.post('/api/teams', (req, res) => {
  const { name, level, members = [], missingRoles = [] } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  const teams = readJson('teams.json');
  const newTeam = {
    id: `team-${Date.now()}`,
    name,
    level: level || 'semi-pro',
    members,
    missingRoles
  };

  teams.push(newTeam);
  writeJson('teams.json', teams);

  res.status(201).json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: newTeam
  });
});

// GET /api/teams/:id/matches - matches for a specific team
app.get('/api/teams/:id/matches', (req, res) => {
  const matches = matchService.getMatchesByTeam(req.params.id);
  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: matches
  });
});

// -------------------------------------------------------------
// MATCHES & PLAYERS ENDPOINTS (via matchService)
// -------------------------------------------------------------
// GET /api/matches/:id
app.get('/api/matches/:id', (req, res) => {
  const match = matchService.getMatchById(req.params.id);
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: match
  });
});

// GET /api/players/:puuid/matches - player's opted-in match history
app.get('/api/players/:puuid/matches', (req, res) => {
  const matches = matchService.getMatchesByPlayer(req.params.puuid);
  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: matches
  });
});

// -------------------------------------------------------------
// TEAM BUILDER MATCHING ALGORITHM
// POST /api/match - input missing roles, returns ranked candidates
// -------------------------------------------------------------
app.post('/api/match', (req, res) => {
  const { missingRoles = [], agentsPreference = [] } = req.body;

  const players = readJson('players.json');
  const coaches = readJson('coaches.json');

  const normalizedRoles = missingRoles.map((r) => r.toLowerCase().trim());
  const normalizedAgents = agentsPreference.map((a) => a.toLowerCase().trim());

  // Rank players
  const rankedPlayers = players
    .map((player) => {
      let score = 0;
      const reasons = [];

      // Check role match
      if (normalizedRoles.includes(player.role.toLowerCase())) {
        score += 50;
        reasons.push(`Plays missing role: ${player.role}`);
      }

      // Check agent overlap
      const agentOverlap = player.agents.filter((ag) =>
        normalizedAgents.includes(ag.toLowerCase())
      );
      if (agentOverlap.length > 0) {
        score += agentOverlap.length * 15;
        reasons.push(`Covers target agents: ${agentOverlap.join(', ')}`);
      }

      // Base score for general flexibility
      score += (player.agents?.length || 0) * 2;

      return {
        ...player,
        matchScore: score,
        matchReasons: reasons
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  // Rank coaches
  const rankedCoaches = coaches
    .map((coach) => {
      let score = 0;
      const reasons = [];

      // Match coach specialty or former role to missing team needs
      if (
        normalizedRoles.includes(coach.specialty.toLowerCase()) ||
        normalizedRoles.includes(coach.formerRole.toLowerCase())
      ) {
        score += 60;
        reasons.push(`Coaching specialty aligns with: ${coach.specialty}`);
      }

      // Agent coaching synergy
      const agentOverlap = coach.agents.filter((ag) =>
        normalizedAgents.includes(ag.toLowerCase())
      );
      if (agentOverlap.length > 0) {
        score += agentOverlap.length * 20;
        reasons.push(`Specialist in agents: ${agentOverlap.join(', ')}`);
      }

      // Bonus for proven results record
      if (coach.results?.length) {
        score += coach.results.length * 10;
        reasons.push(`${coach.results.length} verified team improvement cases`);
      }

      return {
        ...coach,
        matchScore: score,
        matchReasons: reasons
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: {
      matchedPlayers: rankedPlayers,
      matchedCoaches: rankedCoaches
    }
  });
});

// -------------------------------------------------------------
// VOD REVIEWS ENDPOINTS
// GET/POST /api/vods (link, matchId, notes: [{timestamp, text}])
// -------------------------------------------------------------
app.get('/api/vods', (req, res) => {
  const vods = readJson('vods.json');
  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: vods
  });
});

app.post('/api/vods', (req, res) => {
  const { link, matchId, title, coachName, notes = [] } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'VOD link is required' });
  }

  const vods = readJson('vods.json');
  const newVod = {
    id: `vod-${Date.now()}`,
    link,
    matchId: matchId || 'unassigned',
    title: title || 'Tactical VOD Session',
    coachName: coachName || 'Veteran Coach',
    createdAt: new Date().toISOString(),
    notes
  };

  vods.unshift(newVod);
  writeJson('vods.json', vods);

  res.status(201).json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: newVod
  });
});

// Update notes on an existing VOD
app.post('/api/vods/:id/notes', (req, res) => {
  const { timestamp, text } = req.body;
  const vods = readJson('vods.json');
  const vodIndex = vods.findIndex((v) => v.id === req.params.id);

  if (vodIndex === -1) {
    return res.status(404).json({ error: 'VOD review not found' });
  }

  const noteItem = {
    id: `note-${Date.now()}`,
    timestamp: timestamp || '00:00',
    text: text || ''
  };

  vods[vodIndex].notes = vods[vodIndex].notes || [];
  vods[vodIndex].notes.push(noteItem);
  writeJson('vods.json', vods);

  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: vods[vodIndex]
  });
});

// -------------------------------------------------------------
// SCRIMS ENDPOINTS
// GET/POST /api/scrims (teamId, opponent, datetime, status)
// -------------------------------------------------------------
app.get('/api/scrims', (req, res) => {
  const scrims = readJson('scrims.json');
  res.json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: scrims
  });
});

app.post('/api/scrims', (req, res) => {
  const { teamId, opponent, datetime, map, status = 'scheduled' } = req.body;
  if (!opponent || !datetime) {
    return res.status(400).json({ error: 'Opponent and datetime are required' });
  }

  const scrims = readJson('scrims.json');
  const newScrim = {
    id: `scrim-${Date.now()}`,
    teamId: teamId || 'team-001',
    opponent,
    datetime,
    map: map || 'Ascent',
    status // 'scheduled', 'completed', 'cancelled'
  };

  scrims.push(newScrim);
  writeJson('scrims.json', scrims);

  res.status(201).json({
    notice: 'PLACEHOLDER DATA - not from Riot API',
    data: newScrim
  });
});

// -------------------------------------------------------------
// CONTENT / METADATA CATALOG
// -------------------------------------------------------------
app.get('/api/content', (req, res) => {
  const content = readJson('content.json');
  res.json(content);
});

// Start the express server
app.listen(PORT, () => {
  console.log(`[Veteran Backend] Server running on http://localhost:${PORT}`);
  console.log('[Veteran Backend] Label: PLACEHOLDER DATA - not from Riot API');
});
