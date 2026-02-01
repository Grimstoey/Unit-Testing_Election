import { prisma } from '../lib/prisma'

export async function seedProvince() {
  await prisma.province.createMany({
    data: [
      { name: 'กรุงเทพมหานคร' },
      { name: 'เชียงใหม่' },
      { name: 'ขอนแก่น' },
      { name: 'ชลบุรี' },
      { name: 'นครราชสีมา' },
    ],
    skipDuplicates: true,
  })
}
