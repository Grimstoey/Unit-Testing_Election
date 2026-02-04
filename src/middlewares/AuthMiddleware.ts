import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
    auth?: JwtPayload;
}

export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing access token" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);
        req.auth = payload;
        return next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
