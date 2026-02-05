import { prisma } from '../lib/prisma'

export async function getAllConstituencies() {
  return prisma.constituency.findMany()
}
