const express = require('express')
const router = express.Router()
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController')
const { isAuthenticated } = require('../middleware/auth')

router.get('/', getAboutContent)
router.put('/', isAuthenticated, updateAboutContent)

module.exports = router
