import {
  CreateCandidateDto,
  CreateCandidateWithAuditDto,
} from '@/models/candidate/createCandidateDto'
import { prisma } from '../lib/prisma'
import { UpdatedByCandidateDto } from '@/models/candidate/updateCandidateDto'

// สร้างผู้สมัคร
export async function createCandidateRepository(
  input: CreateCandidateWithAuditDto,
) {
  return await prisma.candidate.create({
    data: {
      citizenId: input.citizenId,
      number: input.number,
      firstName: input.firstName,
      lastName: input.lastName,
      candidatePolicy: input.candidatePolicy,
      imageUrl: input.imageUrl,
      partyId: input.partyId,
      constituencyId: input.constituencyId,
      createdBy: input.createdBy,
      updatedBy: input.updatedBy,
    },
  })
}

//อัพเดท
export async function updateCandidateRepository(
  id: number,
  input: UpdatedByCandidateDto,
) {
  return prisma.candidate.update({
    where: { id },
    data: input,
  })
}

// หา candidate ตามเลขบัตร
export async function findCandidateByCitizenIdRepository(citizenId: string) {
  return prisma.candidate.findUnique({
    where: {
      citizenId: citizenId,
    },
  })
}

//เรียก candidate ทั้งหมด
export async function findAllCandidatesRepository(
  where: any,
  skip: number,
  take: number,
  orderBy: any,
) {
  return prisma.candidate.findMany({
    // เงื่อนไขค้นหา
    where: where || {},
    skip: skip || 0,
    take: take || 10,
    orderBy: orderBy || { id: 'asc' },


        select: {
            id: true,
            citizenId: true,
            number: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            candidatePolicy: true,

            party: {
                select: {
                    id: true,
                    name: true,
                },
            },

            constituency: {
                select: {
                    id: true,
                    number: true,
                    provinceId: true,
                    province: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
          },
        },
      },
    },
  })
}


// นับจำนวนทั้งหมด
export async function countCandidatesRepository(where: any) {
  return prisma.candidate.count({
    where,
  })
}

// หา candidate จากหมายเลข + เลขเขต
export async function findCandidateByNumberAndConstituencyIdRepository(
  inputNumber: number,
  inputConstituencyId: number,
) {
  return prisma.candidate.findUnique({
    where: {
      number_constituencyId: {
        number: inputNumber,
        constituencyId: inputConstituencyId,
      },
    },
  })
}

// หา candidate จากพรรค + เลขเขต
export async function findCandidateByPartyAndConstituencyRepository(
  partyId: number,
  constituencyId: number,
) {
  return prisma.candidate.findUnique({
    where: {
      partyId_constituencyId: {
        partyId,
        constituencyId,
      },
    },
  })
}

//หาผู้สมัครจาก id
export async function findCandidateByIdRepository(id: number) {
  return prisma.candidate.findUnique({ where: { id } })
}

// นับในตารางโหวต
export async function countVotesByCandidateIdRepository(candidateId: number) {
  return prisma.vote.count({
    where: { candidateId },
  })
}

// ลบผู้สมัคร
export async function deleteCandidateRepository(id: number) {
  return prisma.candidate.delete({
    where: { id },
  })
}
