import {
  findUserRolesByUserId,
  addRoleToUser,
  removeRoleFromUser,
} from "../repositories/UserRoleRepository";
import { findRoleByName } from "../repositories/RoleRepository";
import { UserRole } from "../models/role/userRoleDto";
import { RoleName } from "../models/role/roleNameDto";

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

// เพิ่ม role ให้ user
export async function addUserRoleService(
  targetUserId: number,
  roleName: RoleName,
) {
  if (roleName === RoleName.VOTER) {
    return {
      success: false,
      statusCode: 400,
      message: "ROLE_VOTER is default and cannot be manually added",
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

  await addRoleToUser(targetUserId, role.id);

  return {
    success: true,
    statusCode: 200,
    message: "Role added successfully",
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

  await removeRoleFromUser(targetUserId, role.id);

  return {
    success: true,
    statusCode: 200,
    message: "Role removed successfully",
  };
}
