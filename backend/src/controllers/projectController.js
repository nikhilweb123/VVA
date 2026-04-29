const Project = require('../models/Project')

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 })
    res.json(projects)
  } catch (err) {
    next(err)
  }
}

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }
    res.json(project)
  } catch (err) {
    next(err)
  }
}

const createProject = async (req, res, next) => {
  try {
    const body = { ...req.body }
    delete body.id
    delete body._id
    const project = await Project.create(body)
    res.status(201).json(project)
  } catch (err) {
    next(err)
  }
}

const updateProject = async (req, res, next) => {
  try {
    const body = { ...req.body }
    delete body.id
    delete body._id
    const project = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    })
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }
    res.json(project)
  } catch (err) {
    next(err)
  }
}

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' })
    }
    res.json({ success: true, message: 'Project deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject }
