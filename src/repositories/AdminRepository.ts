import { prisma } from '../lib/prisma'

export async function getAllConstituencies() {
  return prisma.constituency.findMany()
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