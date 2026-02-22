import { prisma } from "../lib/prisma";

// หา role จากชื่อ
export async function findRoleByName(roleName: string) {
  return await prisma.role.findUnique({
    where: { name: roleName },
  });
}
