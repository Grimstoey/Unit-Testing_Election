import { Prisma } from "@/generated/prisma/client"
import { prisma } from "../lib/prisma"

const CANDIDATES_PER_CONSTITUENCY = 3
const LIMIT_CANDIDATES = 20

const FIRST_NAMES = [
  "เลวานดอฟสกี้", "อลิซาเบธ", "วิลเลียม", "ฟลอเรนซ์", "เอ็ดเวิร์ด",
  "วิกตอเรีย", "อัลเบิร์ต", "แคทเธอรีน", "มากาเร็ต", "เบียทริซ",
  "จอร์จ", "ชาร์ลอตต์", "เฮนรี่", "อเล็กซานดรา", "ฟิลิป",
  "อัลโตนิโอ", "โดโรธี", "เอ็ดมันด์", "กาลิเลโอ", "เควิน",
  "ฮันนาห์", "เอมิลี่", "โซเฟีย", "อิซาเบลลา", "ชาร์ลีน",
  "ลูคัส", "โอลิเวอร์", "เซบาสเตียน", "แดเนียล", "แมทธิว",
  "เบนจามิน", "ไมเคิล", "เดวิด", "โจเซฟ", "แอนดรูว์",
  "ลิโอเนล", "คริสเตียโน่", "โรเบิร์ต", "เออร์ลิ่ง", "ไรอัน",
  "โมฮาเหม็ด", "เนย์มาร์", "จู๊ด", "เออร์ลิ่ง", "เมสซี่",
  "โรนัลโด้", "เอ็มบัปเป้", "ฮาลันด์", "ซาลาห์", "เบลลิงแฮม",
]

const LAST_NAMES = [
  "ศรีสุข", "แซ่ตั้ง", "วงศ์คำปัน", "แสงหล้า", "แซ่ลี้",
  "คำมูล", "อินต๊ะคำ", "แซ่โค้ว", "เมืองมา", "แซ่จง",
  "แก้วคำ", "แซ่แต้", "หมื่นศรี", "ก้อนแก้ว", "แซ่เฮ้ง",
  "ใจมา", "แก้วอินทร์", "แซ่โซว", "แก้วมาลัย", "หยาง",
  "คำปวง", "วงศ์แก้ว", "อินทร์คำ", "จันทร์ตา", "แสงคำ",
  "ใจวงศ์", "แก้วปัน", "คำลือ", "ศรีวงศ์", "บุญเรือง",
  "แซ่อึ้ง", "แซ่ฮั่น", "แซ่เล้า", "แซ่เฮง", "แซ่กัง",
  "หน่อคำ", "บุญทา", "คำแปง", "ปินตา", "ตาคำ",
  "บุญยืน", "นันตา", "บุญมา", "แก้วพรม", "จันต๊ะ"
]

const PARTY_POLICIES: Record<number, string[]> = {
  1: ["เที่ยงปุ๊บ ลุกปั๊ป", "พักเที่ยง เลี่ยงงาน", "นโยบายอิ่มก่อนคิดงาน", "เที่ยงกินข้าว ยาวถึงบ่าย 2", "เงินสนับสนุนสิ้นเดือน อิ่มก่อนฝ่อนทีหลัง"],
  2: ["การตรงต่อเวลาคือภาระ การเลทคือศิลปะการใช้ชีวิต", "เลทได้ 45 นาทีถือว่ามาตรงเวลา", "ชีวิตต้องสโลว์ไลฟ์แต่ใจสู้", "สิบโมงคือเช้า",],
  3: ["เดดไลน์มีไว้ให้ขยับ", "งานจะไม่มีวันเลท ถ้าเรากล้าปฏิเสธวันส่ง", "ส่งทันถ้าเลื่อนเดดไลน์", "ห้ามประชุมเกิน 15 นาที ถ้าเกิน ให้แยกย้ายไปนอนคิดใหม่"],
  4: ["คิดดังพูดแรงแต่จริงใจ", "ติดตั้งลำโพงระบายความในใจทุกแยกไฟแดง", "บังคับให้หัวหน้างานต้องฟังลูกน้องบ่นโดยห้ามโต้ตอบ", "กองทุนจ้างทนาย สำหรับสมาชิกที่พูดตรงจนติดคุก หรือโดนฟ้องหมิ่นประมาท"],
  5: ["ส่วนลดเครื่องดื่มมีฟองสำหรับเกษตรกรหลังเลิกไถนา", "ผลักดันไถนาคนละครึ่ง", "30 บาท ดูดวงได้ทุกหมอ", "คอสตูมเจ้าตูบไม่ซ้ำสายพันธุ์ เมื่อเพื่อนของคุณมูฟออนเป็นวงกลม", "ขยายเวลาเคอร์ฟิว บอกกลับ 2 ลุกจริง 4 ทุ่ม"],
}

// ================= Utils =================

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUniqueFullName(
  usedNames: Set<string>
): { firstName: string; lastName: string } {
  let firstName = ""
  let lastName = ""
  let fullName = ""

  do {
    firstName = randomItem(FIRST_NAMES)
    lastName = randomItem(LAST_NAMES)
    fullName = `${firstName} ${lastName}`
  } while (usedNames.has(fullName))

  usedNames.add(fullName)
  return { firstName, lastName }
}

function generateCitizenId(index: number): string {
  return (1000000000000 + index).toString()
}

// ================= Seed =================

export async function seedCandidate() {
  console.log("🧹 Cleaning old candidate and vote data...")

  await prisma.$transaction([
    prisma.vote.deleteMany({}),
    prisma.candidate.deleteMany({}),
  ])

  const parties = await prisma.party.findMany({
    orderBy: { id: "asc" },
  })

  const provinces = await prisma.province.findMany({
    include: {
      constituencies: {
        orderBy: { number: "asc" },
      },
    },
    orderBy: { id: "asc" },
  })

  if (!parties.length || !provinces.length) {
    throw new Error("❌ Missing Party or Province data")
  }

  const usedNamesByProvince = new Map<number, Set<string>>()
  const candidatesData: Prisma.candidateCreateManyInput[] = []

  let citizenCounter = 1

  for (const province of provinces) {

    console.log(`📍 Seeding Province ${province.id}`)

    if (!usedNamesByProvince.has(province.id)) {
      usedNamesByProvince.set(province.id, new Set())
    }

    const usedNames = usedNamesByProvince.get(province.id)!

    for (const constituency of province.constituencies) {

      const usedPartyIds = new Set<number>()

      const maxLoop = Math.min(
        CANDIDATES_PER_CONSTITUENCY,
        parties.length
      )

      for (let i = 1; i <= maxLoop; i++) {

        const availableParties = parties.filter(
          (p) => !usedPartyIds.has(p.id)
        )

        if (!availableParties.length) break

        const party = randomItem(availableParties)
        usedPartyIds.add(party.id)

        const { firstName, lastName } =
          generateUniqueFullName(usedNames)

        const specificPolicy = PARTY_POLICIES[party.id]
          ? randomItem(PARTY_POLICIES[party.id])
          : "ยังคิดไม่ออก"

        candidatesData.push({
          citizenId: generateCitizenId(citizenCounter++),
          number: i,
          firstName,
          lastName,
          candidatePolicy: specificPolicy,
          imageUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
            firstName + i
          )}`,
          partyId: party.id,
          constituencyId: constituency.id,
          createdBy: 0,
          updatedBy: 0,
        })
      }
    }
  }

  const result = await prisma.candidate.createMany({
    data: candidatesData,
    skipDuplicates: true,
  })

  console.log(
    `--->>> Seed completed: inserted ${result.count} candidates`
  )
}