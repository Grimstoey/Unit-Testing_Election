import { prisma } from "../lib/prisma"

const CANDIDATES_PER_CONSTITUENCY = 3
const LIMIT_CANDIDATES = 20 // กำหนดจำนวนที่ต้องการที่นี่

const FIRST_NAMES = [
  "อาร์เธอร์", "อลิซาเบธ", "วิลเลียม", "ฟลอเรนซ์", "เอ็ดเวิร์ด",
  "วิกตอเรีย", "อัลเบิร์ต", "แคทเธอรีน", "มากาเร็ต", "เบียทริซ",
  "จอร์จ", "ชาร์ลอตต์", "เฮนรี่", "อเล็กซานดรา", "ฟิลิป",
  "อัลโตนิโอ", "โดโรธี", "เอ็ดมันด์", "กาลิเลโอ", "เควิน",
  "ฮันนาห์", "เอมิลี่", "โซเฟีย", "อิซาเบลลา", "ชาร์ลีน",
  "ลูคัส", "โอลิเวอร์", "เซบาสเตียน", "แดเนียล", "แมทธิว",
  "เบนจามิน", "ไมเคิล", "เดวิด", "โจเซฟ", "แอนดรูว์",
]

const LAST_NAMES = [
  "ศรีสุข", "แซ่ตั้ง", "วงศ์คำปัน", "แสงหล้า", "แซ่ลี้",
  "คำมูล", "อินต๊ะคำ", "แซ่โค้ว", "เมืองมา", "แซ่จง",
  "แก้วคำ", "แซ่แต้", "หมื่นศรี", "ก้อนแก้ว", "แซ่เฮ้ง",
  "ใจมา", "แก้วอินทร์", "แซ่โซว", "แก้วมาลัย", "หยาง",
  "คำปวง", "วงศ์แก้ว", "อินทร์คำ", "จันทร์ตา", "แสงคำ",
  "ใจวงศ์", "แก้วปัน", "คำลือ", "ศรีวงศ์", "บุญเรือง",
  "แซ่อึ้ง", "แซ่ฮั่น", "แซ่เล้า", "แซ่เฮง", "แซ่กัง",
]

const PARTY_POLICIES: Record<number, string[]> = {
  1: ["แจกข้าวเหนียวมะม่วงตอนเที่ยงคืน", "บุฟเฟต์ส้มตำปูปลาร้าเยียวยาทุกสิ่ง", "นโยบายอิ่มก่อนคิดงาน", "จัดตั้ง ศาลาพักพุง ให้สมาชิกได้เอนหลังป้องกันกรดไหลย้อน"],
  2: ["การตรงต่อเวลาคือภาระ การเลทคือศิลปะการใช้ชีวิต", "เลทได้ 45 นาทีถือว่ามาตรงเวลา", "ชีวิตต้องสโลว์ไลฟ์แต่ใจสู้", "สิบโมงคือเช้า"],
  3: ["เดดไลน์มีไว้ให้ขยับ", "งานจะไม่มีวันเลท ถ้าเรากล้าปฏิเสธวันส่ง", "ส่งทันถ้าเลื่อนเดดไลน์", "ห้ามประชุมเกิน 15 นาที ถ้าเกิน ให้แยกย้ายไปนอนคิดใหม่"],
  4: ["คิดดังพูดแรงแต่จริงใจ", "ติดตั้งลำโพงระบายความในใจทุกแยกไฟแดง", "บังคับให้หัวหน้างานต้องฟังลูกน้องบ่นโดยห้ามโต้ตอบ", "กองทุนจ้างทนาย สำหรับสมาชิกที่พูดตรงจนติดคุก หรือโดนฟ้องหมิ่นประมาท"],
  5: ["ส่วนลดเครื่องดื่มมีฟองสำหรับเกษตรกรหลังเลิกไถนา", "ผลักดันไถนาคนละครึ่ง", "30 บาท ดูดวงได้ทุกหมอ", "คอสตูมเจ้าตูบไม่ซ้ำสายพันธุ์ เมื่อเพื่อนของคุณมูฟออนเป็นวงกลม"],
}

// ================= Utils =================
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUniqueFullName(usedNames: Set<string>): { firstName: string, lastName: string } {
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

// ================= Seed =================
export async function seedCandidate() {
  console.log("Cleaning old candidate and vote data...")

  // ลบข้อมูลเก่าที่มีความสัมพันธ์กัน
  await prisma.vote.deleteMany({})
  await prisma.candidate.deleteMany({})

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

  const usedNamesByProvince = new Map<number, Set<string>>()
  const candidatesData: any[] = []

  let partyCursor = 0
  let totalSeeded = 0 // ตัวนับจำนวน Candidate ที่สร้างจริง

  for (const constituency of constituencies) {
    // ถ้าครบ 20 คนแล้วให้หยุด Loop ทันที
    if (totalSeeded >= LIMIT_CANDIDATES) break;

    const provinceId = constituency.provinceId
    if (!usedNamesByProvince.has(provinceId)) {
      usedNamesByProvince.set(provinceId, new Set())
    }

    const usedNames = usedNamesByProvince.get(provinceId)!

    for (let i = 1; i <= CANDIDATES_PER_CONSTITUENCY; i++) {
      // ตรวจสอบเงื่อนไขอีกครั้งใน Loop ย่อย
      if (totalSeeded >= LIMIT_CANDIDATES) break;

      const { firstName, lastName } = generateUniqueFullName(usedNames)
      const party = parties[partyCursor % parties.length]

      const specificPolicy = PARTY_POLICIES[party.id]
        ? randomItem(PARTY_POLICIES[party.id])
        : "ยังคิดไม่ออก"

      candidatesData.push({
        number: i,
        firstName,
        lastName,
        candidatePolicy: specificPolicy,
        imageUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
          firstName + i
        )}`,
        partyId: party.id,
        constituencyId: constituency.id,
      })

      partyCursor++
      totalSeeded++ // เพิ่มจำนวนเมื่อสร้างเสร็จ 1 คน
    }
  }

  // บันทึกลง Database
  await prisma.candidate.createMany({
    data: candidatesData,
    skipDuplicates: true,
  })

  console.log(`--->>> Seeded ${candidatesData.length} candidates completed!`)
}