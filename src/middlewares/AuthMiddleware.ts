import type { Request, Response, NextFunction } from 'express'
import { type JwtPayload } from '../utils/jwt'
import { meService } from '@/services/AuthService'

export interface AuthenticatedRequest extends Request {
  auth?: JwtPayload
}

type UserLookup = typeof meService

/** แยก Dependency เพื่อทดสอบการยืนยันตัวตนโดยไม่เรียก Service จริง */
export function makeRequireAuth(lookupUser: UserLookup) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing access token' })
    }

    const token = header.slice('Bearer '.length).trim()
    if (!token) {
      return res.status(401).json({ message: 'Missing access token' })
    }

    try {
      const userInfo = await lookupUser(token)
      if (!userInfo) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      if (!req.body) req.body = {}
      req.body.user = userInfo.data
      return next()
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
}

export const requireAuth = makeRequireAuth(meService)
