import { GetAllUsersQueryDto } from '@/models/user/getAllUsersDto'
import { prisma } from '../lib/prisma'

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
  })
}

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
  })
}

// สร้าง user
export async function createUser(input: {
  citizenId: string
  hashedPassword: string

  firstName: string
  lastName: string
  address: string

  provinceId: number
  districtId: number

  roleId: number
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
  })
}

//เรียก user ทั้งหมด
export async function getAllUsers(query: GetAllUsersQueryDto) {
  const { page, limit, search, sortBy = 'id', order = 'asc' } = query

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
        constituencyId: true,
        createdAt: true,

        province: true,
        district: true,
        constituency: true,

        roles: {
          select: {
            role: true,
          },
        },

        vote: {
          select: {
            id: true,
            candidateId: true,
            constituencyId: true,
            createdAt: true,
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
