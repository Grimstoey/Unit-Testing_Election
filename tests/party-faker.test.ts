import assert from 'node:assert/strict'
import test, { mock } from 'node:test'
import { faker } from '@faker-js/faker'
import { createPartyUseCase } from '../src/services/createPartyUseCase'

test('UT-CP-018 ใช้ Faker สร้างชื่อพรรคที่แตกต่างกันและตรวจสอบข้อมูลก่อนบันทึก', async () => {
  const names = new Set<string>()
  const write = mock.fn(async (name: string, logoUrl: string, policy: string, userId: number) =>
    ({ id: names.size + 1, name, logoUrl, policy, createdBy: userId }))
  for (let i = 0; i < 5; i++) {
    const name = `พรรคทดสอบ-${faker.string.uuid()}`
    names.add(name)
    const result = await createPartyUseCase({
      name,
      logoUrl: faker.image.url(),
      policy: faker.lorem.sentence(),
    }, 17, write)
    assert.equal(result.ok, true)
  }
  assert.equal(names.size, 5)
  assert.equal(write.mock.callCount(), 5)
})
