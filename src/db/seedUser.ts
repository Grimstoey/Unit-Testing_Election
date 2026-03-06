import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

const LANNA_FIRST_NAMES = [
  'คำแก้ว',
  'ฟองจันทร์',
  'เอื้องคำ',
  'แว่นแก้ว',
  'เหมยขาบ',
  'กาสะลอง',
  'สะบันงา',
  'เอื้องผึ้ง',
  'จันทร์ผา',
  'บัวระวง',
  'รอมแพง',
  'คำปู้จู้',
  'เวียงพิงค์',
  'เกตถวา',
  'อินทร์ถา',
  'คำใส',
  'จั๋นแสง',
  'สิงห์คำ',
  'เมืองคำ',
  'กาวิล',
  'อ้ายคำ',
  'ฟ้าฮ่าม',
  'ยอดผา',
  'เชียงดาว',
  'บัวตอง',
  'มังคละ',
  'ธรรมลังกา',
  'สลุงเงิน',
  'เวียงไชย',
  'ก๋องคำ',
  'เมืองราม',
  'แก้วมา',
  'พิงค์ลานนา',
  'อินทร์แปง',
  'คำแพง',
  'คำเอื้อย',
  'อินทร์เฟือน',
  'ปันพร',
  'เชียงราย',
  'เชียงใหม่',
  'แสงหล้า',
  'สลุงคำ',
  'แป้งจี่',
  'คำศรี',
  'ชมพอ',
  'สารภี',
  'คำป้อ',
  'คำปัน',
  'ขวัญระมิงค์',
  'อองตอง',
  'เครือออน',
  'บัวเขียว',
  'บัวผัด',
  'ชมออน',
  'บัวสาย',
  'บัวบาน',
  'บัวแก้ว',
  'กาแล',
  'อินเหลา',
  'เก็ตถวา',
  'แขกแก้ว',
  'ข้าวนึ่ง',
  'กำปอ',
  'พอวา',
  'น้ำใจ๋',
  'ป๋ายฟ้า',
  'น้ำต้น',
  'ฮอม',
  'คำมา',
  'คำหล้า',
  'คำสาย',
  'เมือง',
  'มููล',
  'ก๊อ',
  'เชียงตุง',
  'ข้าวซอย',
  'ฮังเล',
  'เวียงแก้ว',
  'เวียงหลวง',
  'หน่อเมือง',
]

const WESTERN_LAST_NAMES = [
  'สมิธ',
  'จอห์นสัน',
  'วิลเลียมส์',
  'บราวน์',
  'โจนส์',
  'มิลเลอร์',
  'เดวิส',
  'วิลสัน',
  'มัวร์',
  'เทเลอร์',
  'แอนเดอร์สัน',
  'โทมัส',
  'แจ็คสัน',
  'ไวท์',
  'แฮร์ริส',
  'มาร์ติน',
  'ทอมป์สัน',
  'การ์เซีย',
  'มาร์ติเนซ',
  'โรบินสัน',
  'คลาร์ก',
  'โรดริเกซ',
  'ลูอิส',
  'ลี',
  'วอล์คเกอร์',
  'ฮอลล์',
  'อัลเลน',
  'ยัง',
  'เฮอร์นานเดซ',
  'คิง',
  'ไรท์',
  'โลเปซ',
  'ฮิลล์',
  'สกอตต์',
  'กรีน',
  'เบเกอร์',
  'กอนซาเลซ',
  'เนลสัน',
  'คาร์เตอร์',
  'มิตเชลล์',
  'เปเรซ',
  'โรเบิร์ตส์',
  'เทอร์เนอร์',
  'ฟิลลิปส์',
  'แคมป์เบลล์',
  'ปาร์กเกอร์',
  'อีแวนส์',
  'เอ็ดเวิร์ดส์',
  'คอลลินส์',
  'สจ๊วต',
  'ซานเชซ',
  'มอร์ริส',
  'โรเจอร์ส',
  'รีด',
  'คุก',
  'มอร์แกน',
  'เบลล์',
  'เมอร์ฟีย์',
  'เบลีย์',
  'ริเวร่า',
  'คูเปอร์',
  'ริชาร์ดสัน',
  'ค็อกซ์',
  'โฮเวิร์ด',
  'วอร์ด',
  'ทอร์เรส',
  'ปีเตอร์สัน',
  'เกรย์',
  'รามิเรซ',
  'เจมส์',
  'วัตสัน',
  'บรูคส์',
  'เคลลี่',
  'แซนเดอร์ส',
  'ไพรซ์',
  'เบนเน็ตต์',
  'วูด',
  'บาร์นส์',
  'รอสส์',
  'เฮนเดอร์สัน',
  'โคลแมน',
  'เจนกินส์',
  'เพอร์รี่',
  'พาวเวลล์',
  'ลอง',
  'แพตเตอร์สัน',
  'ฮิวจ์ส',
  'ฟลอเรส',
  'วอชิงตัน',
  'บัตเลอร์',
  'ซิมมอนส์',
  'ฟอสเตอร์',
  'กอนซาเลซ',
  'ไบรอันท์',
  'อเล็กซานเดอร์',
  'รัสเซล',
  'กริฟฟิน',
  'ดิแอซ',
  'เฮส์',
  'ไมเยอร์ส',
  'ฟอร์ด',
  'แฮมิลตัน',
  'เกรแฮม',
  'ซัลลิแวน',
  'วอลเลซ',
  'วูดส์',
  'โคล',
  'เวสต์',
  'จอร์แดน',
  'โอเวนส์',
  'เรย์โนลด์ส',
  'ฟิชเชอร์',
  'เอลลิส',
  'แฮร์ริสัน',
  'กิ๊บสัน',
  'แมคโดนัลด์',
  'ครูซ',
  'มาร์แชลล์',
  'ออร์ติซ',
  'แกรนท์',
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function seedUser() {
  console.log('👥 Seeding mock users...')

  // 0. Cleanup existing mock users (citizenId starts with '9')
  console.log('🧹 Cleaning up existing mock data...')
  const mockUsers = await prisma.user.findMany({
    where: { citizenId: { startsWith: '9' } },
    select: { id: true },
  })
  const mockUserIds = mockUsers.map((u) => u.id)

  if (mockUserIds.length > 0) {
    await prisma.vote.deleteMany({ where: { userId: { in: mockUserIds } } })
    await prisma.userRole.deleteMany({ where: { userId: { in: mockUserIds } } })
    await prisma.user.deleteMany({ where: { id: { in: mockUserIds } } })
    console.log(
      `--->>> Cleaned up ${mockUserIds.length} mock users and related data`,
    )
  }

  // 1. Fetch available districts with their provinceId
  const districts = await prisma.district.findMany({
    select: {
      id: true,
      provinceId: true,
    },
  })

  if (districts.length === 0) {
    console.warn('⚠️ No districts found. Skipping user seeding.')
    return
  }

  // 2. Prepare common data
  const passwordHash = await bcrypt.hash('123456', 10)
  const USER_COUNT = 500
  const usersData = []

  // Get current max index to avoid citizenId collision if run multiple times
  const lastUser = await prisma.user.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  })
  let startId = (lastUser?.id || 0) + 1

  for (let i = 0; i < USER_COUNT; i++) {
    const randomDistrict =
      districts[Math.floor(Math.random() * districts.length)]
    const currentId = startId + i

    usersData.push({
      citizenId: `9${currentId.toString().padStart(12, '0')}`, // Mock citizen ID starting with 9
      password: passwordHash,
      firstName: randomItem(LANNA_FIRST_NAMES),
      lastName: randomItem(WESTERN_LAST_NAMES),
      address: `Address for mock user ${currentId}`,
      provinceId: randomDistrict.provinceId,
      districtId: randomDistrict.id,
    })
  }

  // 3. Insert users
  const result = await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true,
  })

  console.log(`--->>> Seed completed: inserted ${result.count} mock users`)

  // 4. Assign ROLE_VOTER to new users
  const voterRole = await prisma.role.findUnique({
    where: { name: 'ROLE_VOTER' },
  })
  if (voterRole) {
    const newlyCreatedUsers = await prisma.user.findMany({
      where: { citizenId: { startsWith: '9' } },
      select: { id: true },
    })

    const userRoleData = newlyCreatedUsers.map((user) => ({
      userId: user.id,
      roleId: voterRole.id,
    }))

    await prisma.userRole.createMany({
      data: userRoleData,
      skipDuplicates: true,
    })
    console.log(`--->>> Assigned ROLE_VOTER to ${userRoleData.length} users`)
  }
}
