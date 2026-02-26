import { CreateCandidateDto } from "@/models/candidate/createCandidateDto";
import {
    createCandidateRepository,
    findAllCandidatesRepository,
    countCandidatesRepository,
    findCandidateByNumberAndConstituencyId,
    findCandidateById,
    updateCandidateRepository,
    countVotesByCandidateId,
    deleteCandidateRepository
} from "../repositories/CandidatesRepository";
import { GetAllCandidateQueryDto, GetAllCandidateResponseDto } from "@/models/candidate/getAllCandidateDto";
import { findPartyById } from "../repositories/PartyRepository";
import { findConstituencyById } from "../repositories/ConstituenciesRepository";
import { UpdateCandidateDto } from "@/models/candidate/updateCandidateDto";



// สร้าง candidate
export async function createCandidateService(input: CreateCandidateDto) {

    const existingCandidate = await findCandidateByNumberAndConstituencyId(input);

    if (existingCandidate) {
        throw new Error("The candidate numbers are duplicated in this constituency.")
    }

    if (!input.number || input.number <= 0) {
        throw new Error("Invalid candidate number");
    }

    if (!input.firstName || !input.lastName || !input.firstName.trim() || !input.lastName.trim()) {
        throw new Error("Please enter first and last name.");
    }

    const party = await findPartyById(input.partyId);
    const constituency = await findConstituencyById(input.constituencyId);

    if (!party) {
        throw new Error("Party not found");
    }

    if (!constituency) {
        throw new Error("Constituency not found");
    }

    if (input.candidatePolicy && input.candidatePolicy.trim().length > 0) {
        input.candidatePolicy = input.candidatePolicy.trim();
    } else {
        input.candidatePolicy = party.policy;
    }

    return await createCandidateRepository(input);

}




// ดูรายชื่อผู้สมัครทั้งหมด แบบแบ่งหน้าได้
export async function getAllCandidatesService(query: GetAllCandidateQueryDto): Promise<GetAllCandidateResponseDto<any>> {

    // ข้อมูล Pagination
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    //สร้างเงื่อนไขค้นหา
    let where: any = {};

    if (query.search) {

        const searchNumber = Number(query.search);

        where = {
            OR: [
                {
                    firstName: {
                        contains: query.search,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        contains: query.search,
                        mode: "insensitive",
                    },
                },
                {
                    party: {
                        name: {
                            contains: query.search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    constituency: {
                        province: {
                            name: {
                                contains: query.search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        };

        // ถ้าเป็นตัวเลขค้น id และ number 
        if (!isNaN(searchNumber)) {
            where.OR.push(
                { id: searchNumber },
                { number: searchNumber }
            );
        }
    }

    // Sorting
    const allowedSortFields = [
        "id",
        "number",
        "firstName",
        "lastName",
    ];

    // ถ้า user ไม่ส่ง sort อะไรมาเลย ให้เรียงตาม id จากน้อยไปมาก
    let orderBy: any = { id: "asc" };

    // ใช้ค่าจากตัวแปรเป็นชื่อ field ให้ใส่ใน []
    if (query.sortBy && allowedSortFields.includes(query.sortBy)) {
        orderBy = { [query.sortBy]: query.order === "desc" ? "desc" : "asc", };
    }

    // นับจำนวน
    const total = await countCandidatesRepository(where);

    // ส่งไปหาตามเงื่อนไข
    const candidate = await findAllCandidatesRepository(
        where,
        skip,
        limit,
        orderBy
    );

    return {
        total,
        candidate,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

// แก้ไขผู้สมัคร
export async function updateCandidateService(id: number, input: UpdateCandidateDto) {

    const existingCandidate = await findCandidateById(id);

    if (!existingCandidate) {
        throw new Error("Candidate not found");
    }

    // เอามาแปลงเป็นก้อนนนี้ก่อน เพราะ req.body มี user ติดมาด้วยจาก middleware
    const updateData: UpdateCandidateDto = {
        number: input.number,
        firstName: input.firstName,
        lastName: input.lastName,
        candidatePolicy: input.candidatePolicy,
        imageUrl: input.imageUrl,
        partyId: input.partyId,
        constituencyId: input.constituencyId,
    };


    return await updateCandidateRepository(id, updateData);
}

// ลบผู้สมัครจาก id
export async function deleteCandidateService(id: number) {

    const existingCandidate = await findCandidateById(id);

    if (!existingCandidate) {
        return {
            success: false,
            message: "Candidate not found"
        };
    }

    const voteCount = await countVotesByCandidateId(id);

    if (voteCount > 0) {
        return {
            success: false,
            message: "Cannot delete candidate because there are votes"
        };
    } else {

        await deleteCandidateRepository(id);

        return {
            success: true,
            message: "Candidate deleted successfully"
        };
    }
}
