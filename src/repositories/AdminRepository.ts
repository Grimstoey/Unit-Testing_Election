import { prisma } from '../lib/prisma'

export async function getAllConstituencies() {
  return prisma.constituency.findMany()
}
export async function getAllUser() {
  return prisma.user.findMany()
}
export async function getUserByRole(role: string) {
  return prisma.role.findUnique({
    where: { name: role },
    select: {
      id: true,
      name: true,
      userRoles: {
        select: {
          user: {
            select:{
                id: true,
                citizenId: true,
                firstName: true,
                lastName: true,
                address: true,
                createdAt: true,
            }
          }
        },
      }
    }
  })
}
export  async  function getConstituencyById(id: number) {
  return prisma.constituency.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      provinceId: false,
      isClosed: true,
      province:{
        select: {
          name: true
        }
      }
    }
  })
}
export async function addConstituency(number: number, provinceId: number) {
  await prisma.constituency.create({
    data: {
      number: number,
      provinceId: provinceId,
    },
  })
}
export async function deleteConstituency(id: number) {
  await prisma.constituency.delete({
    where: { id },
  })
}
export async function editConstituency(id: number, number: number, provinceId: number, isClosed: boolean) {
  await prisma.constituency.update({
    where: { id },
    data: {
      number: number,
      provinceId: provinceId,
      isClosed: isClosed,
    },
  })
}
export function getAllEventsWithProvincePagination(
  pageSize: number,
  pageNo: number
) {
  return prisma.constituency.findMany({
    skip: pageSize * (pageNo - 1),
    take: pageSize,
    select: {
      id: true,
      number: true,
      provinceId: true,
	  isClosed: true,
      province:{
        select: {
          name: true
        }
      }
    }

  });
}
