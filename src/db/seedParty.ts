import { prisma } from '../lib/prisma'

export async function seedParty() {
  await prisma.party.createMany({
    data: [
      {
        name: 'พรรคสตาร์ค',
        logoUrl: 'https://example.com/stark.png',
        policy: 'นโยบายเตรียมความพร้อมรับมือภัยหนาว และขยายกำแพงกั้นเขต',
      },
      {
        name: 'พรรคแลนนิสเตอร์',
        logoUrl: 'https://example.com/lannister.png',
        policy: "เน้นเศรษฐกิจและการเงิน 'พรรคเราจ่ายหนี้คืนเสมอ' ",
      },
      {
        name: 'พรรคทาร์แกเรียน',
        logoUrl: 'https://example.com/targaryen.png',
        policy:
          'นโยบายพลังงานสะอาดจากลมหายใจมังกร และการปฏิรูปการปกครองแบบเบ็ดเสร็จ',
      },
      {
        name: 'พรรคไทเรล',
        logoUrl: 'https://example.com/tyrell.png',
        policy: 'นโยบายเกษตรกรรมและอาหาร แจกผลผลิตจากสวนดอกไม้ให้ประชาชน',
      },
      {
        name: 'พรรคเกรย์จอย',
        logoUrl: 'https://example.com/greyjoy.png',
        policy: 'นโยบายพาณิชย์นาวีและการประมง เน้นการนำเข้า',
      },
    ],
    skipDuplicates: true,
  })
}
