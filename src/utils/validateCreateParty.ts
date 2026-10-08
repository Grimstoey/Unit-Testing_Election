export type PartyInput = {
  name?: unknown
  logoUrl?: unknown
  policy?: unknown
}

export type ValidPartyInput = {
  name: string
  logoUrl: string
  policy: string
}

export type PartyValidationResult =
  | { ok: true; data: ValidPartyInput }
  | { ok: false; field: keyof ValidPartyInput; message: string }

/**
 * The Create Political Party requirements mandate all three fields.
 * Name and policy are trimmed and whitespace-only input is invalid.
 * Treat logoUrl as required and non-blank without introducing
 * an unsupported URL-format requirement.
 */
export function validateCreateParty(input: PartyInput): PartyValidationResult {
  const fields = ['name', 'logoUrl', 'policy'] as const
  const normalized: Record<string, string> = {}

  for (const field of fields) {
    const value = input[field]
    if (typeof value !== 'string' || value.trim().length === 0) {
      return { ok: false, field, message: `${field} is required` }
    }
    normalized[field] = field === 'logoUrl' ? value : value.trim()
  }

  return { ok: true, data: normalized as ValidPartyInput }
}
