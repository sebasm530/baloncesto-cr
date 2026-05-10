import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PlayerCard({ player }) {
  return (
    <Link to={`/players/${player._id}`}>
      <div className="glass rounded-xl p-5 border border-white/5 hover:border-orange-500/50 transition-all group">
        <div className="flex items-center gap-4">
          {player.photo ? (
            <img src={player.photo} alt={player.name} className="w-14 h-14 object-cover rounded-full border-2 border-orange-500/30 group-hover:border-orange-500 transition" />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl border-2 border-white/5 group-hover:border-orange-500/30 transition">
              👤
            </div>
          )}
          <div>
            <h3 className="font-bold group-hover:text-orange-400 transition">{player.name} {player.lastName}</h3>
            <p className="text-orange-400 text-sm">#{player.number} · {player.position}</p>
            <p className="text-gray-500 text-sm">{player.team?.name}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}