const Category = require('../models/Category')

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    next(err)
  }
}

const createCategory = async (req, res, next) => {
  try {
    const body = { ...req.body }
    delete body.id
    const category = await Category.create(body)
    res.status(201).json(category)
  } catch (err) {
    next(err)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' })
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { getCategories, createCategory, deleteCategory }
