import { prisma } from "../lib/prisma";


// หา role ของ user จาก UserId 
export async function findUserRolesByUserId(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
}

// เพิ่ม role ให้ user
export async function addRoleToUser(userId: number, roleId: number) {
  return await prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
}

// ลบ role ออกจาก user
export async function removeRoleFromUser(userId: number, roleId: number) {
  return await prisma.userRole.delete({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
  });
}


// หา role จากชื่อ
export async function findRoleByName(roleName: string) {
  return await prisma.role.findUnique({
    where: { name: roleName },
  });
}