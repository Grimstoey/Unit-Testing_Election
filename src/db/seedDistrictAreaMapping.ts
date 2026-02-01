import { prisma } from '../lib/prisma'
import { districtArea, Prisma } from '../generated/prisma/client' // เพิ่ม DistrictArea เข้ามา

export async function seedDistrictAreaMapping() {
  const provinces = await prisma.province.findMany({
    include: {
      districts: true,
      areas: true,
    },
  })

  const mappingData: Prisma.districtAreaOnElectionDistrictCreateManyInput[] = []

  for (const province of provinces) {
    const areas = province.areas
    const electionDistricts = province.districts

    if (areas.length === 0 || electionDistricts.length === 0) continue

    areas.forEach((area: districtArea, index: number) => {
      const districtIndex = index % electionDistricts.length
      const targetElectionDistrict = electionDistricts[districtIndex]

      mappingData.push({
        districtAreaId: area.id,
        electionDistrictId: targetElectionDistrict.id,
      })
    })
  }

  if (mappingData.length > 0) {
    await prisma.districtAreaOnElectionDistrict.createMany({
      data: mappingData,
      skipDuplicates: true,
    })
  }
}
