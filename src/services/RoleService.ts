import {
  findUserRolesByUserId,
  addRoleToUser,
  removeRoleFromUser,
  findRoleByName,
} from "../repositories/RoleRepository";

// เรียกดู role ของ user
export async function getUserRolesService(userId: number) {
  const user = await findUserRolesByUserId(userId);

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  if (user.roles.length === 0) {
    return {
      success: true,
      message: "User has no roles",
      roles: [],
    };
  }

  const userRoleNames = user.roles.map((userRole) => userRole.role.name);

  return {
    success: true,
    roles: userRoleNames,
  };
}

// เพิ่ม role ของ user
export async function addUserRoleService(
  adminUser: any,
  targetUserId: number,
  roleName: string,
) {
  // เช็คว่าเป็น ADMIN ไหม
  if (!adminUser.roles.includes("ROLE_ADMIN")) {
    return {
      success: false,
      message: "Only ADMIN can add roles",
    };
  }

  const role = await findRoleByName(roleName);

  if (!role) {
    return {
      success: false,
      message: "Role not found",
    };
  }

  await addRoleToUser(targetUserId, role.id);

  return {
    success: true,
    message: "Role added successfully",
  };
}

export async function removeUserRoleService(
  adminUser: any,
  targetUserId: number,
  roleName: string,
) {
  // เช็คว่าเป็น ADMIN ไหม
  if (!adminUser.roles.includes("ROLE_ADMIN")) {
    return {
      success: false,
      message: "Only ADMIN can remove roles",
    };
  }

  const role = await findRoleByName(roleName);

  if (!role) {
    return {
      success: false,
      message: "Role not found",
    };
  }

  await removeRoleFromUser(targetUserId, role.id);

  return {
    success: true,
    message: "Role removed successfully",
  };
}
