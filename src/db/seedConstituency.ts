import { prisma } from "../lib/prisma"

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
  console.log("🧹 Cleaning old constituencies...")

  // ลบก่อนกัน unique ชน
  await prisma.constituency.deleteMany({})

  const provinces = await prisma.province.findMany()

  if (!provinces.length) {
    throw new Error("❌ No provinces found.")
  }

  const dataToCreate: {
    number: number
    provinceId: number
    isClosed: boolean
  }[] = []

  for (const province of provinces) {
    const constituencyCount =
      CONSTITUENCY_COUNT_MAP[province.name]

    if (!constituencyCount) {
      console.warn(
        `⚠️ No constituency count defined for province: ${province.name}`
      )
      continue
    }

    for (let i = 1; i <= constituencyCount; i++) {
      dataToCreate.push({
        number: i,
        provinceId: province.id,
        isClosed: false, // ใส่ explicit ชัดเจน
      })
    }
  }

  await prisma.constituency.createMany({
    data: dataToCreate,
  })

  console.log("--->>> Seeded constituencies completed!")
}