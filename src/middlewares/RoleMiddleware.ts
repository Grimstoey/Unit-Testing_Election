import { Response, NextFunction, Request } from 'express'

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {

    console.log(req.body.user)

    if (!req.body.user.roles.includes(role)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions',
      })
    }

    return next()
  }
}
