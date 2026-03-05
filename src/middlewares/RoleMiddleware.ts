import { Response, NextFunction, Request } from 'express'

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user

    if (!user || !user.roles) {
      return res.status(403).json({
        message: 'Forbidden: no roles found',
      })
    }

    const hasRole = user.roles.some(
      (r: any) => r.role?.name === role
    )

    if (!hasRole) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions',
      })
    }

    return next()
  }
}