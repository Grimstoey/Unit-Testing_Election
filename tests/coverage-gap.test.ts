import assert from 'node:assert/strict'
import test, { mock } from 'node:test'
import type { Request, Response, NextFunction } from 'express'
import { Prisma } from '../src/generated/prisma/client'
import { errorHandler } from '../src/middlewares/PrismaErrorHandler'
import { makeRequireAuth } from '../src/middlewares/AuthMiddleware'
import { createPartyUseCase } from '../src/services/createPartyUseCase'

function responseContext(headersSent = false) {
  const result: { status?: number; body?: any } = {}
  const res = {
    headersSent,
    status(code: number) { result.status = code; return this },
    json(body: any) { result.body = body; return this },
  } as unknown as Response
  return { res, result }
}

function knownError(code: string) {
  return new Prisma.PrismaClientKnownRequestError('database error', {
    code, clientVersion: '7.3.0', meta: { target: ['name'] },
  })
}

function handle(error: unknown, production = false) {
  const ctx = responseContext()
  const previous = process.env.NODE_ENV
  const logging = mock.method(console, 'error', () => {})
  try {
    if (production) process.env.NODE_ENV = 'production'
    else process.env.NODE_ENV = 'test'
    errorHandler(error, {} as Request, ctx.res, (() => {}) as NextFunction)
    return ctx.result
  } finally {
    logging.mock.restore()
    if (previous === undefined) delete process.env.NODE_ENV
    else process.env.NODE_ENV = previous
  }
}

test('UT-CP-022 Prisma P2025 ส่งสถานะ 404 เมื่อไม่พบ Record', () => {
  const result = handle(knownError('P2025'))
  assert.equal(result.status, 404)
  assert.equal(result.body?.message, 'Record not found')
})

test('UT-CP-023 Prisma P2003 ส่งสถานะ 400 สำหรับ Foreign Key Constraint', () => {
  const result = handle(knownError('P2003'))
  assert.equal(result.status, 400)
  assert.equal(result.body?.message, 'Foreign key constraint failed')
})

test('UT-CP-024 Prisma Known Error อื่นส่ง 400 พร้อมข้อความทั่วไป', () => {
  const result = handle(knownError('P9999'))
  assert.equal(result.status, 400)
  assert.equal(result.body?.message, 'Database error')
})

test('UT-CP-025 Production ไม่ส่ง Prisma Error Code หรือ Metadata ให้ Client', () => {
  const result = handle(knownError('P2002'), true)
  assert.equal(result.status, 409)
  assert.deepEqual(result.body, { message: 'Duplicate value (unique constraint failed)' })
})

test('UT-CP-026 เมื่อส่ง HTTP Headers แล้วส่งต่อ Error ไปยัง next', () => {
  const { res } = responseContext(true)
  const error = new Error('headers already sent')
  const next = mock.fn((_error: unknown) => {})
  const logging = mock.method(console, 'error', () => {})
  try {
    errorHandler(error, {} as Request, res, next as NextFunction)
    assert.equal(next.mock.callCount(), 1)
    assert.equal(next.mock.calls[0].arguments[0], error)
  } finally { logging.mock.restore() }
})

test('UT-CP-027 Bearer Token ที่เป็นช่องว่างต้องตอบ 401 และไม่เรียก Lookup', async () => {
  const req = { headers: { authorization: 'Bearer   ' }, body: {} } as Request
  const sent: { code?: number } = {}
  const res = { status(code: number) { sent.code = code; return this }, json(_body: unknown) { return this } } as Response
  const lookup = mock.fn(async (_token: string): Promise<any> => null)
  const next = mock.fn(() => {})
  await makeRequireAuth(lookup)(req, res, next as NextFunction)
  assert.equal(sent.code, 401)
  assert.equal(lookup.mock.callCount(), 0)
  assert.equal(next.mock.callCount(), 0)
})

test('UT-CP-028 หาก Persistence ล้มเหลว Use Case ต้องส่งต่อข้อผิดพลาด ไม่คืนผลสำเร็จ', async () => {
  const fault = new Error('persistence unavailable')
  const save = mock.fn(async () => { throw fault })
  await assert.rejects(
    createPartyUseCase({ name: 'พรรคทดสอบ', logoUrl: 'logo.png', policy: 'นโยบาย' }, 17, save),
    (error: unknown) => error === fault,
  )
  assert.equal(save.mock.callCount(), 1)
})
