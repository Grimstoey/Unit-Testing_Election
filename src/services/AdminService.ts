import { getAllConstituencies } from '@/repositories/AdminRepository'

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
