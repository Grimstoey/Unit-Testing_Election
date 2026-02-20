import type { Request, Response } from "express";
import { registerService, loginService } from "../services/AuthService";

export async function registerController(req: Request, res: Response) {
  const result = await registerService(req.body);

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message });
  }

  return res.status(201).json(result.data);
}

export async function loginController(req: Request, res: Response) {
  const result = await loginService(req.body);

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message });
  }

  return res.status(200).json(result.data);
}

export async function meController(req: Request, res: Response) {
  const user = req.body.user;

  return res.status(200).json(user);
}
