import { validateCreateParty } from '../utils/validateCreateParty'
import {
  getAllParty,
  getAllPartyWithPagination,
  createParty,
  deleteParty,
  updateParty,
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
  userId: number
) => {
  const validated = validateCreateParty({ name, logoUrl, policy })
  if (!validated.ok) {
    return {
      ok: false as const,
      status: 400,
      message: validated.message,
    }
  }

  const result = await createParty(
    validated.data.name,
    validated.data.logoUrl,
    validated.data.policy,
    userId,
  )

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export async function deletePartyService(id: number) {

  const existingParty = await getPartyById(id);

  if (!existingParty) {
    return {
      ok: false as const,
      status: 404,
      message: 'Party not found',
    }
  }

  const result = await deleteParty(id)

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export async function updatePartyService(
  id: number,
  name: string,
  logoUrl: string,
  policy: string,
  userId: number
) {
  const existing = await getPartyById(id)

  if (!existing) {
    return {
      ok: false as const,
      status: 404,
      message: 'Party not found',
    }
  }

  const result = await updateParty(id, name, logoUrl, policy, userId)

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
