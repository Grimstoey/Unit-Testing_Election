import {
  getAllParty,
  getAllPartyWithPagination,
  addParty,
  deleteParty,
  editParty,
  getPartyById,
} from '@/repositories/PartyRepository'

export async function findAllPartyService() {
  const result = await getAllParty()

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
export const createPartyService = async (
  name: string,
  logoUrl: string,
  policy: string,
) => {
  const result = await addParty(name, logoUrl, policy)

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export async function deletePartyService(id: number) {
  const result = await deleteParty(id)

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export async function editPartyService(
  id: number,
  name: string,
  logoUrl: string,
  policy: string,
) {
  const result = await editParty(id, name, logoUrl, policy)

  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Parties not found',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export async function getAllPartyWithPaginationService(
  limit: number,
  page: number,
) {
  const pageEvents = await getAllPartyWithPagination(limit, page)
  return {
    ok: true as const,
    status: 200,
    data: pageEvents,
  }
}

export async function findPartyByIdService(id: number) {
  const result = await getPartyById(id)

  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Party not found',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
