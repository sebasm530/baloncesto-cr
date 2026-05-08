import api from './client'

export const getStandings = (tournamentId) => api.get(`/stats/standings/${tournamentId}`)
export const getPlayerStats = (tournamentId) => api.get(`/stats/players/${tournamentId}`)
export const getTeamStats = (tournamentId) => api.get(`/stats/teams/${tournamentId}`)