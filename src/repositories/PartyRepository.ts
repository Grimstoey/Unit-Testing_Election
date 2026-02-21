import { prisma } from '../lib/prisma'

export async function getAllParty() {
  return prisma.party.findMany()
}
export async function addParty(name: string, logoUrl: string, policy: string) {
  const result = await prisma.party.create({
    data: {
      name: name,
      logoUrl: logoUrl,
      policy: policy,
    },
  })
  return result
}
export async function getPartyById(id: number) {
  return prisma.party.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      policy: true,
    },
  })
}
export async function deleteParty(id: number) {
  const result = await prisma.party.delete({
    where: { id },
  })
  return result
}

export async function editParty(
  id: number,
  name: string,
  logoUrl: string,
  policy: string,
) {
  const result = await prisma.party.update({
    where: { id },
    data: {
      name: name,
      logoUrl: logoUrl,
      policy: policy,
    },
  })
  return result
}
export async function getAllPartyWithPagination(limit: number, page: number) {
  const total = await prisma.party.count()
  const result = await prisma.party.findMany({
    skip: limit * (page - 1),
    take: limit,
    select: {
      id: true,
      name: true,
      logoUrl: true,
      policy: true,
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
