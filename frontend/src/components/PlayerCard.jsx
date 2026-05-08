import { Link } from 'react-router-dom'

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player._id}`} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-orange-500 transition block">
      <div className="flex items-center gap-4">
        {player.photo ? (
          <img src={player.photo} alt={player.name} className="w-14 h-14 object-cover rounded-full" />
        ) : (
          <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
        )}
        <div>
          <h3 className="font-bold">{player.name} {player.lastName}</h3>
          <p className="text-orange-400 text-sm">#{player.number} · {player.position}</p>
          <p className="text-gray-400 text-sm">{player.team?.name}</p>
        </div>
      </div>
    </Link>
  )
}