require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')
const validateEnv = require('./src/config/env')

const PORT = process.env.PORT || 5000

const startServer = async () => {
  validateEnv()

  await connectDB()

  const server = app.listen(PORT, () => {
    console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  })

  process.on('SIGTERM', () => {
    console.log('⚠️ SIGTERM received. Shutting down gracefully...')
    server.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
  })

  process.on('SIGINT', () => {
    console.log('⚠️ SIGINT received. Shutting down gracefully...')
    server.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
    server.close(() => process.exit(1))
  })
}

startServer()
