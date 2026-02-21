import { prisma } from "../lib/prisma";

// เพิ่ม role ให้ user
export async function addRoleToUser(userId: number, roleId: number) {
  return prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
}

// ลบ role ที่เลือก
export async function deleteRoleFromUser(userId: number, roleId: number) {
  return prisma.userRole.delete({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
  });
}

// ลบ role ทั้งหมดของ user
export async function deleteAllRolesByUserId(userId: number) {
  return prisma.userRole.deleteMany({
    where: { userId },
  });
}

// ดึง role ทั้งหมดของ user
export async function findUserRolesByUserId(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) return null;

  return user.roles.map((r) => r.role.name);
}
