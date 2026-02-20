import type { Request, Response, NextFunction } from "express";
import {  type JwtPayload } from "../utils/jwt";
import {  meService } from "@/services/AuthService";

export interface AuthenticatedRequest extends Request {
  auth?: JwtPayload;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing access token" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in! Please log in to get access" });
  }

  try {
    const userInfo = await meService(token);
    if (!userInfo) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!req.body) {
      req.body = {};
    }

    req.body.user = userInfo;

    return next(); 
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
