import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getGame, registerResult } from '../../api/games.api'
import { getPlayers } from '../../api/players.api'
import { motion } from 'framer-motion'

const fields = [
  { key: 'minutesPlayed', label: 'MIN' },
  { key: 'points', label: 'PTS' },
  { key: 'rebounds', label: 'REB' },
  { key: 'assists', label: 'AST' },
  { key: 'steals', label: 'ROB' },
  { key: 'turnovers', label: 'PER' },
  { key: 'blocks', label: 'TAP' },
  { key: 'freeThrowsMade', label: 'TL A' },
  { key: 'freeThrowsAttempted', label: 'TL I' },
  { key: 'fouls', label: 'FP' }
]

const blankStats = (players = []) => Object.fromEntries(players.map((player) => [player._id, Object.fromEntries(fields.map(({ key }) => [key, '0']))]))

function TeamStats({ title, players, stats, setStats }) {
  const update = (playerId, field, value) => setStats({ ...stats, [playerId]: { ...stats[playerId], [field]: value } })

  return (
    <section className="glass rounded-xl border border-white/5 overflow-hidden">
      <h4 className="font-black px-5 py-4 border-b border-white/5 text-orange-400">{title}</h4>
      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full text-sm">
          <thead className="text-gray-400 border-b border-white/5">
            <tr>
              <th className="text-left px-4 py-3">Jugador</th>
              {fields.map((field) => <th key={field.key} className="px-2 py-3 whitespace-nowrap">{field.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player._id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 font-semibold whitespace-nowrap">#{player.number} {player.name} {player.lastName}</td>
                {fields.map((field) => (
                  <td key={field.key} className="px-1 py-2 text-center">
                    <input aria-label={`${field.label} de ${player.name}`} type="number" min="0" max={field.key === 'fouls' ? 6 : undefined} value={stats[player._id]?.[field.key] ?? '0'} onChange={(event) => update(player._id, field.key, event.target.value)} className="w-16 rounded-md border border-white/10 bg-white/5 px-2 py-2 text-center text-white focus:border-orange-500 focus:outline-none" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function GameStatsForm({ gameId, onSaved, onCancel }) {
  const { data: gameData, isLoading: loadingGame } = useQuery({ queryKey: ['game', gameId], queryFn: () => getGame(gameId), enabled: !!gameId })
  const game = gameData?.data?.game
  const { data: homePlayersData } = useQuery({ queryKey: ['players', game?.homeTeam?._id], queryFn: () => getPlayers({ team: game.homeTeam._id }), enabled: !!game?.homeTeam?._id })
  const { data: awayPlayersData } = useQuery({ queryKey: ['players', game?.awayTeam?._id], queryFn: () => getPlayers({ team: game.awayTeam._id }), enabled: !!game?.awayTeam?._id })
  const homePlayers = homePlayersData?.data?.players || []
  const awayPlayers = awayPlayersData?.data?.players || []
  const [homeStats, setHomeStats] = useState({})
  const [awayStats, setAwayStats] = useState({})
  const [scores, setScores] = useState({ home: '', away: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const ensureStats = (players, stats, setStats) => {
    if (!players.length || Object.keys(stats).length) return stats
    const initial = blankStats(players)
    setStats(initial)
    return initial
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const currentHomeStats = ensureStats(homePlayers, homeStats, setHomeStats)
    const currentAwayStats = ensureStats(awayPlayers, awayStats, setAwayStats)
    if (!homePlayers.length || !awayPlayers.length) {
      setError('Ambos equipos deben tener jugadores registrados antes de cargar estadísticas.')
      return
    }
    const allStats = [...Object.values(currentHomeStats), ...Object.values(currentAwayStats)]
    if (allStats.some((stat) => Number(stat.fouls || 0) > 6)) {
      setError('Las faltas personales no pueden ser mayores a 6.')
      return
    }
    if (allStats.some((stat) => Number(stat.freeThrowsMade || 0) > Number(stat.freeThrowsAttempted || 0))) {
      setError('Los tiros libres anotados no pueden superar los intentados.')
      return
    }
    setSaving(true)
    try {
      const toEntries = (players, stats) => players.map((player) => ({ player: player._id, ...Object.fromEntries(fields.map(({ key }) => [key, Number(stats[player._id]?.[key] || 0)])) }))
      await registerResult(gameId, { homeScore: Number(scores.home), awayScore: Number(scores.away), homePlayerStats: toEntries(homePlayers, currentHomeStats), awayPlayerStats: toEntries(awayPlayers, currentAwayStats) })
      onSaved()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudieron guardar las estadísticas')
      setSaving(false)
    }
  }

  if (loadingGame) return <div className="glass rounded-xl border border-white/5 p-6 animate-pulse h-40" />

  return (
    <form onSubmit={submit} className="glass rounded-xl border border-white/5 p-4 sm:p-6 mb-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-black text-green-400">Registrar resultado y estadísticas</h3>
          <p className="text-gray-400 text-sm">{game?.homeTeam?.name} vs {game?.awayTeam?.name}</p>
        </div>
        <button type="button" onClick={onCancel} className="text-sm text-gray-400 hover:text-white">Cancelar</button>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <label className="text-sm text-gray-400">Puntos {game?.homeTeam?.shortName}<input type="number" min="0" value={scores.home} onChange={(event) => setScores({ ...scores, home: event.target.value })} className="mt-2 w-full glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500" required /></label>
        <label className="text-sm text-gray-400">Puntos {game?.awayTeam?.shortName}<input type="number" min="0" value={scores.away} onChange={(event) => setScores({ ...scores, away: event.target.value })} className="mt-2 w-full glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500" required /></label>
      </div>
      {error && <p className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-3 rounded-lg text-sm">{error}</p>}
      <TeamStats title={game?.homeTeam?.name || 'Local'} players={homePlayers} stats={homeStats} setStats={setHomeStats} />
      <TeamStats title={game?.awayTeam?.name || 'Visitante'} players={awayPlayers} stats={awayStats} setStats={setAwayStats} />
      <p className="text-gray-500 text-xs">El +/- se calcula automáticamente según el diferencial final y los minutos registrados.</p>
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={saving} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold transition disabled:opacity-50">
        {saving ? 'Guardando estadísticas...' : 'Guardar resultado y estadísticas'}
      </motion.button>
    </form>
  )
}
