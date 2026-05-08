import { Link } from 'react-router-dom'

export default function TeamCard({ team }) {
  return (
    <Link to={`/teams/${team._id}`} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-orange-500 transition block">
      <div className="flex items-center gap-4">
        {team.logo ? (
          <img src={team.logo} alt={team.name} className="w-14 h-14 object-contain rounded-full" />
        ) : (
          <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
            {team.shortName}
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg">{team.name}</h3>
          <p className="text-gray-400 text-sm">{team.city}, {team.province}</p>
        </div>
      </div>
    </Link>
  )
}