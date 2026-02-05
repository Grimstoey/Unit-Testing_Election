import { prisma } from "../lib/prisma"

export async function seedProvince() {
  await prisma.province.createMany({
    data: [
      { name: "กรุงเทพมหานคร" },
      { name: "เชียงใหม่" },
      { name: "นครราชสีมา" },
      { name: "ขอนแก่น" },
      { name: "ชลบุรี" },
      { name: "สงขลา" },
      { name: "อุบลราชธานี" },
    ],
    skipDuplicates: true,
  })

  console.log("--->>> Seeded provinces completed!")
}
