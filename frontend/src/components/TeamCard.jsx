import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function TeamCard({ team }) {
  return (
    <Link to={`/teams/${team._id}`}>
      <div className="glass rounded-xl p-5 border border-white/5 hover:border-orange-500/50 transition-all group">
        <div className="flex items-center gap-4">
          {team.logo ? (
            <motion.img
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              src={team.logo}
              alt={team.name}
              className="w-14 h-14 object-contain rounded-full border-2 border-orange-500/30 group-hover:border-orange-500 transition"
            />
          ) : (
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black text-lg"
            >
              {team.shortName}
            </motion.div>
          )}
          <div>
            <h3 className="font-bold text-lg group-hover:text-orange-400 transition">{team.name}</h3>
            <p className="text-gray-400 text-sm">{team.city}, {team.province}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}