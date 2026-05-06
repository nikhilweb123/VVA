const express = require('express')
const router = express.Router()
const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController')
const { isAuthenticated } = require('../middleware/auth')

router.get('/', getTeamMembers)
router.get('/:id', getTeamMemberById)
router.post('/', isAuthenticated, createTeamMember)
router.put('/:id', isAuthenticated, updateTeamMember)
router.delete('/:id', isAuthenticated, deleteTeamMember)

module.exports = router
