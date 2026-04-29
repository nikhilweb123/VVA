const requiredEnvVars = [
  'MONGODB_URI',
  'NODE_ENV',
  'PORT',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'FRONTEND_URL',
]

const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key])
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
  console.log('✅ All environment variables validated')
}

module.exports = validateEnv
