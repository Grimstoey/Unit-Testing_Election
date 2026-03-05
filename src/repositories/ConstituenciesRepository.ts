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
export async function addConstituency(
  number: number,
  provinceId: number,
  districtIds?: number[],
) {
  return prisma.$transaction(async (tx) => {
    // สร้าง constituency ใหม่
    const constituency = await tx.constituency.create({
      data: {
        number: number,
        provinceId: provinceId,
      },
    })

    // ถ้ามี districtIds ให้ assign อำเภอเข้ากับ constituency นี้
    if (districtIds && districtIds.length > 0) {
      await tx.district.updateMany({
        where: {
          id: { in: districtIds },
          provinceId: provinceId, // ป้องกัน assign อำเภอข้ามจังหวัด
        },
        data: { constituencyId: constituency.id },
      })
    }

    // ดึงข้อมูลพร้อม districts กลับมา
    return tx.constituency.findUnique({
      where: { id: constituency.id },
      include: { districts: true },
    })
  })
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
      districts: {
        select: {
          id: true,
          name: true,
        },
      },
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

// Toggle isClosed ของเขตเดียว
export async function toggleConstituencyStatus(id: number) {
  const current = await prisma.constituency.findUnique({ where: { id } })
  if (!current) return null
  return prisma.constituency.update({
    where: { id },
    data: { isClosed: !current.isClosed },
  })
}

// ปิดหีบทั้งหมด
export async function closeAllConstituencies() {
  return prisma.constituency.updateMany({
    data: { isClosed: true },
  })
}

// เปิดหีบทั้งหมด
export async function openAllConstituencies() {
  return prisma.constituency.updateMany({
    data: { isClosed: false },
  })
}

export async function getAvailableDistrictByProvinceId(provinceId: number) {
  return prisma.district.findMany({
    where: { provinceId, constituencyId: null },
  })
}
