export type CreateCandidateDto = {
    citizenId: string;
    number: number;
    firstName: string;
    lastName: string;
    candidatePolicy?: string;
    imageUrl: string;
    partyId: number;
    constituencyId: number;
};



export type CreateCandidateWithAuditDto =
    CreateCandidateDto & {
        createdBy: number;
        updatedBy: number;
    };

//ถ้าเพิ่ม field ใน CreateCandidateDto อีกตัวอัปเดตอัตโนมัติ