import {
  getAllConstituencies,
  getAllEventsWithProvincePagination,
  getConstituencyById
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

export  async  function findConstituencyById(id: number){
    return getConstituencyById(id);
}
export async  function getAllEventsWithPagination(keyword: string,pageSize: number, pageNo: number) {
  const pageEvents = await getAllEventsWithProvincePagination(keyword,pageSize, pageNo);
  return pageEvents;
}
