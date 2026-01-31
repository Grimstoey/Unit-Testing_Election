import prisma from "../lib/prisma";

export async function seedDistrictArea() {

    const districtsData: Record<string, string[]> = {
        "กรุงเทพมหานคร": [
            "พระนคร", "ดุสิต", "บางรัก", "ปทุมวัน", "ป้อมปราบศัตรูพ่าย", "พญาไท"
        ],
        "เชียงใหม่": [
            "เมืองเชียงใหม่", "แม่ริม", "หางดง", "สันทราย", "สันกำแพง", "แม่แตง"
        ],
        "ขอนแก่น": [
            "เมืองขอนแก่น", "ชุมแพ", "กระนวน", "บ้านไผ่", "น้ำพอง", "พล"
        ],
        "ชลบุรี": [
            "เมืองชลบุรี", "บางละมุง", "ศรีราชา", "สัตหีบ", "บ้านบึง", "พานทอง"
        ],
        "นครราชสีมา": [
            "เมืองนครราชสีมา", "ปากช่อง", "สีคิ้ว", "พิมาย", "ปักธงชัย", "ด่านขุนทด"
        ]
    };

    // ดึงจังหวัดทั้งหมดจาก DB
    const provinces = await prisma.province.findMany();

    for (const province of provinces) {
        const districtNames = districtsData[province.name];

        if (districtNames) {
            // เตรียมข้อมูล (Map เข้ากับ provinceId ของจังหวัดนั้นๆ)
            const dataToCreate = districtNames.map((name) => ({
                name: name,
                provinceId: province.id,
            }));

            // บันทึกลง Database
            await prisma.districtArea.createMany({
                data: dataToCreate,
                skipDuplicates: true,
            });
        }
    }

    console.log("Seeding districts completed!");
}