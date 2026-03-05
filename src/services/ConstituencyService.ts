import {
  addConstituency,
  closeAllConstituencies,
  deleteConstituency,
  editConstituency,
  getAllConstituencies,
  getConstituenciesWithProvincePagination,
  getAvailableDistrictByProvinceId,
  getConstituencyById,
  openAllConstituencies,
  toggleConstituencyStatus,
} from '@/repositories/ConstituenciesRepository'

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

export const createConstituencyService = async (
  number: number,
  provinceId: number,
  districtIds?: number[],
) => {
  const result = await addConstituency(number, provinceId, districtIds)

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
export async function deleteConstituencyService(id: number) {
  const result = await deleteConstituency(id)

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
export async function editConstituencyService(
  id: number,
  number: number,
  provinceId: number,
  isClosed: boolean,
  districtIds?: number[],
) {
  const result = await editConstituency(
    id,
    number,
    provinceId,
    isClosed,
    districtIds,
  )

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
export async function findConstituencyById(id: number) {
  return getConstituencyById(id)
}

export async function getAllConstituencyWithPagination(
  limit: number,
  page: number,
  provinceId: number,
) {
  const pageEvents = await getConstituenciesWithProvincePagination(
    limit,
    page,
    provinceId,
  )
  return pageEvents
}

export async function toggleConstituencyService(id: number) {
  const result = await toggleConstituencyStatus(id)
  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Constituency not found',
    }
  }
  return { ok: true as const, status: 200, data: result }
}

export async function closeAllConstituenciesService() {
  const result = await closeAllConstituencies()
  return { ok: true as const, status: 200, data: result }
}

export async function openAllConstituenciesService() {
  const result = await openAllConstituencies()
  return { ok: true as const, status: 200, data: result }
}

export async function getAvailableDistrictByProvinceIdService(
  provinceId: number,
) {
  const result = await getAvailableDistrictByProvinceId(provinceId)
  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'District not found',
    }
  }
  return { ok: true as const, status: 200, data: result }
}
