import { prisma } from '../lib/prisma'

export async function seedCandidate() {
  const parties = await prisma.party.findMany()
  const electionDistricts = await prisma.electionDistrict.findMany()

  if (parties.length === 0 || electionDistricts.length === 0) {
    throw new Error('Missing Party or ElectionDistrict data')
  }

  const fullNames = [
    'พ่อทอง ก้อนทอง',
    'หมื่นไวย ใจเด็ด',
    'ขุนศึก ฝึกรบ',
    'แม่หญิง นิ่งสนิท',
    'พระยา มาไว',
    'ทิดมั่น ขยันยิ่ง',
    'จัน หนวดเขี้ยว',
    'พันท้าย พายเรือ',
    'ออกญา ตาใส',
    'หลวงเก่ง เร่งรุด',
    'นายดี มีทรัพย์',
    'แม่ช้อย ปล่อยไก่',
    'หมื่นหาญ งานดี',
    'ขุนเดช เศษเหล็ก',
    'ทองเหม็น เน้นฮา',
  ]

  const candidatesData = []

  for (const district of electionDistricts) {
    // ให้แต่ละเขตมีผู้สมัคร 3 คน (เบอร์ 1, 2, 3)
    for (let i = 1; i <= 3; i++) {
      const party = parties[(district.id + i) % parties.length]
      // สุ่มชื่อ
      const nameIndex = (district.id * 3 + i) % fullNames.length

      candidatesData.push({
        number: i,
        fullName: fullNames[nameIndex],
        imageUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullNames[nameIndex]}`,
        partyId: party.id,
        districtId: district.id,
      })
    }
  }

  await prisma.candidate.createMany({
    data: candidatesData,
    skipDuplicates: true,
  })

  console.log(`Successfully seeded candidates!`)
}
