import { prisma } from "../lib/prisma";

export async function seedParty() {
  await prisma.party.createMany({
    data: [
      {
        name: "พรรคเที่ยงกินข้าว",
        logoUrl:
          "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=พรรคเที่ยงกินข้าว",
        policy: "นโยบายกินอิ่มก่อนคิดงาน เน้นปากท้องประชาชนเป็นอันดับแรก",
      },
      {
        name: "พรรคนี้ไม่รีบนัดเก้ามาสิบ",
        logoUrl:
          "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=พรรคนี้ไม่รีบนัดเก้ามาสิบ",
        policy: "นโยบายทำงานสายได้ แต่ขอผลงานดี ชีวิตต้องสมดุล' ",
      },
      {
        name: "พรรคแป็บเดี๋ยวค่อยทำ",
        logoUrl:
          "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=พรรคแป็บเดี๋ยวค่อยทำ",
        policy: "นโยบายชิล ๆ ไม่เร่ง ไม่รีบ พัฒนาอย่างเป็นธรรมชาติ",
      },
      {
        name: "พรรคนี้คิดดังไปหน่อย",
        logoUrl:
          "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=พรรคนี้คิดดังไปหน่อย",
        policy: "นโยบายตรงไปตรงมา คิดดัง พูดแรง แต่จริงใจ",
      },
      {
        name: "พรรคที่จะล้อม",
        logoUrl:
          "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=พรรคที่จะล้อม",
        policy:
          "นโยบายไถนาให้สุดแปลง กองทุนแอลกอฮอล์และอาหารหมา มุ่งเน้นการเชื่อเพื่อน มากกว่าหมอดู",
      },
    ],
    skipDuplicates: true,
  });
}
