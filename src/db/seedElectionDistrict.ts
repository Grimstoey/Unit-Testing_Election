import prisma from "../lib/prisma";

export async function seedElectionDistrict() {
    // ดึงจังหวัดทั้งหมดที่มีในระบบมา
    const provinces = await prisma.province.findMany();

    if (provinces.length === 0) {
        throw new Error("No provinces found. Please seed provinces first.");
    }

    // เตรียม Array สำหรับเก็บข้อมูลที่จะสร้าง
    const electionDistrictsToCreate = [];

    for (const province of provinces) {
        // กำหนดให้แต่ละจังหวัดมี 3 เขตเลือกตั้ง (เลข 1, 2, 3)
        // สามารถเปลี่ยนเลข 3 เป็นจำนวนอื่นที่ต้องการได้
        const numberOfDistricts = 3;

        for (let i = 1; i <= numberOfDistricts; i++) {
            electionDistrictsToCreate.push({
                number: i,
                provinceId: province.id,
            });
        }
    }

    // บันทึกลง Database ทีเดียวเพื่อความรวดเร็ว
    await prisma.electionDistrict.createMany({
        data: electionDistrictsToCreate,
        skipDuplicates: true,
    });

    console.log(`Seeded election districts!.`);
}