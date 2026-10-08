# 2.3 การพัฒนา Unit Tests

## 1. เครื่องมือทดสอบ

โปรเจกต์ใช้ TypeScript, Node.js Test Runner และ `tsx` ในการรันไฟล์ `*.test.ts` โดยใช้ `node:assert/strict` สำหรับ Assertions และ `node:test` สำหรับสร้าง Test และ Test Double ส่วนข้อมูลสุ่มใช้ `@faker-js/faker`

คำสั่งรัน:

```bash
npm test
```

## 2. การทดสอบตามข้อกำหนดการบ้าน

| ประเภท | ตัวอย่างการใช้งาน | ไฟล์ที่มีโค้ด |
|---|---|---|
| Happy Path | UT-CP-001 ตรวจข้อมูลถูกต้อง | `tests/party-validation.test.ts` |
| Failure | UT-CP-002 ตรวจไม่ส่งชื่อพรรค | `tests/party-validation.test.ts` |
| Stub | UT-CP-015 จำลองค่าพรรคที่บันทึกสำเร็จ | `tests/create-party-use-case.test.ts` |
| Spy | UT-CP-016 ตรวจว่า Dependency ไม่ถูกเรียกเมื่อข้อมูลไม่ถูกต้อง | `tests/create-party-use-case.test.ts` |
| Mock | UT-CP-017 จำลองฟังก์ชันบันทึกและตรวจ Argument | `tests/create-party-use-case.test.ts` |
| Faker | UT-CP-018 สร้าง Test Data แบบสุ่มห้าชุด | `tests/party-faker.test.ts` |

**Stub** ให้ค่าตอบกลับที่กำหนดไว้แทน Dependency จริง **Spy** ใช้บันทึกจำนวนและรายละเอียดการเรียกฟังก์ชัน ส่วน **Mock** ใช้กำหนดพฤติกรรมที่คาดหวังพร้อมตรวจ Interaction ทั้งสามแบบเป็นรูปแบบ Test Double ซึ่งอาจใช้งานร่วมกับ API ของ `node:test` ได้

## 3. การทดสอบเพิ่มเติม

ชุดทดสอบครอบคลุมการตรวจสอบ Token, EC Role, การแมป Audit Fields, Prisma P2002 และ Internal Server Error โดยอยู่ในไฟล์ `tests/auth-and-role.test.ts` และ `tests/party-persistence-and-errors.test.ts`

กรณีทดสอบเพิ่มเติมเพื่อวิเคราะห์ Coverage อยู่ใน `tests/coverage-gap.test.ts` (UT-CP-022–028) โดยผลการรันและเปรียบเทียบก่อน–หลังแสดงใน [Coverage Report](./coverage-report.md)

## 4. วิธีการทดสอบ

1. ติดตั้ง Dependency ด้วย `npm ci`
2. กำหนด `DIRECT_URL` สำหรับโหลด Prisma Config
3. สร้าง Prisma Client ด้วย `npx prisma generate`
4. ตรวจสอบการ Compile ด้วย `npm run build`
5. รันชุด Unit Tests ด้วย `npm test`

ตัวอย่าง URL สำหรับการรัน Unit Tests ที่จำลองฐานข้อมูล (ห้ามใช้กับ Migration จริง):

```bash
export DIRECT_URL="postgresql://test:test@localhost:5432/election_test"
export JWT_SECRET="unit-test-only-secret-not-for-production"
export JWT_EXPIRES_IN="1h"
npx prisma generate
npm run build
npm test
```

เมื่อต้องการวัด Coverage ให้รัน `npm run test:coverage` หลังตั้งค่า Environment และ Generate Prisma Client แล้ว อ่านวิธีวัดและการแปลผลได้ที่ [Coverage Report](./coverage-report.md)

สามารถดูผลที่ยืนยันแล้วและข้อจำกัดของการทดสอบได้ใน [Test Execution Report](./test-execution-report.md)
