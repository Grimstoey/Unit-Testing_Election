import { Request, Response } from "express";
import { assignRoleWithValidationService } from "../services/RoleService";
import { prisma } from "../lib/prisma";
import { RoleName } from "@/models/role/roleNameDto";

export async function assignRoleController(req: Request, res: Response) {
  try {
    // แปลง userId จาก params เป็นตัวเลข
    const userId = Number(req.params.userId);

    // รับ roleName จาก body
    const roleName = req.body.roleName as RoleName;

    // ตรวจสอบว่า userId ถูกต้องหรือไม่
    if (!userId) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    } else {
      // ตรวจสอบว่า roleName ถูกส่งมาหรือไม่
      if (!roleName) {
        return res.status(400).json({
          message: "roleName is required",
        });
      } else {
        // ค้นหา role จากฐานข้อมูล
        const role = await prisma.role.findUnique({
          where: { name: roleName },
        });

        if (role) {
          // เรียก service เพื่อ assign role
          await assignRoleWithValidationService(userId, role.id, roleName);

          return res.status(200).json({
            message: "Role assigned successfully",
          });
        } else {
          return res.status(404).json({
            message: "Role not found",
          });
        }
      }
    }
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}
