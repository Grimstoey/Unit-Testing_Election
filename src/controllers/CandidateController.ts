import type { Request, Response } from "express";
import { GetAllCandidateQueryDto } from "@/models/candidate/getAllCandidateDto";
import { getAllCandidatesService, upsertCandidateService } from "@/services/CandidateService";
import { CreateCandidateDto } from "@/models/candidate/createCandidateDto";


export async function upsertCandidateController(req: Request, res: Response) {

    const input: CreateCandidateDto = {
        number: req.body.number,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        candidatePolicy: req.body.candidatePolicy,
        imageUrl: req.body.imageUrl,
        partyId: req.body.partyId,
        constituencyId: req.body.constituencyId,
    };

    const candidate = await upsertCandidateService(input);

    return res.status(200).json({
        message: "Candidate upserted successfully",
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