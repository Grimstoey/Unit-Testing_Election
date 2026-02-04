import { findByCitizenId, findByUserId } from "../repositories/UserRepository";

export async function findByCitizenIdService(citizenIdInput: string) {
    return findByCitizenId(citizenIdInput);
}

export async function findByUserIdService(userIdInput: number) {
    return findByUserId(userIdInput);
}
