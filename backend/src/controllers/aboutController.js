const AboutContent = require('../models/AboutContent')

const getAboutContent = async (req, res, next) => {
  try {
    let about = await AboutContent.findOne({})
    if (!about) {
      about = await AboutContent.create({})
    }
    res.json(about)
  } catch (err) {
    next(err)
  }
}

const updateAboutContent = async (req, res, next) => {
  try {
    const body = { ...req.body }
    delete body.id
    delete body._id
    let about = await AboutContent.findOne({})
    if (!about) {
      about = await AboutContent.create(body)
    } else {
      about = await AboutContent.findByIdAndUpdate(about._id, body, {
        new: true,
        runValidators: true,
      })
    }
    res.json(about)
  } catch (err) {
    next(err)
  }
}

module.exports = { getAboutContent, updateAboutContent }
