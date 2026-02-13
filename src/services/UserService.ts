import { findByCitizenId, findByUserId, getAllUsers } from "../repositories/UserRepository";
import {GetAllUsersQueryDto, GetAllUsersResponseDto} from "../models/user/getAllUsersDto"
import {UserWithRelationsDto} from "../models/user/userWithRelationsDto"

export async function findByCitizenIdService(citizenIdInput: string) {
    return findByCitizenId(citizenIdInput);
}

export async function findByUserIdService(userIdInput: number) {
    return findByUserId(userIdInput);
}


export async function getAllUsersService(query: GetAllUsersQueryDto): Promise<GetAllUsersResponseDto<UserWithRelationsDto>> {
  return getAllUsers(query);
}