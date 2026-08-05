export default function StandingsTable({ standings }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-gray-800">
            <th className="text-left py-3 px-4">#</th>
            <th className="text-left py-3 px-4">Equipo</th>
            <th className="py-3 px-4">PJ</th>
            <th className="py-3 px-4">G</th>
            <th className="py-3 px-4">P</th>
            <th className="py-3 px-4">PF</th>
            <th className="py-3 px-4">PC</th>
            <th className="py-3 px-4">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => (
            <tr key={row.team._id} className="border-b border-gray-800 hover:bg-gray-900 transition">
              <td className="py-3 px-4 text-gray-400">{index + 1}</td>
              <td className="py-3 px-4 font-semibold">{row.team.name}</td>
              <td className="py-3 px-4 text-center">{row.wins + row.losses}</td>
              <td className="py-3 px-4 text-center text-green-400">{row.wins}</td>
              <td className="py-3 px-4 text-center text-red-400">{row.losses}</td>
              <td className="py-3 px-4 text-center">{row.pointsFor}</td>
              <td className="py-3 px-4 text-center">{row.pointsAgainst}</td>
              <td className="py-3 px-4 text-center font-bold text-orange-400">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
