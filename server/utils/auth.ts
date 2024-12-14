import { hash, compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export const hashPassword = (password: string) => hash(password, 10)

export const verifyPassword = (password: string, hash: string) => compare(password, hash)

export const generateToken = async (payload: object) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
})