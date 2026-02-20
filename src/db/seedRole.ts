import { prisma } from '../lib/prisma'

export async function seedRole() {
  await prisma.role.createMany({
    data: [{ name: 'ROLE_VOTER' }, { name: 'ROLE_EC' }, { name: 'ROLE_ADMIN' }],
    skipDuplicates: true,
  })
}
