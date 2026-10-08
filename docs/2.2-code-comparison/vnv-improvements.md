# บันทึกการปรับปรุงโค้ดตามหลัก Verification & Validation (V&V)

## 1. วัตถุประสงค์ในการเปรียบเทียบ

ใช้ Branch `main` เป็นโค้ดต้นฉบับจากวิชา Backend และ Branch `vnv/election-unit-testing` เป็นโค้ดที่เพิ่มการตรวจสอบข้อมูล การแยก Dependency และ Unit Tests **โดยไม่แก้ไข `main`**

การเปรียบเทียบนี้เป็น Milestone ระยะแรก ไม่ใช่รายงานสรุปงานทั้งหมด

## 2. ปัญหาหรือข้อจำกัดที่พบในโค้ดเดิม

1. `package.json` ตั้งค่า `npm test` ให้จบด้วย `no test specified` จึงยังไม่มี Test Suite ให้รัน
2. `createPartyService` ส่งข้อมูลการสร้างพรรคไปยัง Repository โดยตรง โดยไม่มี Validation หรือการตัดช่องว่างใน Service
3. Controller อ่านข้อมูลผู้ใช้จาก `req.body.user` ที่ `requireAuth` ใส่ไว้ และ Route มี `requireRole(RoleName.EC)`; จำเป็นต้องทดสอบว่าการตอบกลับ 401 และ 403 ยังถูกต้อง
4. `PrismaErrorHandler` มีการจัดการ Prisma P2002 ให้เป็น HTTP 409 อยู่แล้ว จึงต้องรักษาพฤติกรรมนี้เมื่อขยาย Tests

## 3. สิ่งที่เปลี่ยนแปลงใน Branch การบ้าน

| รายการเปลี่ยนแปลง | สิ่งที่เปลี่ยน / เหตุผล | Test ที่เกี่ยวข้อง | สถานะ ณ Milestone 1 |
|---|---|---|---|
| เพิ่ม `validateCreateParty.ts` | ตรวจฟิลด์บังคับและจัดรูปแบบชื่อ/นโยบายตาม FR-10–FR-12 | UT-CP-001–008 | **เขียนและรันผ่าน 8 กรณี** |
| เพิ่ม `createPartyUseCase.ts` | รับฟังก์ชันบันทึกข้อมูลจากภายนอก (Dependency Injection) เพื่อไม่ต้องเชื่อมต่อฐานข้อมูลจริงใน Unit Test | UT-CP-015–017 | **เขียนและรันผ่าน 3 กรณี** |
| ปรับ `PartyService.ts` | ส่งงานการสร้างพรรคผ่าน Use Case ใหม่ที่ตรวจข้อมูลก่อนเรียก Repository | UT-CP-001–008, 015–017 | Build ผ่าน; ต้องเพิ่ม Tests ระดับ Service/Controller ตามกรณี |
| ปรับ `package.json` | ใช้ `tsx --test tests/*.test.ts` เพื่อสั่งรัน Unit Tests | ทั้ง 11 กรณี | **`npm test` ผ่าน** |
| เพิ่ม Faker | ต้องสร้างข้อมูลสุ่มตามโจทย์ข้อ 2.3.6 | UT-CP-018 | ยังไม่ดำเนินการ |
| เพิ่ม Tests ของ Authentication/Authorization | ยืนยันความถูกต้องตาม FR-02, FR-03 | UT-CP-009–011 | ยังไม่ดำเนินการ |
| เพิ่ม Tests ของ Audit, Duplicate และ Error Handling | ยืนยัน FR-05, FR-07, FR-09 และ Regression | UT-CP-012–014 | ยังไม่ดำเนินการ |

## 4. ส่วนที่คงเดิม

- เส้นทาง API `POST /ec/parties` ใน `ECRoutes.ts` ยังคงใช้ Middleware `requireAuth` และ `requireRole(RoleName.EC)`
- `PartyRepository.ts` ยังคงใช้ Prisma และกำหนด `createdBy` กับ `updatedBy` จาก User ID
- `prisma/schema.prisma` ยังคงกำหนด `party.name @unique` และ Timestamp
- การทดสอบระดับ Unit ในรอบแรกไม่ได้เปลี่ยนโครงสร้างฐานข้อมูลหรือ API Endpoint

การคงโค้ดเดิมไว้ไม่ได้หมายความว่าพฤติกรรมทุกส่วนผ่านการทดสอบแล้ว ส่วนที่ยังไม่มี Test ต้องตรวจสอบใน Milestone ถัดไป

## 5. หลักฐานผลทดสอบครั้งแรก (8 ตุลาคม 2026)

ผู้พัฒนารันบน Git Bash ใน Windows ที่ Branch `vnv/election-unit-testing` และส่งผล Terminal ดังนี้:

```text
> npm run build
> tsc && tsc-alias
(ไม่มี TypeScript Error)

> npm test
> tsx --test tests/*.test.ts

tests 11
pass 11
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 295.4625
```

**ผลที่ยืนยันได้:** Build สำเร็จ และ Test ที่รันทั้งหมดผ่าน 11/11 กรณี โดยไม่มี Failed/Skipped

**ข้อจำกัด:** ยังไม่ได้วัด Code Coverage ไม่สามารถยืนยัน Commit SHA ของสำเนาในเครื่องจาก Output ที่ส่งมา และยังไม่ยืนยันความครบถ้วนของข้อกำหนดทุกข้อหรือผลของ Integration/API Testing ดูรายละเอียดผลแต่ละกรณีใน [รายงานผลการรัน](../2.3-unit-test-implementation/test-execution-report.md)

## 6. ข้อเสนอสำหรับ Milestone ถัดไป

ทำ Tests ที่ยังขาดและบันทึกผลเป็นรอบแยกต่างหาก ก่อนจัดทำตารางเปรียบเทียบก่อน/หลังฉบับสมบูรณ์ พร้อมอ้างอิง Git Diff และ Test Case ที่พิสูจน์การเปลี่ยนแปลงแต่ละจุด
