require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/database')
const User = require('./models/User')
const Team = require('./models/Team')
const Player = require('./models/Player')
const Tournament = require('./models/Tournament')
const Game = require('./models/Game')
const News = require('./models/News')

const seed = async () => {
  await connectDB()
  console.log('🧹 Limpiando base de datos...')
  await User.deleteMany()
  await Team.deleteMany()
  await Player.deleteMany()
  await Tournament.deleteMany()
  await Game.deleteMany()
  await News.deleteMany()

  // Usuarios
  console.log('👤 Creando usuarios...')
  const admin = await User.create({ name: 'Admin CR', email: 'admin@baloncestocr.com', password: 'admin123', role: 'admin' })
  const coach = await User.create({ name: 'Coach Mora', email: 'coach@baloncestocr.com', password: 'coach123', role: 'coach' })

  // Equipos
  console.log('🏀 Creando equipos...')
  const team1 = await Team.create({ name: 'Halcones de San José', shortName: 'HAL', city: 'San José', province: 'San José', coach: coach._id })
  const team2 = await Team.create({ name: 'Toros de Alajuela', shortName: 'TOR', city: 'Alajuela', province: 'Alajuela' })
  const team3 = await Team.create({ name: 'Leones de Cartago', shortName: 'LEO', city: 'Cartago', province: 'Cartago' })
  const team4 = await Team.create({ name: 'Tiburones de Limón', shortName: 'TIB', city: 'Limón', province: 'Limón' })

  // Jugadores
  console.log('👥 Creando jugadores...')
  const players1 = await Player.insertMany([
    { name: 'Carlos', lastName: 'Rojas', number: 10, position: 'Base', team: team1._id, nationality: 'Costarricense', height: 185, weight: 82 },
    { name: 'Andrés', lastName: 'Mora', number: 23, position: 'Alero', team: team1._id, nationality: 'Costarricense', height: 198, weight: 95 },
    { name: 'Diego', lastName: 'Vargas', number: 5, position: 'Pívot', team: team1._id, nationality: 'Costarricense', height: 205, weight: 110 },
  ])
  const players2 = await Player.insertMany([
    { name: 'Luis', lastName: 'Jiménez', number: 7, position: 'Escolta', team: team2._id, nationality: 'Costarricense', height: 190, weight: 88 },
    { name: 'Marco', lastName: 'Solís', number: 14, position: 'Ala-Pívot', team: team2._id, nationality: 'Costarricense', height: 200, weight: 100 },
    { name: 'Pablo', lastName: 'Castro', number: 3, position: 'Base', team: team2._id, nationality: 'Costarricense', height: 183, weight: 80 },
  ])

  // Torneo
  console.log('🏆 Creando torneo...')
  const tournament = await Tournament.create({
    name: 'Liga Nacional de Baloncesto 2026',
    season: '2026',
    category: 'Nacional',
    startDate: new Date('2026-01-15'),
    teams: [team1._id, team2._id, team3._id, team4._id],
    status: 'en curso'
  })

  // Partidos
  console.log('⚽ Creando partidos...')
  const game1 = await Game.create({
    tournament: tournament._id,
    homeTeam: team1._id,
    awayTeam: team2._id,
    homeScore: 78,
    awayScore: 65,
    date: new Date('2026-02-01'),
    location: 'Gimnasio Nacional',
    status: 'finalizado',
    homePlayerStats: [
      { player: players1[0]._id, points: 22, rebounds: 5, assists: 8, steals: 2, blocks: 0, fouls: 2, minutesPlayed: 35 },
      { player: players1[1]._id, points: 18, rebounds: 7, assists: 3, steals: 1, blocks: 1, fouls: 3, minutesPlayed: 32 },
      { player: players1[2]._id, points: 14, rebounds: 12, assists: 1, steals: 0, blocks: 3, fouls: 4, minutesPlayed: 28 },
    ],
    awayPlayerStats: [
      { player: players2[0]._id, points: 20, rebounds: 4, assists: 6, steals: 3, blocks: 0, fouls: 2, minutesPlayed: 36 },
      { player: players2[1]._id, points: 15, rebounds: 9, assists: 2, steals: 0, blocks: 2, fouls: 3, minutesPlayed: 30 },
      { player: players2[2]._id, points: 10, rebounds: 3, assists: 7, steals: 1, blocks: 0, fouls: 1, minutesPlayed: 34 },
    ]
  })

  const game2 = await Game.create({
    tournament: tournament._id,
    homeTeam: team3._id,
    awayTeam: team4._id,
    homeScore: 82,
    awayScore: 75,
    date: new Date('2026-02-05'),
    location: 'Coliseo de Cartago',
    status: 'finalizado',
    homePlayerStats: [],
    awayPlayerStats: []
  })

  const game3 = await Game.create({
    tournament: tournament._id,
    homeTeam: team1._id,
    awayTeam: team3._id,
    date: new Date('2026-05-20'),
    location: 'Gimnasio Nacional',
    status: 'programado'
  })

  // Noticias
  console.log('📰 Creando noticias...')
  await News.insertMany([
    { title: 'Halcones vencen a Toros en emocionante partido', content: 'Los Halcones de San José se impusieron 78-65 ante los Toros de Alajuela en un partido lleno de emoción en el Gimnasio Nacional. Carlos Rojas lideró el ataque con 22 puntos.', author: admin._id, category: 'resultado', published: true },
    { title: 'Leones dominan a Tiburones', content: 'Los Leones de Cartago ganaron 82-75 a los Tiburones de Limón en el Coliseo de Cartago.', author: admin._id, category: 'resultado', published: true },
    { title: 'Liga Nacional 2026 en marcha', content: 'La Liga Nacional de Baloncesto 2026 arrancó con grandes partidos. Cuatro equipos compiten por el título nacional este año.', author: admin._id, category: 'torneo', published: true },
  ])

  console.log('✅ Datos de prueba creados exitosamente!')
  console.log('─────────────────────────────────')
  console.log('👤 Admin: admin@baloncestocr.com / admin123')
  console.log('👤 Coach: coach@baloncestocr.com / coach123')
  console.log('─────────────────────────────────')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})