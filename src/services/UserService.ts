import { findByUserId, getAllUsers } from "../repositories/UserRepository";
import {GetAllUsersQueryDto, GetAllUsersResponseDto} from "../models/user/getAllUsersDto"
import {UserWithRelationsDto} from "../models/user/userWithRelationsDto"


export async function findByUserIdService(userIdInput: number) {
  const user = await findByUserId(userIdInput);
  if (!user) {
    return {
      ok: false as const,
      error: "User not found",
    };
  }
  const roles = user.roles.map((r: { role: { name: string } }) => r.role.name);

  const district = user.district as any;
  const constituency = district.districtMappings?.[0]?.constituency || null;

  return {
    ok: true as const,
    data: {
      id: user.id,
      citizenId: user.citizenId,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      province: user.province,
      district: {
        id: district.id,
        name: district.name,
      },
      constituency: constituency
        ? {
            id: constituency.id,
            number: constituency.number,
            isClosed: constituency.isClosed,
          }
        : null,
      createdAt: user.createdAt,
      roles,
    },
  };
}


export async function getAllUsersService(query: GetAllUsersQueryDto): Promise<GetAllUsersResponseDto<UserWithRelationsDto>> {
  return getAllUsers(query);
}