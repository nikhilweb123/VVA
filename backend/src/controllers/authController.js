const login = async (req, res) => {
  const { username, password } = req.body

  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const validPassword = process.env.ADMIN_PASSWORD || 'password'

  if (username === validUsername && password === validPassword) {
    req.session.admin = true
    return res.json({ success: true })
  }

  return res.status(401).json({ success: false, error: 'Invalid credentials' })
}

const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Could not log out' })
    }
    res.clearCookie('connect.sid')
    return res.json({ success: true })
  })
}

module.exports = { login, logout }
