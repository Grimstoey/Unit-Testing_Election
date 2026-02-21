import { prisma } from "../lib/prisma";

// กำหนด role ให้ user แบบ upsert
export async function assignRoleToUser(userId: number, roleId: number) {
  return prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
    update: {},
    create: {
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
  const user = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: true,
    },
  });

  if (!user) return null;

  return user;
}
