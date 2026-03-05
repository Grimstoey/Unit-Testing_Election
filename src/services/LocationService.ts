import {
  getAllProvinces,
  getConstituenciesByDistrictId,
  getDistrictsByProvinceId,
} from '../repositories/LocationRepository'

export async function getAllProvincesService() {
  const result = await getAllProvinces()

  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Province not found',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export async function getDistrictsByProvinceIdService(provinceId: number) {
  const result = await getDistrictsByProvinceId(provinceId)

  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Province not found',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export async function getConstituenciesByDistrictIdService(districtId: number) {
  const result = await getConstituenciesByDistrictId(districtId)

  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'District not found',
    }
  }

  const constituency = result.constituency

  if (!constituency) {
    return {
      ok: false as const,
      status: 404,
      message: 'Constituency not found for this district',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: {
      district: {
        id: result.id,
        name: result.name,
      },
      constituency,
    },
  }
}
