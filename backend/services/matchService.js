import { readJson } from '../utils/jsonStorage.js';

/**
 * Match Service for VALORANT match records.
 *
 * NOTE ON RIOT API INTEGRATION:
 * In a production Riot Games developer environment, this service would query
 * the VAL-MATCH-V1 endpoint (e.g. https://{region}.api.riotgames.com/val/match/v1/matches/{matchId})
 * authenticated with a secure server-side RGAPI-xxx production API key.
 *
 * Below is where the real Riot API call would replace the local JSON read:
 * --------------------------------------------------------------------------
 * // const response = await fetch(`https://${region}.api.riotgames.com/val/match/v1/matches/${matchId}`, {
 * //   headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
 * // });
 * // const matchData = await response.json();
 * --------------------------------------------------------------------------
 */

export function getAllMatches() {
  // PLACEHOLDER DATA - not from Riot API
  return readJson('matches.json');
}

export function getMatchById(matchId) {
  // PLACEHOLDER DATA - not from Riot API
  const matches = readJson('matches.json');
  return matches.find((m) => m.matchId === matchId) || null;
}

export function getMatchesByTeam(teamId) {
  // PLACEHOLDER DATA - not from Riot API
  const matches = readJson('matches.json');
  return matches.filter((m) => m.teamId === teamId);
}

export function getMatchesByPlayer(puuid) {
  // PLACEHOLDER DATA - not from Riot API
  const matches = readJson('matches.json');
  return matches.filter((m) => m.players?.some((p) => p.puuid === puuid));
}
