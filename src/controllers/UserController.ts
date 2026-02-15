import type { Request, Response } from "express";
import { getAllUsersService } from "../services/UserService";
import {GetAllUsersQueryDto} from "../models/user/getAllUsersDto"



// type GetAllUsersQueryDto เข้า req
export async function getAllUsersController(req: Request, res: Response) {
  const inputPage = req.query.page as string | undefined;
  const inputLimit = req.query.limit as string | undefined;

  const intPage = inputPage ? parseInt(inputPage, 10) : 1;
  const intLimit = inputLimit ? parseInt(inputLimit, 10) : 10;

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

  return getAllUsersService(usersQueryDto)
    .then((result) => {
      return res.status(200).json({
        message: "Get all users success",
        ...result,
      });
    })
    .catch((error) => {
      console.error("getAllUsersController error:", error);
      return res.status(500).json({
        message: "There was an error retrieving the data.",
      });
    });
}
