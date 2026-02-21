import {
  findUserRolesByUserId,
  deleteRoleFromUser,
  assignRoleToUser,
} from "../repositories/UserRoleRepository";
import { findRoleByName } from "../repositories/RoleRepository";
import { RoleName } from "../models/role/roleNameDto";
import { prisma } from "../lib/prisma";

// ดู role ของ user
export async function getUserRolesService(userId: number) {
  const userRoles = await findUserRolesByUserId(userId);

  if (!userRoles) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found",
    };
  }

  return {
    success: true,
    statusCode: 200,
    roles: userRoles,
  };
}

export async function assignRoleWithValidationService(
  userId: number,
  roleId: number,
  roleName: RoleName,
) {
  const existingRoles = await findUserRolesByUserId(userId);

  if (!existingRoles) {
    throw new Error("User not found");
  }

  const hasAdmin = existingRoles.find((r) => r.role.name === RoleName.ADMIN);
  const hasEC = existingRoles.find((r) => r.role.name === RoleName.EC);

  const adminRole = await findRoleByName(RoleName.ADMIN);
  const ecRole = await findRoleByName(RoleName.EC);

  const adminId = adminRole?.id;
  const ecId = ecRole?.id;

  if (roleName === RoleName.VOTER) {
    if (hasAdmin && adminId) {
      deleteRoleFromUser(userId, adminId);
    }
    if (hasEC) {
      if (hasEC && ecId) deleteRoleFromUser(userId, ecId);
    }
  } else {
    const currentRole = hasAdmin ? hasAdmin?.roleId : hasEC?.roleId;

    if (!currentRole) {
      return assignRoleToUser(userId, roleId);
    }

    await prisma.userRole.update({
      where: {
        userId_roleId: {
          userId,
          roleId: currentRole,
        },
      },
      data: {
        roleId,
      },
    });
  }

  // ใช้ transaction เพื่อความปลอดภัย
  // await prisma.$transaction(async (tx) => {
  //   // ถ้าจะให้ ADMIN แต่มี EC อยู่ → ลบ EC ก่อน
  //   if (roleName === RoleName.ADMIN && hasEC) {
  //     const ecRole = await findRoleByName(RoleName.EC);
  //     if (ecRole) {
  //       await tx.userRole.delete({
  //         where: {
  //           userId_roleId: {
  //             userId,
  //             roleId: ecRole.id,
  //           },
  //         },
  //       });
  //     }
  //   }

  //   // ถ้าจะให้ EC แต่มี ADMIN อยู่ → ลบ ADMIN ก่อน
  //   if (roleName === RoleName.EC && hasAdmin) {
  //     const adminRole = await findRoleByName(RoleName.ADMIN);
  //     if (adminRole) {
  //       await tx.userRole.delete({
  //         where: {
  //           userId_roleId: {
  //             userId,
  //             roleId: adminRole.id,
  //           },
  //         },
  //       });
  //     }
  //   }

  //   // เพิ่ม role ใหม่ (กันซ้ำด้วย upsert)
  //   await tx.userRole.upsert({
  //     where: {
  //       userId_roleId: {
  //         userId,
  //         roleId,
  //       },
  //     },
  //     update: {},
  //     create: {
  //       userId,
  //       roleId,
  //     },
  //   });
  // });

  return {
    success: true,
    statusCode: 200,
    message: "Role assigned (auto-switched if needed)",
  };
}

// ลบ role ของ user
export async function removeUserRoleService(
  targetUserId: number,
  roleName: RoleName,
) {
  if (roleName === RoleName.VOTER) {
    return {
      success: false,
      statusCode: 400,
      message: "ROLE_VOTER cannot be removed",
    };
  }

  const role = await findRoleByName(roleName);

  if (!role) {
    return {
      success: false,
      statusCode: 404,
      message: "Role not found",
    };
  }

  await deleteRoleFromUser(targetUserId, role.id);

  return {
    success: true,
    statusCode: 200,
    message: "Role removed successfully",
  };
}
