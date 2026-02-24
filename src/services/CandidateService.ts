import { CreateCandidateDto } from "@/models/candidate/createCandidateDto";
import { upsertCandidateRepository, findAllCandidatesRepository, countCandidatesRepository } from "../repositories/CandidatesRepository";
import { GetAllCandidateQueryDto, GetAllCandidateResponseDto } from "@/models/candidate/getAllCandidateDto";
import { findPartyById } from "../repositories/PartyRepository";
import { findConstituencyById } from "../repositories/ConstituenciesRepository";



// สร้าง + อัพเดท
export async function upsertCandidateService(input: CreateCandidateDto) {

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

    return await upsertCandidateRepository(input);

}




// ดูรายชื่อผู้สมัครทั้งหมด แบบแบ่งหน้าได้
export async function getAllCandidatesService(query: GetAllCandidateQueryDto): Promise<GetAllCandidateResponseDto<any>> {

    // ข้อมูล Pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
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

        // ค้นหาเบอร์ผู้สมัคร ถ้าเช็คแล้วเป็นตัวเลข ให้ push เข้าไปเป็นอีกเงื่อนไขใน where
        if (!isNaN(searchNumber)) {
            where.OR.push({
                number: searchNumber,
            });
        }
    }

    // Sorting
    // ถ้า user ไม่ส่ง sort อะไรมาเลย ให้เรียงตาม id จากน้อยไปมาก
    let orderBy: any = { id: "asc" };

    // ใช้ค่าจากตัวแปรเป็นชื่อ field ให้ใส่ใน []
    if (query.sortBy) {
        orderBy = {
            [query.sortBy]: query.order || "asc",
        };
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


// สร้างผู้สมัครแบบ upsert

// ลบผู้สมัครจาก id

