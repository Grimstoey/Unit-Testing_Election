import { prisma } from '../lib/prisma'

export async function getAllProvinces() {
  return prisma.province.findMany()
}

export async function getDistrictsByProvinceId(provinceId: number) {
  return prisma.district.findMany({
    where: { provinceId },
    orderBy: { name: 'asc' },
  })
}

export async function getConstituenciesByDistrictId(districtId: number) {
  return prisma.district.findUnique({
    where: { id: districtId },
    include: {
      constituency: true,
    },
  })
}

export async function getProvincesWithConstituenciesRepository() {
  return prisma.province.findMany({
    include: {
      constituencies: true,
    },
  })
}
