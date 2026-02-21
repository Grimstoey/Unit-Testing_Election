import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./AuthMiddleware";

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth?.roles.includes(role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    return next();
  };
}
