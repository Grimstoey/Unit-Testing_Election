import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./AuthMiddleware";

export function requireRole(...roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.auth) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        const userRoles = req.auth.roles || [];
        const ok = roles.some((r) => userRoles.includes(r));

        if (!ok) {
            return res.status(403).json({ message: "Forbidden: insufficient role" });
        }

        return next();
    };
}
