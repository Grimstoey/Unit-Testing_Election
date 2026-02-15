import type { Request, Response } from "express";
import { getAllUsersService, findByUserIdService, findByCitizenIdService } from "../services/UserService";
import {GetAllUsersQueryDto} from "../models/user/getAllUsersDto"



// type GetAllUsersQueryDto เข้า req
export async function getAllUsersController(req: Request, res: Response) {

  const intPage = req.query.page ? parseInt(req.query.page as string) : 1;
  const intLimit = req.query.limit ? parseInt(req.query.limit as string) : 10; // จำนวน item ต่อหน้า

  const usersQueryDto: GetAllUsersQueryDto = {
    page: intPage,
    limit: intLimit,
    search: (req.query.search as string) || undefined,
    sortBy: (req.query.sortBy as any) || "id",
    order: (req.query.order as any) || "desc",
  };

  // getAllUsersService เป็น Promise
  return getAllUsersService(usersQueryDto).then(
    (result) => {
      return res.status(200).json({message: "Get all users success", ...result,});
    }
  ).catch((error) => 
  {
    console.error("getAllUsersController error:", error);

    return res.status(500).json({message: "There was an error retrieving the data."});
  });
  
}


export async function getUserByIdController(req: Request, res: Response) {
  const userId = Number(req.params.id);

  if (!userId || Number.isNaN(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = await findByUserIdService(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    message: "Get user by id success",
    user,
  });
}


export async function getUserByCitizenIdController(req: Request, res: Response) {
  const citizenId = String(req.params.citizenId);

  if (!citizenId || citizenId.length != 13) {
    return res.status(400).json({
      message: "Invalid citizenId",
    });
  }

  const user = await findByCitizenIdService(citizenId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // กัน password หลุด
  const { password, ...safeUser } = user;

  return res.status(200).json({
    message: "Get user by citizenId success",
    user: safeUser,
  });
}