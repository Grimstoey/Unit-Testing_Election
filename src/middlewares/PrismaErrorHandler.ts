import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  const isProd = process.env.NODE_ENV === "production";

  // ===============================
  // Prisma Known Request Errors
  // ===============================
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = Unique constraint failed
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Duplicate value (unique constraint failed)",
        ...(isProd ? {} : { code: err.code, meta: err.meta }),
      });
    }

    // P2025 = Record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "Record not found",
        ...(isProd ? {} : { code: err.code, meta: err.meta }),
      });
    }

    // P2003 = Foreign key constraint failed
    if (err.code === "P2003") {
      return res.status(400).json({
        message: "Foreign key constraint failed",
        ...(isProd ? {} : { code: err.code, meta: err.meta }),
      });
    }

    // fallback สำหรับ prisma known error อื่น ๆ
    return res.status(400).json({
      message: "Database error",
      ...(isProd ? {} : { code: err.code, meta: err.meta }),
    });
  }

  // ===============================
  // Prisma Validation Error
  // ===============================
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Invalid database query",
      ...(isProd ? {} : { detail: err.message }),
    });
  }

  // ===============================
  // Prisma Initialization Error
  // ===============================
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      message: "Database connection error",
      ...(isProd ? {} : { detail: err.message }),
    });
  }

  // ===============================
  // Default
  // ===============================
  return res.status(500).json({
    message: "Internal server error",
  });
}
