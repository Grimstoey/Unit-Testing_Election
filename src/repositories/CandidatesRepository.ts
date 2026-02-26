import { CreateCandidateDto } from "@/models/candidate/createCandidateDto";
import { prisma } from "../lib/prisma";
import { UpdateCandidateDto } from "@/models/candidate/updateCandidateDto";

// สร้างผู้สมัคร
export async function createCandidateRepository(input: CreateCandidateDto) {
    return await prisma.candidate.create(
        {
            data: {
                number: input.number,
                firstName: input.firstName,
                lastName: input.lastName,
                candidatePolicy: input.candidatePolicy,
                imageUrl: input.imageUrl,
                partyId: input.partyId,
                constituencyId: input.constituencyId
            }
        }
    );
}

//อัพเดท
export async function updateCandidateRepository(id: number, input: UpdateCandidateDto) {
    return prisma.candidate.update(
        {
            where: { id },
            data: input
        }
    );
}


//เรียก candidate ทั้งหมด
export async function findAllCandidatesRepository(
    where: any,
    skip: number,
    take: number,
    orderBy: any
) {
    return prisma.candidate.findMany({

        // เงื่อนไขค้นหา
        where: where || {},
        skip: skip || 0,
        take: take || 10,
        orderBy: orderBy || { id: "asc" },

        // ดึงข้อมูล relation
        include: {
            party: {
                select: {
                    name: true,
                },
            },
            constituency: {
                select: {
                    number: true,
                    province: {
                        select: {
                            name: true,
                        },
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



// หา candidate จากหมายเลข + เลขเขต
export async function findCandidateByNumberAndConstituencyId(input: CreateCandidateDto) {
    return prisma.candidate.findFirst(
        {
            where: {
                number: input.number,
                constituencyId: input.constituencyId
            }
        }
    )
}

//หาผู้สมัครจาก id
export async function findCandidateById(id: number) {
    return prisma.candidate.findUnique({ where: { id } });
}

// นับในตารางโหวต
export async function countVotesByCandidateId(candidateId: number) {
    return prisma.vote.count({
        where: { candidateId },
    });
}

// ลบผู้สมัคร
export async function deleteCandidateRepository(id: number) {
    return prisma.candidate.delete({
        where: { id },
    });
}

