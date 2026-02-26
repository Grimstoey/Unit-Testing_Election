import type { Request, Response } from "express";
import { GetAllCandidateQueryDto } from "@/models/candidate/getAllCandidateDto";
import { getAllCandidatesService, createCandidateService, updateCandidateService, deleteCandidateService } from "@/services/CandidateService";
import { CreateCandidateDto } from "@/models/candidate/createCandidateDto";

//สร้าง candidate
export async function createCandidateController(req: Request, res: Response) {

    const input: CreateCandidateDto = {
        number: req.body.number,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        candidatePolicy: req.body.candidatePolicy,
        imageUrl: req.body.imageUrl,
        partyId: req.body.partyId,
        constituencyId: req.body.constituencyId,
    };

    const candidate = await createCandidateService(input);

    return res.status(200).json({
        message: "Candidate created successfully",
        data: candidate,
    });

}


// เรียกดู candidate ทั้งหมด
export async function getAllCandidatesController(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const queryDto: GetAllCandidateQueryDto = {
        page,
        limit,
        search: req.query.search as string,
        sortBy: req.query.sortBy as any,
        order: req.query.order as any,
    };

    const result = await getAllCandidatesService(queryDto);

    res.status(200).json(result);
}

// update candidate
export async function updateCandidateController(req: Request, res: Response) {

    console.log(req.body);

    const intId = Number(req.params.id);

    if (!intId || intId <= 0) {
        return res.status(400).json({
            message: "Invalid candidate id",
        });
    }

    const updateCandidate = await updateCandidateService(intId, req.body);

    return res.status(200).json({
        message: "Candidate updated successfully",
        data: updateCandidate
    });

}

// ลบ candidate
export async function deleteCandidateController(req: Request, res: Response) {

    const intId = Number(req.params.id);

    if (isNaN(intId)) {
        return res.status(400).json({
            message: "Invalid candidate id",
        });
    }

    const deleteCandidate = await deleteCandidateService(intId);

    if (!deleteCandidate.success) {
        return res.status(400).json({ message: deleteCandidate.message });
    } else {
        return res.status(200).json({ message: deleteCandidate.message });
    }
}