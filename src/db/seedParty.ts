import { prisma } from '../lib/prisma'

export async function seedParty() {
  await prisma.party.createMany({
    data: [
      {
        name: 'พรรคเที่ยงกินข้าว',
        logoUrl: 'https://example.com/stark.png',
        policy: 'นโยบายกินอิ่มก่อนคิดงาน เน้นปากท้องประชาชนเป็นอันดับแรก',
      },
      {
        name: 'พรรคนี้ไม่รีบนัดเก้ามาสิบ',
        logoUrl: 'https://example.com/lannister.png',
        policy: "นโยบายทำงานสายได้ แต่ขอผลงานดี ชีวิตต้องสมดุล' ",
      },
      {
        name: 'พรรคแป็บเดี๋ยวค่อยทำ',
        logoUrl: 'https://example.com/targaryen.png',
        policy:
          'นโยบายชิล ๆ ไม่เร่ง ไม่รีบ พัฒนาอย่างเป็นธรรมชาติ',
      },
      {
        name: 'พรรคนี้คิดดังไปหน่อย',
        logoUrl: 'https://example.com/tyrell.png',
        policy: 'นโยบายตรงไปตรงมา คิดดัง พูดแรง แต่จริงใจ',
      },
      {
        name: 'พรรคที่จะล้อม',
        logoUrl: 'https://example.com/greyjoy.png',
        policy: 'นโยบายไถนาให้สุดแปลง กองทุนแอลกอฮอล์และอาหารหมา มุ่งเน้นการเชื่อเพื่อน มากกว่าหมอดู',
      },
    ],
    skipDuplicates: true,
  })
}
