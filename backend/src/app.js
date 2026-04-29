require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const session = require('express-session')
const path = require('path')
const logger = require('./utils/logger')
const { globalLimiter } = require('./middleware/rateLimiter')
const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const enquiryRoutes = require('./routes/enquiryRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

const app = express()

// ── Security ────────────────────────────────────────────────
app.use(helmet())

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Compression ──────────────────────────────────────────────
app.use(compression())

// ── Logger ───────────────────────────────────────────────────
app.use(logger)

// ── Session ──────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}))

// ── Rate Limiting ────────────────────────────────────────────
app.use('/api', globalLimiter)

// ── Body Parser ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Static Files ─────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

// ── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running ✅',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/upload', uploadRoutes)

// ── Error Handlers ────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app
