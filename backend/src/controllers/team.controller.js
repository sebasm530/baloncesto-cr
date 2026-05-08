const Team = require('../models/Team')

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ active: true }).populate('coach', 'name email')
    res.json({ results: teams.length, teams })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('coach', 'name email')
    if (!team) {
      return res.status(404).json({ message: 'Equipo no encontrado' })
    }
    res.json({ team })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body)
    res.status(201).json({ message: 'Equipo creado correctamente', team })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!team) {
      return res.status(404).json({ message: 'Equipo no encontrado' })
    }
    res.json({ message: 'Equipo actualizado correctamente', team })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
    if (!team) {
      return res.status(404).json({ message: 'Equipo no encontrado' })
    }
    res.json({ message: 'Equipo eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}