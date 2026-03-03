import { prisma } from '../lib/prisma'

export async function getAllConstituencies() {
  return prisma.constituency.findMany()
}

export async function getConstituencyById(id: number) {
  return prisma.constituency.findUnique({
    where: { id },
    select: {
      id: true,
      number: true,
      provinceId: false,
      isClosed: true,
      province: {
        select: {
          name: true,
        },
      },
    },
  })
}
export async function addConstituency(number: number, provinceId: number) {
  const result = await prisma.constituency.create({
    data: {
      number: number,
      provinceId: provinceId,
    },
  })
  return result
}
export async function deleteConstituency(id: number) {
  const result = await prisma.constituency.delete({
    where: { id },
  })
  return result
}
export async function editConstituency(
  id: number,
  number: number,
  provinceId: number,
  isClosed: boolean,
) {
  const result = await prisma.constituency.update({
    where: { id },
    data: {
      number: number,
      provinceId: provinceId,
      isClosed: isClosed,
    },
  })
  return result
}
export async function getAllEventsWithProvincePagination(
  limit: number,
  page: number,
  provinceId: number,
) {
  const where = provinceId ? { provinceId } : {}
  const total = await prisma.constituency.count({ where })
  const result = await prisma.constituency.findMany({
    skip: limit * (page - 1),
    take: limit,
    where,
    select: {
      id: true,
      number: true,
      provinceId: true,
      isClosed: true,
      province: {
        select: {
          name: true,
        },
      },
    },
  })
  return {
    total,
    data: result,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

// หาเขตจาก id
// เอาไปตรวจสอบ input ใน CandidateService.ts
export async function findConstituencyByIdRepository(constituencyId: number) {
  return prisma.constituency.findUnique({
    where: { id: constituencyId },
  })
}
