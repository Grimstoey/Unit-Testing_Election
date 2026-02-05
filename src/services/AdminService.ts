import {
  getAllConstituencies,
  getAllEventsWithProvincePagination, getAllUser,
  getConstituencyById, getUserByRole
} from '@/repositories/AdminRepository'

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
export  async  function findConstituencyById(id: number){
    return getConstituencyById(id);
}
export async  function getAllEventsWithPagination(keyword: string,pageSize: number, pageNo: number) {
  const pageEvents = await getAllEventsWithProvincePagination(keyword,pageSize, pageNo);
  return pageEvents;
}
