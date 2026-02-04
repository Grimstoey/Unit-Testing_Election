import { prisma } from "../lib/prisma";

export async function findRoleByName(roleName: string) {
    return prisma.role.findUnique({
        where: { name: roleName },
        select: { id: true, name: true },
    });
}
