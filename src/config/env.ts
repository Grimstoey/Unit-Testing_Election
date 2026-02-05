import dotenv from 'dotenv'
dotenv.config()

function requireEnv(name: string) {
  const value = process.env[name]

  if (!value || value.trim() === '') {
    throw new Error(`Missing environment variable: ${name}`)
  }

  return value
}

export const env = {
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: requireEnv('JWT_EXPIRES_IN'),
}
