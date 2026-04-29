const express = require('express')
const router = express.Router()
const { getEnquiries, createEnquiry } = require('../controllers/enquiryController')
const { isAuthenticated } = require('../middleware/auth')

router.get('/', isAuthenticated, getEnquiries)
router.post('/', createEnquiry)

module.exports = router
