import { Prisma } from "../generated/prisma";
import { prisma } from "../lib/prisma";

/*
 * โครงสร้าง mapping:
 * provinceName
 *   └─ constituencyNumber
 *        └─ districtNames[]
 */

const DISTRICT_IN_CONSTITUENCY_MAP: Record<string, Record<number, string[]>> = {
  // ================= กรุงเทพมหานคร =================
  กรุงเทพมหานคร: {
    1: ["พระนคร", "ดุสิต"],
    2: ["ปทุมวัน", "บางรัก"],
    3: ["ยานนาวา", "สาทร"],
    4: ["บางคอแหลม", "คลองเตย"],
    5: ["ดินแดง", "ห้วยขวาง"],
    6: ["ลาดพร้าว", "วังทองหลาง"],
    7: ["บางกะปิ", "สะพานสูง"],
    8: ["บางนา", "พระโขนง"],
  },

  // ================= เชียงใหม่ =================
  เชียงใหม่: {
    1: ["เมืองเชียงใหม่", "แม่ริม"],
    2: ["สันทราย", "ดอยสะเก็ด"],
    3: ["หางดง", "สันป่าตอง"],
    4: ["ฝาง", "แม่อาย"],
  },

  // ================= นครราชสีมา =================
  นครราชสีมา: {
    1: ["เมืองนครราชสีมา", "โชคชัย"],
    2: ["ปากช่อง", "สีคิ้ว"],
    3: ["พิมาย", "ชุมพวง"],
    4: ["บัวใหญ่", "โนนสูง"],
  },

  // ================= ขอนแก่น =================
  ขอนแก่น: {
    1: ["เมืองขอนแก่น", "บ้านฝาง"],
    2: ["น้ำพอง", "อุบลรัตน์"],
    3: ["ชนบท", "แวงใหญ่"],
  },

  // ================= ชลบุรี =================
  ชลบุรี: {
    1: ["เมืองชลบุรี", "บ้านบึง"],
    2: ["ศรีราชา", "บางละมุง"],
    3: ["พนัสนิคม", "หนองใหญ่"],
  },

  // ================= สงขลา =================
  สงขลา: {
    1: ["เมืองสงขลา", "สทิงพระ"],
    2: ["หาดใหญ่", "คลองหอยโข่ง"],
    3: ["จะนะ", "เทพา"],
  },

  // ================= อุบลราชธานี =================
  อุบลราชธานี: {
    1: ["เมืองอุบลราชธานี", "วารินชำราบ"],
    2: ["เดชอุดม", "นาเยีย"],
    3: ["พิบูลมังสาหาร", "ตระการพืชผล"],
  },
};

export async function seedDistrictInConstituency() {
  const data: Prisma.districtInConstituencyCreateManyInput[] = [];

  for (const [provinceName, constituencies] of Object.entries(
    DISTRICT_IN_CONSTITUENCY_MAP,
  )) {
    const province = await prisma.province.findUnique({
      where: { name: provinceName },
      include: {
        districts: true,
        constituencies: true,
      },
    });

    if (!province) {
      console.warn(`⚠️ Province not found: ${provinceName}`);
      continue;
    }

    for (const [constituencyNumber, districtNames] of Object.entries(
      constituencies,
    )) {
      const constituency = province.constituencies.find(
        (c: { number: number }) => c.number === Number(constituencyNumber),
      );

      if (!constituency) {
        console.warn(
          `⚠️ Constituency ${constituencyNumber} not found in ${provinceName}`,
        );
        continue;
      }

      for (const districtName of districtNames) {
        const district = province.districts.find(
          (d: { name: string }) => d.name === districtName,
        );

        if (!district) {
          console.warn(
            `⚠️ District not found: ${districtName} (${provinceName})`,
          );
          continue;
        }

        data.push({
          districtId: district.id,
          constituencyId: constituency.id,
        });
      }
    }
  }

  if (data.length > 0) {
    await prisma.districtInConstituency.createMany({
      data,
      skipDuplicates: true,
    });
  }

  console.log(`--->>> Seeded districtInConstituency completed!`);
}
