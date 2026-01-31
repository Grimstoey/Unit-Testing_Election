import prisma from "../lib/prisma";
import { DistrictArea, Prisma } from "@prisma/client"; // เพิ่ม DistrictArea เข้ามา

export async function seedDistrictAreaMapping() {
    const provinces = await prisma.province.findMany({
        include: {
            DistrictArea: true,
            ElectionDistrict: true,
        },
    });

    const mappingData: Prisma.DistrictAreaOnElectionDistrictCreateManyInput[] = [];

    for (const province of provinces) {
        const areas = province.DistrictArea;
        const electionDistricts = province.ElectionDistrict;

        if (areas.length === 0 || electionDistricts.length === 0) continue;

        areas.forEach((area: DistrictArea, index: number) => {
            const districtIndex = index % electionDistricts.length;
            const targetElectionDistrict = electionDistricts[districtIndex];

            mappingData.push({
                districtAreaId: area.id,
                electionDistrictId: targetElectionDistrict.id,
            });
        });
    }

    if (mappingData.length > 0) {
        await prisma.districtAreaOnElectionDistrict.createMany({
            data: mappingData,
            skipDuplicates: true,
        });
    }
}