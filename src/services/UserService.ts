import { findByUserIdRepository, getAllUsersRepository } from "../repositories/UserRepository";
import { GetAllUsersQueryDto, GetAllUsersResponseDto } from "../models/user/getAllUsersDto"
import { UserWithRelationsDto } from "../models/user/userWithRelationsDto"


export async function findByUserIdService(userIdInput: number) {
  const user = await findByUserIdRepository(userIdInput);

  if (!user) {
    return {
      ok: false as const,
      error: "User not found",
    };
  }

  const roles = user.roles.map((r) => r.role.name);

  const constituency = user.district?.constituency || null;

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
        id: user.district.id,
        name: user.district.name,
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

  const repositoryResult = await getAllUsersRepository(query)

  const mappedUsers: UserWithRelationsDto[] = repositoryResult.users.map((u) => {
    return {
      id: u.id,
      citizenId: u.citizenId,
      firstName: u.firstName,
      lastName: u.lastName,
      address: u.address,
      provinceId: u.provinceId,
      districtId: u.districtId,
      createdAt: u.createdAt,

      province: u.province,

      district: {
        id: u.district.id,
        name: u.district.name,
        constituency: u.district.constituency,
      },

      roles: u.roles.map((r) => {
        return {
          role: {
            id: r.role.id,
            name: r.role.name,
          },
        }
      }),

      vote: u.vote
        ? {
          id: u.vote.id,
          createdAt: u.vote.createdAt,
          candidateId: u.vote.candidate.id,
          candidateNumber: u.vote.candidate.number,
          constituencyId: u.vote.candidate.constituency.id,
          constituencyNumber: u.vote.candidate.constituency.number,
        }
        : null,
    }
  })

  return {
    total: repositoryResult.total,
    users: mappedUsers,
    page: repositoryResult.page,
    limit: repositoryResult.limit,
    totalPages: repositoryResult.totalPages,
  }
}


