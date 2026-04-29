const express = require('express')
const router = express.Router()
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController')
const { isAuthenticated } = require('../middleware/auth')

router.get('/', getProjects)
router.get('/:id', getProjectById)
router.post('/', isAuthenticated, createProject)
router.put('/:id', isAuthenticated, updateProject)
router.delete('/:id', isAuthenticated, deleteProject)

module.exports = router
