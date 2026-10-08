import assert from 'node:assert/strict'
import test from 'node:test'
import { validateCreateParty } from '../src/utils/validateCreateParty'

const valid = {
  name: 'พรรคทดสอบ',
  logoUrl: 'https://example.test/logo.png',
  policy: 'นโยบายพรรค',
}

test('UT-CP-001 happy path accepts complete party fields', () => {
  assert.deepEqual(validateCreateParty(valid), { ok: true, data: valid })
})

test('UT-CP-002 rejects absent name', () => {
  assert.deepEqual(validateCreateParty({ logoUrl: valid.logoUrl, policy: valid.policy }), {
    ok: false, field: 'name', message: 'name is required',
  })
})

test('UT-CP-003 rejects absent logoUrl', () => {
  const result = validateCreateParty({ name: valid.name, policy: valid.policy })
  assert.equal(result.ok, false)
  if (!result.ok) assert.equal(result.field, 'logoUrl')
})

test('UT-CP-004 rejects absent policy', () => {
  const result = validateCreateParty({ name: valid.name, logoUrl: valid.logoUrl })
  assert.equal(result.ok, false)
  if (!result.ok) assert.equal(result.field, 'policy')
})

test('UT-CP-005 rejects whitespace-only name', () => {
  assert.equal(validateCreateParty({ ...valid, name: '   ' }).ok, false)
})

test('UT-CP-006 rejects whitespace-only policy', () => {
  assert.equal(validateCreateParty({ ...valid, policy: '\t \n' }).ok, false)
})

test('UT-CP-007 rejects null, empty, and whitespace-only required values', () => {
  for (const field of ['name', 'logoUrl', 'policy'] as const) {
    for (const value of [null, undefined, '', '  ']) {
      const result = validateCreateParty({ ...valid, [field]: value })
      assert.equal(result.ok, false, `expected rejection for ${field}=${String(value)}`)
    }
  }
})

test('UT-CP-008 trims leading/trailing spaces from name and policy', () => {
  assert.deepEqual(validateCreateParty({ ...valid, name: '  พรรคทดสอบ  ', policy: '  นโยบายพรรค  ' }), {
    ok: true, data: valid,
  })
})
