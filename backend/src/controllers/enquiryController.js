const Enquiry = require('../models/Enquiry')

const getEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 })
    res.json(enquiries)
  } catch (err) {
    next(err)
  }
}

const createEnquiry = async (req, res, next) => {
  try {
    const body = { ...req.body }
    delete body.id
    const enquiry = await Enquiry.create(body)
    res.status(201).json(enquiry)
  } catch (err) {
    next(err)
  }
}

module.exports = { getEnquiries, createEnquiry }
