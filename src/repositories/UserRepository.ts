import { prisma } from "../lib/prisma";

// หา user จากเลขบัตรประชาชน
export function findByCitizenId(citizenId: string) {
  return prisma.user.findUnique({
    where: { citizenId },
    select: {
      id: true,
      citizenId: true,
      password: true,
      firstName: true,
      lastName: true,
      address: true,
      createdAt: true,

      province: true,
      district: {
        include: {
          districtMappings: {
            include: {
              constituency: {
                include: {
                  province: true,
                },
              },
            },
          },
        },
      },

      roles: {
        select: {
          role: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
}

// หา user จาก id
export function findByUserId(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      citizenId: true,
      firstName: true,
      lastName: true,
      address: true,
      createdAt: true,

      province: true,
      district: {
        include: {
          districtMappings: {
            include: {
              constituency: {
                include: {
                  province: true,
                },
              },
            },
          },
        },
      },

      roles: {
        select: {
          role: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
}

// สร้าง user
export async function createUser(input: {
  citizenId: string;
  hashedPassword: string;

  firstName: string;
  lastName: string;
  address: string;

  provinceId: number;
  districtId: number;

  roleId: number;
}) {
  return prisma.user.create({
    data: {
      citizenId: input.citizenId,
      password: input.hashedPassword,

      firstName: input.firstName,
      lastName: input.lastName,
      address: input.address,

      province: {
        connect: { id: input.provinceId },
      },
      district: {
        connect: { id: input.districtId },
      },

      roles: {
        create: {
          role: {
            connect: { id: input.roleId },
          },
        },
      },
    },

    select: {
      id: true,
      citizenId: true,
      firstName: true,
      lastName: true,
      address: true,
      createdAt: true,

      province: true,
      district: true,

      roles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
