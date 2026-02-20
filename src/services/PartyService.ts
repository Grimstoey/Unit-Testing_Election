import {
    getAllParty, getAllPartyWithPagination, addParty, deleteParty, editParty
} from '@/repositories/PartyRepository'
import {getConstituencyRepository} from "@/repositories/VoterRepository";
import {
    addConstituency, deleteConstituency, editConstituency,
    getAllConstituencies,
    getAllEventsWithProvincePagination
} from "@/repositories/AdminRepository";

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
export const createPartyService = async (name: string, logoUrl: string, policy: string) => {
  const result = await addParty(name,logoUrl,policy)

  return {
      ok: true as const,
      status: 200,
      data: result,
    }
}

export  async function deletePartyService(id: number) {
    const result = await deleteParty(id)

    return {
        ok: true as const,
        status: 200,
        data: result,
    }
}

export async function editPartyService(id: number, name: string, logoUrl: string, policy: string) {
  const result = await editParty(id, name, logoUrl, policy);

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

export async  function getAllPartyWithPaginationService(limit: number, page: number) {
  const pageEvents = await getAllPartyWithPagination(limit, page);
  return pageEvents;
}