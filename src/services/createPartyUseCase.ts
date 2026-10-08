import { validateCreateParty } from '../utils/validateCreateParty'

export type PartyWriter<T> = (
  name: string,
  logoUrl: string,
  policy: string,
  userId: number,
) => Promise<T>

/** Inject the persistence collaborator so tests need no database. */
export async function createPartyUseCase<T>(
  input: { name: unknown; logoUrl: unknown; policy: unknown },
  userId: number,
  writeParty: PartyWriter<T>,
) {
  const validated = validateCreateParty(input)
  if (!validated.ok) {
    return { ok: false as const, status: 400, message: validated.message }
  }

  const result = await writeParty(
    validated.data.name,
    validated.data.logoUrl,
    validated.data.policy,
    userId,
  )
  return { ok: true as const, status: 200, data: result }
}
