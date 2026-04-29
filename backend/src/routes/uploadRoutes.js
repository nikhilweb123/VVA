const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { uploadFile } = require('../controllers/uploadController')
const { isAuthenticated } = require('../middleware/auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/projects'))
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const ext = path.extname(file.originalname)
    cb(null, `project-${timestamp}-${randomStr}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

router.post('/', isAuthenticated, upload.single('file'), uploadFile)

module.exports = router
