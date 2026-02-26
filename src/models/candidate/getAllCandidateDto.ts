export type GetAllCandidateQueryDto = {
    page: number;
    limit: number;
    search?: string;
    sortBy?: "id" | "firstName" | "lastName" | "party" | "number" | "provinceId";
    order?: "asc" | "desc";
};

// ใช้ <T> เพื่อความยืนหยุ่นของ response 
// เพราะการส่งคืนการทำงานของแต่ละส่วนอาจมีความต้องการข้อมูลไม่เหมือนกัน
export type GetAllCandidateResponseDto<TCandidate> = {
    total: number;
    candidate: TCandidate[];
    page: number;
    limit: number;
    totalPages: number;
};
