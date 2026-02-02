import { prisma } from "../lib/prisma"

/*
 * จำนวนเขตเลือกตั้งต่อจังหวัด
 * ต้องตรงกับ DISTRICT_IN_CONSTITUENCY_MAP 
 * obj ใน [ seedDistrictInConstituency.ts ]
 */

const CONSTITUENCY_COUNT_MAP: Record<string, number> = {
  กรุงเทพมหานคร: 8,
  เชียงใหม่: 4,
  นครราชสีมา: 4,
  ขอนแก่น: 3,
  ชลบุรี: 3,
  สงขลา: 3,
  อุบลราชธานี: 3,
}

export async function seedConstituency() {
  const provinces = await prisma.province.findMany()

  if (provinces.length === 0) {
    throw new Error("No provinces found.")
  }

  const constituencyToCreate: {
    number: number
    provinceId: number
  }[] = []

  for (const province of provinces) {
    const constituencyCount = CONSTITUENCY_COUNT_MAP[province.name]

    if (!constituencyCount) {
      console.warn(
        `⚠️ No constituency count defined for province: ${province.name}`
      )
      continue
    }

    for (let i = 1; i <= constituencyCount; i++) {
      constituencyToCreate.push({
        number: i,
        provinceId: province.id,
      })
    }
  }

  await prisma.constituency.createMany({
    data: constituencyToCreate,
    skipDuplicates: true,
  })

  console.log("--->>> Seeded constituencies completed!")
}
