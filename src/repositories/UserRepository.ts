import { GetAllUsersQueryDto } from '@/models/user/getAllUsersDto'
import { prisma } from '../lib/prisma'

// หา user จาก id
export function findByUserIdRepository(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      citizenId: true,
      firstName: true,
      lastName: true,
      address: true,
      createdAt: true,

      // จังหวัดของผู้ใช้
      province: {
        select: {
          id: true,
          name: true,
        },
      },

      // อำเภอของผู้ใช้
      district: {
        select: {
          id: true,
          name: true,

          // เขตของอำเภอ
          constituency: {
            select: {
              id: true,
              number: true,
              isClosed: true,

              province: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },

      // roles
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

      // vote ของ user
      vote: {
        select: {
          id: true,
          candidate: {
            select: {
              id: true,
              number: true,
              firstName: true,
              lastName: true,
              party: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

// หา user จากเลขบัตรประชาชน
export function findByCitizenIdRepository(citizenId: string) {
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

      // จังหวัดของ user
      province: {
        select: {
          id: true,
          name: true,
        },
      },

      // อำเภอของ user
      district: {
        select: {
          id: true,
          name: true,

          // เขตเลือกตั้งของอำเภอ
          constituency: {
            select: {
              id: true,
              number: true,
              isClosed: true,
              province: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },

      // roles
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
  })
}

// สร้าง user
export async function createUserRepository(input: {
  citizenId: string
  hashedPassword: string
  firstName: string
  lastName: string
  address: string
  provinceId: number
  districtId: number
  roleId: number
}) {

  // ตรวจสอบ district
  const district = await prisma.district.findUnique({
    where: { id: input.districtId },
  });

  if (!district) {
    throw new Error("District not found");
  }

  if (district.provinceId !== input.provinceId) {
    throw new Error("District does not belong to selected province");
  }

  // สร้าง user
  return prisma.user.create({
    data: {
      citizenId: input.citizenId,
      password: input.hashedPassword,

      firstName: input.firstName,
      lastName: input.lastName,
      address: input.address,

      provinceId: input.provinceId,
      districtId: input.districtId,

      roles: {
        create: {
          roleId: input.roleId,
        },
      },
    },

    select: {
      id: true,
      citizenId: true,
      firstName: true,
      lastName: true,
      address: true,
      provinceId: true,
      districtId: true,
      createdAt: true,

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

//เรียก user ทั้งหมด
export async function getAllUsersRepository(query: GetAllUsersQueryDto) {
  const {
    page,
    limit,
    search,
    sortBy = 'id',
    order = 'asc',
    provinceId,
  } = query

  const skip = (page - 1) * limit

  const where = search
    ? {
      OR: [
        { citizenId: { contains: search, mode: 'insensitive' as const } },
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
      ],
    }
    : {}

  if (provinceId) {
    Object.assign(where, { provinceId })
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        citizenId: true,
        firstName: true,
        lastName: true,
        address: true,
        provinceId: true,
        districtId: true,
        createdAt: true,

        province: true,
        district: {
          select: {
            id: true,
            name: true,
            constituency: {
              select: {
                id: true,
                number: true,
                provinceId: true,
                isClosed: true,
              },
            },
          },
        },

        roles: {
          select: {
            role: true,
          },
        },

        vote: {
          select: {
            id: true,
            createdAt: true,
            candidate: {
              select: {
                id: true,
                number: true,
                constituency: {
                  select: {
                    id: true,
                    number: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ])

  return {
    total,
    users,
    page,
    limit,
    //ปัดเศษขึ้น
    totalPages: Math.ceil(total / limit),
  }
}
