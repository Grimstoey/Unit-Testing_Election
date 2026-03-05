import {
  CreateCandidateDto,
  CreateCandidateWithAuditDto,
} from '@/models/candidate/createCandidateDto'
import {
  createCandidateRepository,
  findAllCandidatesRepository,
  countCandidatesRepository,
  findCandidateByNumberAndConstituencyIdRepository,
  findCandidateByIdRepository,
  updateCandidateRepository,
  countVotesByCandidateIdRepository,
  deleteCandidateRepository,
  findCandidateByCitizenIdRepository,
  findCandidateByPartyAndConstituencyRepository,
} from '../repositories/CandidatesRepository'
import {
  GetAllCandidateQueryDto,
  GetAllCandidateResponseDto,
} from '@/models/candidate/getAllCandidateDto'
import { findPartyByIdRepository } from '../repositories/PartyRepository'
import { findConstituencyByIdRepository } from '../repositories/ConstituenciesRepository'
import {
  UpdateCandidateDto,
  UpdatedByCandidateDto,
} from '@/models/candidate/updateCandidateDto'

// =========================================
//        Helper Validation Functions
// =========================================

function validateCandidateNumber(number?: number) {
  if (number !== undefined) {
    if (!Number.isInteger(number) || number <= 0) {
      throw new Error('Invalid candidate number')
    }
  }
}

function validateName(firstName?: string, lastName?: string) {
  if (firstName !== undefined) {
    const firstTrimmed = firstName.trim()

    if (firstTrimmed.length === 0) {
      throw new Error('First name is required')
    }
  }

  if (lastName !== undefined) {
    const lastTrimmed = lastName.trim()

    if (lastTrimmed.length === 0) {
      throw new Error('Last name is required')
    }
  }
}

function validateImageUrl(imageUrl?: string) {
  if (imageUrl !== undefined) {
    const imaTrimmed = imageUrl.trim()

    if (imaTrimmed.length === 0) {
      throw new Error('Image URL is required')
    }
  }
}

async function validatePartyAndConstituency(
  partyId?: number,
  constituencyId?: number,
) {
  if (partyId !== undefined) {
    if (partyId <= 0) {
      throw new Error('Invalid party id')
    }

    const party = await findPartyByIdRepository(partyId)
    if (!party) {
      throw new Error('Party not found')
    }
  }

  if (constituencyId !== undefined) {
    if (constituencyId <= 0) {
      throw new Error('Invalid constituency id')
    }

    const constituency = await findConstituencyByIdRepository(constituencyId)
    if (!constituency) {
      throw new Error('Constituency not found')
    }
  }
}

// =========================================
//              สร้าง candidate
// =========================================
export async function createCandidateService(
  input: CreateCandidateDto,
  userId: number,
) {
  // ลบช่องว่าง
  const firstName = input.firstName.trim()
  const lastName = input.lastName.trim()
  const imageUrl = input.imageUrl.trim()
  const citizenId = input.citizenId.trim()
  const constituency = input.constituencyId

  // Validate
  validateCandidateNumber(input.number)
  validateName(firstName, lastName)
  validateImageUrl(imageUrl)

  if (!citizenId || citizenId.length != 13) {
    throw new Error('Citizen ID is incorrect')
  }

  // ดัก constituency
  if (!constituency || isNaN(constituency)) {
    throw new Error('Invalid constituencyId')
  }

  // เช็ค citizenId ซ้ำ
  const existingCitizen = await findCandidateByCitizenIdRepository(citizenId)
  if (existingCitizen) {
    throw new Error('Citizen ID already exists')
  }

  // ตรวจสอบ party
  const existingParty = await findPartyByIdRepository(input.partyId)
  if (!existingParty) {
    throw new Error('Party not found')
  }

  // ตรวจสอบ constituency
  const existingConstituency = await findConstituencyByIdRepository(
    input.constituencyId,
  )
  if (!existingConstituency) throw new Error('Constituency not found')

  // ตรวจสอบหมายเลขซ้ำในเขต
  const duplicateNum = await findCandidateByNumberAndConstituencyIdRepository(
    input.number,
    input.constituencyId,
  )
  if (duplicateNum) {
    throw new Error('Candidate number already exists in this constituency')
  }

  // ตรวจสอบพรรคซ้ำในเขต
  const duplicateParty = await findCandidateByPartyAndConstituencyRepository(
    input.partyId,
    input.constituencyId,
  )
  if (duplicateParty) {
    throw new Error('Party already has a candidate in this constituency')
  }

  // ถ้าไม่มี policy ใช้ policy พรรค
  let finalPolicy: string

  if (input.candidatePolicy && input.candidatePolicy.trim().length > 0) {
    finalPolicy = input.candidatePolicy.trim()
  } else {
    finalPolicy = existingParty.policy
  }

  const newCandidate: CreateCandidateWithAuditDto = {
    citizenId: citizenId,
    number: input.number,
    firstName: firstName,
    lastName: lastName,
    candidatePolicy: finalPolicy,
    imageUrl: imageUrl,
    partyId: input.partyId,
    constituencyId: input.constituencyId,
    createdBy: userId,
    updatedBy: userId,
  }

  return await createCandidateRepository(newCandidate)
}

// =========================================
//      ดูรายชื่อผู้สมัครทั้งหมด แบบแบ่งหน้าได้
// =========================================
export async function getAllCandidatesService(
  query: GetAllCandidateQueryDto,
): Promise<GetAllCandidateResponseDto<any>> {
  // ข้อมูล Pagination
  const page = query.page && query.page > 0 ? query.page : 1
  const limit = query.limit && query.limit > 0 ? query.limit : 10
  const skip = (page - 1) * limit

  const numPartyId = query.partyId
  const numConstituencyId = query.constituencyId
  const numProvinceId = query.provinceId

  const AND: any[] = []

  if (query.search && query.search.trim().length > 0) {
    const searchValue = query.search.trim()
    const OR: any[] = []

    // เช็คว่าเป็นตัวเลขล้วนหรือไม่
    const isAllDigits = !isNaN(Number(searchValue))

    // เช็คว่าเป็นเลข 13 หลักหรือไม่
    const isCitizenId = isAllDigits && searchValue.length === 13

    // ถ้าเป็นเลข 13 หลัก เป็น citizenId เท่านั้น
    if (isCitizenId) {
      OR.push({
        citizenId: searchValue,
      })
    } else if (isAllDigits) {
      const searchNumber = Number(searchValue)

      OR.push({ id: searchNumber }, { number: searchNumber })
    }

    // ค้นหาข้อความทั่วไป
    OR.push(
      {
        firstName: {
          contains: searchValue,
          mode: 'insensitive',
        },
      },
      {
        lastName: {
          contains: searchValue,
          mode: 'insensitive',
        },
      },
      {
        party: {
          name: {
            contains: searchValue,
            mode: 'insensitive',
          },
        },
      },
      {
        constituency: {
          province: {
            name: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        },
      },
    )

    AND.push({ OR })
  }

  // --------- FILTER ---------
  if (numPartyId !== undefined) {
    AND.push({ partyId: numPartyId })
  }

  if (numConstituencyId !== undefined) {
    AND.push({ constituencyId: numConstituencyId })
  }

  if (numProvinceId !== undefined) {
    AND.push({
      constituency: {
        provinceId: numProvinceId,
      },
    })
  }

  const where = AND.length > 0 ? { AND } : {}
  // Sorting
  const allowedSortFields = [
    'id',
    'number',
    'firstName',
    'lastName',
    'updatedAt',
  ]

  // ถ้า user ไม่ส่ง sort อะไรมาเลย ให้เรียงตาม id จากน้อยไปมาก
  let orderBy: any = { updatedAt: 'desc' }

  // ใช้ค่าจากตัวแปรเป็นชื่อ field ให้ใส่ใน []
  if (query.sortBy && allowedSortFields.includes(query.sortBy)) {
    orderBy = { [query.sortBy]: query.order === 'desc' ? 'desc' : 'asc' }
  }

  // นับจำนวน
  const total = await countCandidatesRepository(where)

  // ส่งไปหาตามเงื่อนไข
  const candidate = await findAllCandidatesRepository(
    where,
    skip,
    limit,
    orderBy,
  )

  return {
    total,
    candidate,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

// =========================================
//                 อัพเดทผู้สมัคร
// =========================================
export async function updateCandidateService(
  id: number,
  input: UpdateCandidateDto,
  updatedBy: number,
) {
  // ตรวจสอบว่ามี candidate จริงไหม
  const existingCandidate = await findCandidateByIdRepository(id)

  if (!existingCandidate) {
    throw new Error('Candidate not found')
  }

  // Validate field ที่ส่งมา
  validateCandidateNumber(input.number)
  validateName(input.firstName, input.lastName)
  validateImageUrl(input.imageUrl)

  await validatePartyAndConstituency(input.partyId, input.constituencyId)

  // เช็ค citizenId ซ้ำ (ถ้ามีการแก้)
  if (input.citizenId !== undefined) {
    const trimmedCitizenId = input.citizenId.trim()

    if (!trimmedCitizenId) {
      throw new Error('Citizen ID is required')
    }

    const duplicateCitizen =
      await findCandidateByCitizenIdRepository(trimmedCitizenId)

    if (duplicateCitizen && duplicateCitizen.id !== id) {
      throw new Error('Citizen ID already exists')
    }

    input.citizenId = trimmedCitizenId
  }

  // เช็ค number ซ้ำในเขต
  if (input.number !== undefined || input.constituencyId !== undefined) {
    const number = input.number ?? existingCandidate.number
    const constituency =
      input.constituencyId ?? existingCandidate.constituencyId

    const duplicate = await findCandidateByNumberAndConstituencyIdRepository(
      number,
      constituency,
    )

    if (duplicate && duplicate.id !== id) {
      throw new Error('Duplicate candidate number in this constituency')
    }
  }

  // เช็ค party ซ้ำในเขต
  if (input.partyId !== undefined || input.constituencyId !== undefined) {
    const partyId = input.partyId ?? existingCandidate.partyId
    const constituencyId =
      input.constituencyId ?? existingCandidate.constituencyId

    const duplicateParty = await findCandidateByPartyAndConstituencyRepository(
      partyId,
      constituencyId,
    )

    if (duplicateParty && duplicateParty.id !== id) {
      throw new Error('This party already has a candidate in this constituency')
    }
  }

  // สร้าง object สำหรับ update
  const updateData: UpdatedByCandidateDto = {
    citizenId: input.citizenId,
    number: input.number,
    firstName: input.firstName?.trim(),
    lastName: input.lastName?.trim(),
    candidatePolicy: input.candidatePolicy?.trim(),
    imageUrl: input.imageUrl?.trim(),
    partyId: input.partyId,
    constituencyId: input.constituencyId,
    updatedBy: updatedBy,
  }

  return await updateCandidateRepository(id, updateData)
}

// =========================================
//              ลบผู้สมัครจาก id
// =========================================
export async function deleteCandidateService(id: number) {
  const existingCandidate = await findCandidateByIdRepository(id)

  if (!existingCandidate) {
    throw new Error('Candidate not found')
  }

  const voteCount = await countVotesByCandidateIdRepository(id)

  if (voteCount > 0) {
    throw new Error('Cannot delete candidate because there are votes')
  }

  await deleteCandidateRepository(id)

  return { message: 'Candidate deleted successfully' }
}
