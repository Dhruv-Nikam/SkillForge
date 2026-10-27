import jwt from 'jsonwebtoken'

const tokenLifetimeSeconds = 7 * 24 * 60 * 60

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters.')
  }
  return secret
}

export function createToken(userId) {
  return jwt.sign({ sub: userId }, getSecret(), {
    expiresIn: tokenLifetimeSeconds,
    issuer: 'skillforge-api',
    audience: 'skillforge-client',
  })
}

export function verifyToken(token) {
  return jwt.verify(token, getSecret(), {
    issuer: 'skillforge-api',
    audience: 'skillforge-client',
  })
}

export function getTokenLifetimeSeconds() {
  getSecret()
  return tokenLifetimeSeconds
}
