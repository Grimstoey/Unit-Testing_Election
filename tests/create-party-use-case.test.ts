import assert from 'node:assert/strict'
import test, { mock } from 'node:test'
import { createPartyUseCase } from '../src/services/createPartyUseCase'

const valid = {
  name: 'พรรคใหม่',
  logoUrl: 'https://example.test/logo.png',
  policy: 'นโยบาย',
}

test('UT-CP-015 uses a stub return value without calling a database', async () => {
  const party = { id: 100, ...valid, createdBy: 7, updatedBy: 7 }
  const stubWriter = async () => party
  const actual = await createPartyUseCase(valid, 7, stubWriter)
  assert.deepEqual(actual, { ok: true, status: 200, data: party })
})

test('UT-CP-016 uses a spy to verify persistence is not called for invalid name', async () => {
  const spyWriter = mock.fn(async () => ({ id: 101 }))
  const result = await createPartyUseCase({ ...valid, name: '  ' }, 7, spyWriter)
  assert.equal(result.ok, false)
  assert.equal(result.status, 400)
  assert.equal(spyWriter.mock.callCount(), 0)
})

test('UT-CP-017 mocks persistence and verifies normalized arguments and user ID', async () => {
  const fakeStored = { id: 102 }
  const mockWriter = mock.fn(async (_name: string, _logo: string, _policy: string, _id: number) => fakeStored)
  const result = await createPartyUseCase({ ...valid, name: '  พรรคใหม่  ', policy: '  นโยบาย  ' }, 7, mockWriter)
  assert.equal(result.ok, true)
  assert.equal(mockWriter.mock.callCount(), 1)
  assert.deepEqual(mockWriter.mock.calls[0].arguments, [valid.name, valid.logoUrl, valid.policy, 7])
  if (result.ok) assert.deepEqual(result.data, fakeStored)
})
