export default function GameCard({ game }) {
  const date = new Date(game.date).toLocaleDateString('es-CR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-xs mb-3">{date} · {game.location || 'Por definir'}</p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
            {game.homeTeam?.shortName}
          </div>
          <span className="font-semibold">{game.homeTeam?.name}</span>
        </div>
        <div className="text-center">
          {game.status === 'finalizado' ? (
            <span className="text-2xl font-bold">{game.homeScore} - {game.awayScore}</span>
          ) : (
            <span className="text-gray-400 text-sm">VS</span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="font-semibold">{game.awayTeam?.name}</span>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
            {game.awayTeam?.shortName}
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span className={`text-xs px-3 py-1 rounded-full ${
          game.status === 'finalizado' ? 'bg-green-900 text-green-400' :
          game.status === 'en curso' ? 'bg-orange-900 text-orange-400' :
          'bg-gray-800 text-gray-400'
        }`}>
          {game.status}
        </span>
      </div>
    </div>
  )
}