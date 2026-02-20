import {
  addConstituency, deleteConstituency, editConstituency,
  getAllConstituencies,
  getAllEventsWithProvincePagination, getAllUser,
  getConstituencyById, getUserByRole
} from '@/repositories/AdminRepository'
import {getConstituencyRepository} from "@/repositories/VoterRepository";

export async function findAllConstituenciesService() {
  const result = await getAllConstituencies()

  if (!result) {
    return {
      ok: false as const,
      status: 500,
      message: 'Internal server error',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
export async function findAllUserService() {
  const result = await getAllUser()

  if (!result) {
    return {
      ok: false as const,
      status: 500,
      message: 'Internal server error',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
export  async function findUsersByRoleService(role: string) {
    const result = await getUserByRole(role);

    if (!result) {
      return {
        ok: false as const,
        status: 500,
        message: 'Internal server error',
      }
    }

    return {
      ok: true as const,
      status: 200,
      data: result,
    }
}
export const createConstituencyService = async (number: number, provinceId: number) => {
  const result = await addConstituency(number,provinceId)

  return {
      ok: true as const,
      status: 200,
      data: result,
    }
}
export  async function deleteConstituencyService(id: number) {
    const result = await deleteConstituency(id)

    return {
        ok: true as const,
        status: 200,
        data: result,
    }
}
export async function editConstituencyService(id: number, number: number, provinceId: number, isClosed: boolean) {
  const result = await editConstituency(id, number, provinceId, isClosed);

  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Constituency not found',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
export  async  function findConstituencyById(id: number){
    return getConstituencyById(id);
}
export async  function getAllConstituencyWithPagination(limit: number, page: number, provinceId: number) {
  const pageEvents = await getAllEventsWithProvincePagination(limit, page,provinceId);
  return pageEvents;
}
