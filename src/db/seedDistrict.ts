import { prisma } from "../lib/prisma"

export async function seedDistrict() {
  const districtsData: Record<string, string[]> = {
    กรุงเทพมหานคร: [
      "พระนคร", "ดุสิต", "ปทุมวัน", "บางรัก", "ยานนาวา", "สาทร",
      "บางคอแหลม", "คลองเตย", "ดินแดง", "ห้วยขวาง", "ลาดพร้าว",
      "วังทองหลาง", "บางกะปิ", "สะพานสูง", "บางนา", "พระโขนง",
    ],
    เชียงใหม่: [
      "เมืองเชียงใหม่", "แม่ริม", "สันทราย", "ดอยสะเก็ด",
      "หางดง", "สันป่าตอง", "ฝาง", "แม่อาย",
    ],
    นครราชสีมา: [
      "เมืองนครราชสีมา", "โชคชัย", "ปากช่อง", "สีคิ้ว",
      "พิมาย", "ชุมพวง", "บัวใหญ่", "โนนสูง",
    ],
    ขอนแก่น: [
      "เมืองขอนแก่น", "บ้านฝาง", "น้ำพอง",
      "อุบลรัตน์", "ชนบท", "แวงใหญ่",
    ],
    ชลบุรี: [
      "เมืองชลบุรี", "บ้านบึง", "ศรีราชา",
      "บางละมุง", "พนัสนิคม", "หนองใหญ่",
    ],
    สงขลา: [
      "เมืองสงขลา", "สทิงพระ", "หาดใหญ่",
      "คลองหอยโข่ง", "จะนะ", "เทพา",
    ],
    อุบลราชธานี: [
      "เมืองอุบลราชธานี", "วารินชำราบ",
      "เดชอุดม", "นาเยีย", "พิบูลมังสาหาร", "ตระการพืชผล",
    ],
  }

  const provinces = await prisma.province.findMany({
    include: {
      constituencies: {
        orderBy: { number: "asc" },
      },
    },
  })

  for (const province of provinces) {
    const districtNames = districtsData[province.name]

    if (!districtNames) {
      console.warn(`⚠️ No districts defined for province: ${province.name}`)
      continue
    }

    if (!province.constituencies.length) {
      console.warn(`⚠️ No constituencies in province: ${province.name}`)
      continue
    }

    const dataToCreate = districtNames.map((name, index) => {
      const constituency =
        province.constituencies[
        index % province.constituencies.length
        ]

      return {
        name,
        provinceId: province.id,
        constituencyId: constituency.id,
      }
    })

    await prisma.district.createMany({
      data: dataToCreate,
      skipDuplicates: true,
    })
  }

  console.log("--->>> Seeding districts completed!")
}