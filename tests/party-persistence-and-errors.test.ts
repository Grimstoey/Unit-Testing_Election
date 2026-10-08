import assert from 'node:assert/strict'
import test, { mock } from 'node:test'
import type { Request, Response, NextFunction } from 'express'
import { makeCreateParty } from '../src/repositories/PartyRepository'
import { errorHandler } from '../src/middlewares/PrismaErrorHandler'
import { Prisma } from '../src/generated/prisma/client'

test('UT-CP-012 createdBy และ updatedBy ต้องใช้รหัสผู้สร้างเดียวกัน', async () => {
  const save = mock.fn(async (_input: unknown) => ({ id: 4 }))
  await makeCreateParty(save)('พรรคทดสอบ', 'logo.png', 'นโยบาย', 17)
  assert.equal(save.mock.callCount(), 1)
  assert.deepEqual(save.mock.calls[0].arguments[0], {
    data: { name: 'พรรคทดสอบ', logoUrl: 'logo.png', policy: 'นโยบาย', createdBy: 17, updatedBy: 17 },
  })
})

function httpContext() {
  const result: { status?: number; body?: any } = {}
  const res = {
    headersSent: false,
    status(status: number) { result.status = status; return this },
    json(body: any) { result.body = body; return this },
  } as unknown as Response
  return { result, res }
}

test('UT-CP-013 Prisma P2002 ต้องตอบ 409 เมื่อชื่อพรรคซ้ำ', () => {
  const { res, result } = httpContext()
  const error = new Prisma.PrismaClientKnownRequestError('duplicate', {
    code: 'P2002', clientVersion: '7.3.0', meta: { target: ['name'] },
  })
  const spy = mock.method(console, 'error', () => {})
  try {
    errorHandler(error, {} as Request, res, (() => {}) as NextFunction)
    assert.equal(result.status, 409)
  } finally { spy.mock.restore() }
})

test('UT-CP-014 ข้อผิดพลาดที่ไม่คาดคิดต้องตอบ 500 โดยไม่ส่งรายละเอียดภายใน', () => {
  const { res, result } = httpContext()
  const spy = mock.method(console, 'error', () => {})
  try {
    errorHandler(new Error('private connection detail'), {} as Request, res, (() => {}) as NextFunction)
    assert.equal(result.status, 500)
    assert.deepEqual(result.body, { message: 'Internal server error' })
  } finally { spy.mock.restore() }
})
