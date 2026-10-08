import assert from 'node:assert/strict'
import test, { mock } from 'node:test'
import type { Request, Response, NextFunction } from 'express'
import { makeRequireAuth } from '../src/middlewares/AuthMiddleware'
import { requireRole } from '../src/middlewares/RoleMiddleware'

function context(authorization?: string, user?: { roles: string[] }) {
  const sent: { status?: number; body?: unknown } = {}
  const req = {
    headers: authorization === undefined ? {} : { authorization },
    body: user ? { user } : {},
  } as unknown as Request
  const res = {
    status(value: number) { sent.status = value; return this },
    json(value: unknown) { sent.body = value; return this },
  } as unknown as Response
  const next = mock.fn(() => {})
  return { req, res, next, sent }
}

test('UT-CP-009 ไม่มี Bearer Token ต้องตอบ 401 โดยไม่เรียกบริการตรวจสอบตัวตน', async () => {
  const c = context()
  const lookup = mock.fn(async (_token: string): Promise<any> => null)
  await makeRequireAuth(lookup)(c.req, c.res, c.next as NextFunction)
  assert.equal(c.sent.status, 401)
  assert.equal(lookup.mock.callCount(), 0)
  assert.equal(c.next.mock.callCount(), 0)
})

test('UT-CP-010 Token ไม่ถูกต้องต้องตอบ 401', async () => {
  const c = context('Bearer invalid-token')
  const lookup = mock.fn(async (_token: string): Promise<any> => null)
  await makeRequireAuth(lookup)(c.req, c.res, c.next as NextFunction)
  assert.equal(c.sent.status, 401)
  assert.equal(lookup.mock.callCount(), 1)
  assert.equal(c.next.mock.callCount(), 0)
})

test('UT-CP-011 ผู้ใช้ไม่มีสิทธิ์ EC ต้องตอบ 403 และไม่เรียก next', () => {
  const c = context(undefined, { roles: ['VOTER'] })
  requireRole('EC')(c.req, c.res, c.next as NextFunction)
  assert.equal(c.sent.status, 403)
  assert.equal(c.next.mock.callCount(), 0)
})

test('UT-CP-019 Token ถูกต้องและมีผู้ใช้ ต้องส่งต่อ Middleware', async () => {
  const c = context('Bearer valid-token')
  const user = { id: 8, roles: ['EC'] }
  const lookup = mock.fn(async (_token: string): Promise<any> => ({ data: user }))
  await makeRequireAuth(lookup)(c.req, c.res, c.next as NextFunction)
  assert.equal(c.next.mock.callCount(), 1)
  assert.deepEqual(c.req.body.user, user)
})

test('UT-CP-020 ผู้ใช้มีสิทธิ์ EC ต้องผ่าน Authorization', () => {
  const c = context(undefined, { roles: ['EC'] })
  requireRole('EC')(c.req, c.res, c.next as NextFunction)
  assert.equal(c.next.mock.callCount(), 1)
})

test('UT-CP-021 Token ที่ทำให้บริการโยนข้อผิดพลาดต้องตอบ 401', async () => {
  const c = context('Bearer expired-token')
  const lookup = mock.fn(async (_token: string): Promise<any> => { throw new Error('expired') })
  await makeRequireAuth(lookup)(c.req, c.res, c.next as NextFunction)
  assert.equal(c.sent.status, 401)
  assert.equal(c.next.mock.callCount(), 0)
})
