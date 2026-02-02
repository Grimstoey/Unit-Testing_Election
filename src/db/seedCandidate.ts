import { prisma } from "../lib/prisma"

const CANDIDATES_PER_CONSTITUENCY = 3

const FIRST_NAMES = [
  "ขุนศึก",
  "หมื่นหาญ",
  "หลวงเดชา",
  "ออกญาอินทร์",
  "พระยาเพชร",
  "ทิดมั่น",
  "พ่อทอง",
  "แม่ช้อย",
  "แม่หญิงพิม",
  "ท่านขวัญ",
  "ขุนเดช",
  "หมื่นไวย",
  "หลวงเก่ง",
  "ออกศึก",
  "ท้าวคำรณ",
  "พ่อเพิ่ม",
  "แม่แสง",
  "พ่อจัน",
  "แม่บัว",
]

const LAST_NAMES = [
  "ใจกล้า",
  "มือไว",
  "พูดตรง",
  "มั่นคง",
  "ยิ้มง่าย",
  "ใจถึง",
  "สายลุย",
  "ไม่ยอมแพ้",
  "หนักแน่น",
  "กินขาด",
  "บ้านเรา",
  "รักถิ่น",
  "เที่ยงธรรม",
  "นำชัย",
  "ขยันจริง",
  "ไม่ท้อ",
  "ยืนหนึ่ง",
]

// ================= Utils =================
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUniqueFullName(usedNames: Set<string>): string {
  let fullName = ""

  do {
    const firstName = randomItem(FIRST_NAMES)
    const lastName = randomItem(LAST_NAMES)
    fullName = `${firstName} ${lastName}`
  } while (usedNames.has(fullName))

  usedNames.add(fullName)
  return fullName
}

// ================= Seed =================
export async function seedCandidate() {
  const parties = await prisma.party.findMany({
    orderBy: { id: "asc" },
  })

  const constituencies = await prisma.constituency.findMany({
    include: { province: true },
    orderBy: [{ provinceId: "asc" }, { number: "asc" }],
  })

  if (parties.length === 0 || constituencies.length === 0) {
    throw new Error("Missing Party or Constituency data")
  }

  // กันชื่อซ้ำ แยกตามจังหวัด
  const usedNamesByProvince = new Map<number, Set<string>>()

  const candidatesData: {
    number: number
    fullName: string
    imageUrl: string
    partyId: number
    constituencyId: number
  }[] = []

  let partyCursor = 0

  for (const constituency of constituencies) {
    const provinceId = constituency.provinceId

    if (!usedNamesByProvince.has(provinceId)) {
      usedNamesByProvince.set(provinceId, new Set())
    }

    const usedNames = usedNamesByProvince.get(provinceId)!

    for (let i = 1; i <= CANDIDATES_PER_CONSTITUENCY; i++) {
      const fullName = generateUniqueFullName(usedNames)
      const party = parties[partyCursor % parties.length]

      candidatesData.push({
        number: i,
        fullName,
        imageUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
          fullName
        )}`,
        partyId: party.id,
        constituencyId: constituency.id,
      })

      partyCursor++
    }
  }

  await prisma.candidate.createMany({
    data: candidatesData,
    skipDuplicates: true,
  })

  console.log("--->>> Seeded candidates completed!")
}
