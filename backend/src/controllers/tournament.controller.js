const Tournament = require('../models/Tournament')

exports.getTournaments = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.category) filter.category = req.query.category

    const tournaments = await Tournament.find(filter).populate('teams', 'name shortName logo')
    res.json({ results: tournaments.length, tournaments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('teams', 'name shortName logo city')
    if (!tournament) {
      return res.status(404).json({ message: 'Torneo no encontrado' })
    }
    res.json({ tournament })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createTournament = async (req, res) => {
  try {
    const tournament = await Tournament.create(req.body)
    res.status(201).json({ message: 'Torneo creado correctamente', tournament })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!tournament) {
      return res.status(404).json({ message: 'Torneo no encontrado' })
    }
    res.json({ message: 'Torneo actualizado correctamente', tournament })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id)
    if (!tournament) {
      return res.status(404).json({ message: 'Torneo no encontrado' })
    }
    res.json({ message: 'Torneo eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
