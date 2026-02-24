import { CreateCandidateDto } from "@/models/candidate/createCandidateDto";
import { prisma } from "../lib/prisma";


//สร้างผู้สมัครแบบ upsert
// upsert ใช้ได้เฉพาะ id หรือ unique constraint เท่านั้น
// where ใน upsert ต้องเป็น unique เท่านั้น
export async function upsertCandidateRepository(input: CreateCandidateDto) {
    return prisma.candidate.upsert({
        where: {
            number_constituencyId: {
                number: input.number,
                constituencyId: input.constituencyId,
            },
        },
        update: {
            firstName: input.firstName,
            lastName: input.lastName,
            candidatePolicy: input.candidatePolicy,
            imageUrl: input.imageUrl,
            partyId: input.partyId,
        },
        create: {
            number: input.number,
            firstName: input.firstName,
            lastName: input.lastName,
            candidatePolicy: input.candidatePolicy,
            imageUrl: input.imageUrl,
            partyId: input.partyId,
            constituencyId: input.constituencyId,
        },
    });
}


//เรียก candidate ทั้งหมด
export async function findAllCandidatesRepository(
    where: any,
    skip: number,
    take: number,
    orderBy: any
) {
    return prisma.candidate.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
            party: {
                select: { name: true },
            },
            constituency: {
                select: {
                    number: true,
                    province: {
                        select: { name: true },
                    },
                },
            },
        },
    });
}

// นับจำนวนทั้งหมด
export async function countCandidatesRepository(where: any) {
    return prisma.candidate.count({
        where,
    });
}




// หารายชื่อผู้สมัครจาก id ตาราง
export function findCandidateById(candidateId: number) {

    // include ใช้ได้เฉพาะ relation เท่านั้น
    // ถ้าจะเลือกเฉพาะ field ให้ใช้ select

    return prisma.candidate.findUnique(
        {
            where: { id: candidateId },
            select: {
                number: true,
                firstName: true,
                lastName: true,
                candidatePolicy: true,
                imageUrl: true,

                party: {
                    select: {
                        name: true,
                        logoUrl: true,
                    }
                },

                constituency: {
                    select: {
                        number: true,
                        province: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        }
    );
}