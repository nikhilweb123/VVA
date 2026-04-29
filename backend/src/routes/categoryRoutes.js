const express = require('express')
const router = express.Router()
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController')
const { isAuthenticated } = require('../middleware/auth')

router.get('/', getCategories)
router.post('/', isAuthenticated, createCategory)
router.delete('/:id', isAuthenticated, deleteCategory)

module.exports = router
