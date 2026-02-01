import { prisma } from '../lib/prisma'

export async function seedRole() {
  await prisma.role.createMany({
    data: [{ name: 'VOTER' }, { name: 'EC' }, { name: 'ADMIN' }],
    skipDuplicates: true,
  })
}
