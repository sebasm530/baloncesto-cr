import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function StatsChart({ stats }) {
  const data = stats.slice(0, 10).map(s => ({
    name: `${s.player.name} ${s.player.lastName}`,
    Puntos: parseFloat(s.avgPoints),
    Rebotes: parseFloat(s.avgRebounds),
    Asistencias: parseFloat(s.avgAssists)
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
        <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis tick={{ fill: '#9ca3af' }} />
        <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
        <Bar dataKey="Puntos" fill="#f97316" />
        <Bar dataKey="Rebotes" fill="#3b82f6" />
        <Bar dataKey="Asistencias" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  )
}