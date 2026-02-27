export type UpdateCandidateDto = {
    citizenId?: string;
    number?: number;
    firstName?: string;
    lastName?: string;
    candidatePolicy?: string;
    imageUrl?: string;
    partyId?: number;
    constituencyId?: number;
};

export type UpdatedByCandidateDto = {
    citizenId?: string;
    number?: number;
    firstName?: string;
    lastName?: string;
    candidatePolicy?: string;
    imageUrl?: string;
    partyId?: number;
    constituencyId?: number;
    updatedBy: number;
};