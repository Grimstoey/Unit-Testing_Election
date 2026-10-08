# รายงานผลการทดสอบ Unit Testing — ระบบ Election

## 1. ขอบเขตของการทดสอบ

ดำเนินการทดสอบฟีเจอร์สร้างพรรคการเมืองด้วย Node.js Test Runner และ `tsx` เพื่อประเมินความถูกต้องของ Input Validation, Create Party Use Case, Authentication/Authorization Middleware, Persistence Mapping และการจัดการข้อผิดพลาด

## 2. คำสั่งที่ใช้ทดสอบ

```bash
npm run build
npm test
```

การ Generate Prisma Client ด้วย `npx prisma generate` จำเป็นต้องกำหนด `DIRECT_URL` ให้ Prisma Config โหลดได้ แต่ Unit Tests ที่ใช้ Test Double ไม่จำเป็นต้องเชื่อมต่อ PostgreSQL จริง

## 3. ผลการทดสอบที่ยืนยันแล้ว

**วันที่ทดสอบ:** 8 ตุลาคม 2026  
**Branch:** `vnv/election-unit-testing`  
**Build:** `tsc && tsc-alias` สำเร็จโดยไม่มี Error

| รายการ | จำนวน |
|---|---:|
| Tests | **11** |
| Passed | **11** |
| Failed | **0** |
| Cancelled | **0** |
| Skipped | **0** |
| Todo | **0** |
| เวลารวม | **295.4625 ms** |

| Test ID | ผล | เวลา (ms) |
|---|---|---:|
| UT-CP-001 | PASS | 2.5828 |
| UT-CP-002 | PASS | 0.3104 |
| UT-CP-003 | PASS | 0.2294 |
| UT-CP-004 | PASS | 0.1326 |
| UT-CP-005 | PASS | 0.2131 |
| UT-CP-006 | PASS | 0.1282 |
| UT-CP-007 | PASS | 0.2415 |
| UT-CP-008 | PASS | 0.1370 |
| UT-CP-015 | PASS | 1.7758 |
| UT-CP-016 | PASS | 0.8723 |
| UT-CP-017 | PASS | 0.4639 |

ผลผ่าน 11/11 หมายถึงกรณีทดสอบที่รันในผลบันทึกนี้ ไม่ใช่ Code Coverage 100% และไม่ใช่การยืนยันว่าระบบ Election ทุกฟีเจอร์ทำงานถูกต้อง

## 4. ผลการทดสอบจาก GitHub Actions

ชุดทดสอบปัจจุบันถูกตรวจสอบอัตโนมัติด้วย GitHub Actions บน Ubuntu และ Node.js 22 โดยดำเนินการตามลำดับ `npm ci`, `npx prisma generate`, `npm run build` และ `npm test` ซึ่งทุกขั้นตอนสำเร็จ

**หลักฐาน:** [Election Unit Tests — GitHub Actions Run #37763536100](https://github.com/Grimstoey/Unit-Testing_Election/actions/runs/37763536100)  
**Commit ที่ตรวจสอบ:** `90bf85727eb6f7745980588729cc002f583cbcda`  
**ผล Workflow:** SUCCESS

| รายการ | ผลลัพธ์ |
|---|---:|
| Tests | **21** |
| Passed | **21** |
| Failed | **0** |
| Skipped | **0** |
| ระยะเวลารวม | **1318.302429 ms** |
| TypeScript Build | **PASS** |

ผลทดสอบนี้ครอบคลุม `UT-CP-001` ถึง `UT-CP-021` รวมกรณี Authentication, Authorization, Audit Mapping, Duplicate Error, Internal Error และ Faker ที่เพิ่มจากชุดเดิม โดยอ้างอิงผลจาก Workflow จริง ไม่ใช่การอนุมานจากไฟล์ Test

## 5. ชุดทดสอบใน Source Code ปัจจุบัน

| ไฟล์ | กรณีที่มีโค้ด |
|---|---|
| `tests/party-validation.test.ts` | UT-CP-001–008 |
| `tests/auth-and-role.test.ts` | UT-CP-009–011, 019–021 |
| `tests/party-persistence-and-errors.test.ts` | UT-CP-012–014 |
| `tests/create-party-use-case.test.ts` | UT-CP-015–017 |
| `tests/party-faker.test.ts` | UT-CP-018 |

ผล 11 Tests ในหัวข้อก่อนหน้าเป็นผลการทดสอบรอบแรก ส่วนผลล่าสุด 21 Tests ได้รับการยืนยันจาก GitHub Actions Run ที่อ้างอิงในหัวข้อ 4

## 6. การทำซ้ำการทดสอบ

```bash
npm ci
export DIRECT_URL="postgresql://test:test@localhost:5432/election_test"
npx prisma generate
npm run build
npm test
```

ค่า `DIRECT_URL` ในตัวอย่างใช้เพื่อโหลด Prisma Config สำหรับ Unit Testing เท่านั้น ไม่ใช่ฐานข้อมูลที่มีอยู่จริงหรือใช้รัน Migration

## 7. ขอบเขตของผลทดสอบ

Unit Tests ที่ใช้ Dependency จำลองไม่ยืนยันการเชื่อมต่อฐานข้อมูล การบังคับ Unique Constraint โดย PostgreSQL การสร้าง Timestamp จากฐานข้อมูลจริง และพฤติกรรมหน้าเว็บแบบ End-to-End ส่วน Test Pass Rate และ Code Coverage เป็นคนละตัวชี้วัด โดยยังไม่มีค่า Coverage ที่วัดยืนยันในรายงานนี้
