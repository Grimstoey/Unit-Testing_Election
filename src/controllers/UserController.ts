import type { Request, Response } from "express";
import {
  getAllUsersService,
  findByUserIdService,
} from "../services/UserService";
import { GetAllUsersQueryDto } from "../models/user/getAllUsersDto";
import {
  getUserRolesService,
  addUserRoleService,
  removeUserRoleService,
} from "../services/RoleService";
import {UserRole} from "../models/role/userRoleDto";

// ======================================================
// GET ALL USERS
// ======================================================
export async function getAllUsersController(req: Request, res: Response) {
  try {
    const inputPage = req.query.page as string | undefined;
    const inputLimit = req.query.limit as string | undefined;

    const intPage = inputPage ? parseInt(inputPage) : 1;
    const intLimit = inputLimit ? parseInt(inputLimit) : 10;

    if (Number.isNaN(intPage) || intPage < 1) {
      return res.status(400).json({
        message: "Invalid page. page must be >= 1",
      });
    }

    if (Number.isNaN(intLimit) || intLimit < 1) {
      return res.status(400).json({
        message: "Invalid limit. limit must be >= 1",
      });
    }

    const inputSearch =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const allowedSortBy = ["id", "createdAt", "firstName", "lastName"] as const;
    const sortBy =
      typeof req.query.sortBy === "string" &&
      allowedSortBy.includes(req.query.sortBy as any)
        ? req.query.sortBy
        : "id";

    const order =
      req.query.order === "asc" || req.query.order === "desc"
        ? req.query.order
        : "desc";

    const usersQueryDto: GetAllUsersQueryDto = {
      page: intPage,
      limit: intLimit,
      search: inputSearch,
      sortBy: sortBy as any,
      order: order as any,
    };

    const result = await getAllUsersService(usersQueryDto);

    return res.status(200).json({
      message: "Get all users success",
      ...result,
    });
  } catch (error) {
    console.error("getAllUsersController error:", error);
    return res.status(500).json({
      message: "There was an error retrieving the data.",
    });
  }
}

// ======================================================
// GET USER BY ID
// ======================================================
export async function getUserByIdController(req: Request, res: Response) {
  const userId = Number(req.params.id);

  if (Number.isNaN(userId)) {
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

// ======================================================
// GET USER ROLES
// ======================================================
export async function getUserRolesController(req: Request, res: Response) {
  const userId = Number(req.params.id);

  if (Number.isNaN(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const result = await getUserRolesService(userId);

  return res.status(result.statusCode).json(result);
}

// ======================================================
// ADD ROLE
// POST /users/:id/roles
// ======================================================
export async function addUserRoleController(req: Request, res: Response) {
  const adminUser = req.body.user as UserRole;
  const targetUserId = Number(req.params.id);
  const { roleName } = req.body;

  if (!adminUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (Number.isNaN(targetUserId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (!roleName) {
    return res.status(400).json({ message: "roleName is required" });
  }

  const result = await addUserRoleService(
    adminUser,
    targetUserId,
    roleName
  );

  return res.status(result.statusCode).json(result);
}

// ======================================================
// REMOVE ROLE
// DELETE /users/:id/roles
// ======================================================
export async function removeUserRoleController(req: Request, res: Response) {
  const adminUser = req.body.user as UserRole;
  const targetUserId = Number(req.params.id);
  const { roleName } = req.body;

  if (!adminUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (Number.isNaN(targetUserId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (!roleName) {
    return res.status(400).json({ message: "roleName is required" });
  }

  const result = await removeUserRoleService(
    adminUser,
    targetUserId,
    roleName
  );

  return res.status(result.statusCode).json(result);
}