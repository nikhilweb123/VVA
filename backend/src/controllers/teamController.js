const TeamMember = require('../models/TeamMember')

const getTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find({}).sort({ order: 1, createdAt: 1 })
    res.json(members)
  } catch (err) {
    next(err)
  }
}

const getTeamMemberById = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id)
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    res.json(member)
  } catch (err) {
    next(err)
  }
}

const createTeamMember = async (req, res, next) => {
  try {
    const body = { ...req.body }
    delete body.id
    delete body._id
    const member = await TeamMember.create(body)
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
}

const updateTeamMember = async (req, res, next) => {
  try {
    const body = { ...req.body }
    delete body.id
    delete body._id
    const member = await TeamMember.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    res.json(member)
  } catch (err) {
    next(err)
  }
}

const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) {
      return res.status(404).json({ success: false, error: 'Team member not found' })
    }
    res.json({ success: true, message: 'Team member deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
}
