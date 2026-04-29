const path = require('path')
const fs = require('fs/promises')

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }

    const fileUrl = `/uploads/projects/${req.file.filename}`

    res.status(201).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { uploadFile }
