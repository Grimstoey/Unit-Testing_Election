import type { Request, Response } from "express";
import { getAllUsersService, findByUserIdService} from "../services/UserService";
import {GetAllUsersQueryDto} from "../models/user/getAllUsersDto";
import {getUserRolesService , addUserRoleService, removeUserRoleService} from "../services/RoleService";



// type GetAllUsersQueryDto เข้า req
export async function getAllUsersController(req: Request, res: Response) {
  const inputPage = req.query.page as string | undefined;
  const inputLimit = req.query.limit as string | undefined;


  const intPage = inputPage ? parseInt(inputPage, 10) : 1;
  const intLimit = inputLimit ? parseInt(inputLimit, 10) : 10;
    /*
    แปลง string เป็น number
    parseInt(inputPage, 10) กำหนดเป็นฐาน 10 
    ป้องกันปัญหาที่อาจเกิดจากการตีความเป็นฐานอื่นแบบอัตโนมัติ
    ได้ค่าเป็น 64-bit floating point (IEEE 754 double-precision floating-point)
    เลขทศนิยม 64 บิต ที่แม่นยำจริงแค่ 53 บิต
    ค่าจะดูเป็น integer แต่จริง ๆ คือ floating-point 64-bit
    ทุกอย่างคือ "number"
    >= ES5 ไม่ต้องใส่ก็ได้ ให้ผลลัพธ์เหมือนกัน
    ไม่ใส่ก็ได้ ใส่ก็ดี
  */

  // ===== validate page =====
  if (Number.isNaN(intPage) || intPage < 1) {
    return res.status(400).json({
      message: "Invalid page. page must be an integer >= 1",
    });
  }

  // ===== validate limit =====
  if (Number.isNaN(intLimit) || intLimit < 1) {
    return res.status(400).json({
      message: "Invalid limit. limit must be an integer >= 1",
    });
  }

  // ===== validate search =====
  const inputSearch = (req.query.search as string) || undefined;
  if (inputSearch && typeof inputSearch !== "string") {
    return res.status(400).json({
      message: "Invalid search. search must be a string",
    });
  }

  // ===== validate sortBy =====
  const allowedSortBy = ["id", "createdAt", "firstName", "lastName"] as const;
  const sortBy = (req.query.sortBy as string) || "id";

  if (!allowedSortBy.includes(sortBy as any)) {
    return res.status(400).json({
      message: `Invalid sortBy. sortBy must be one of: ${allowedSortBy.join(", ")}`,
    });
  }

  // ===== validate order =====
  const order = ((req.query.order as string) || "desc").toLowerCase();
  if (order !== "asc" && order !== "desc") {
    return res.status(400).json({
      message: "Invalid order. order must be 'asc' or 'desc'",
    });
  }

  // ===== build dto =====
  const usersQueryDto: GetAllUsersQueryDto = {
    page: intPage,
    limit: intLimit,
    search: inputSearch,
    sortBy: sortBy as any,
    order: order as any,
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

export async function getUserRolesController(req: Request, res: Response) {
  
  const userId = parseInt(req.params.id as string);


  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  const result = await getUserRolesService(userId);

  if (!result.success) {
    return res.status(404).json(result);
  }

  return res.status(200).json(result);
}



export async function addUserRoleController(req: Request, res: Response) {
  const adminUser = req.body.user;
  const { userId, roleName } = req.body;

  const result = await addUserRoleService(
    adminUser,
    Number(userId),
    roleName
  );

  if (!result.success) {
    return res.status(403).json(result);
  }

  return res.status(200).json(result);
}


export async function removeUserRoleController(req: Request, res: Response) {
  const adminUser = req.body.user;
  const { userId, roleName } = req.body;

  const result = await removeUserRoleService(
    adminUser,
    Number(userId),
    roleName
  );

  if (!result.success) {
    return res.status(403).json(result);
  }

  return res.status(200).json(result);
}



