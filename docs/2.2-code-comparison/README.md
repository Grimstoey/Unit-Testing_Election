# 2.2 การเปรียบเทียบ Source Code ก่อนและหลังใช้หลัก V&V

## ขอบเขตการเปรียบเทียบ

ใช้ `main` เป็น Source Code ต้นฉบับของงาน Backend และ `vnv/election-unit-testing` เป็นเวอร์ชันที่เพิ่มเติม Validation, Dependency Injection และ Automated Unit Testing โดยไม่ Merge เปลี่ยนแปลงกลับเข้า `main`

สามารถตรวจสอบความแตกต่างด้วยคำสั่ง:

```bash
git fetch origin
git diff origin/main...origin/vnv/election-unit-testing
```

## สิ่งที่คงเดิม

- Endpoint `POST /ec/parties` และลำดับ `requireAuth` → `requireRole(RoleName.EC)` → Controller
- โครงสร้างพรรคใน Prisma Schema เช่น `name @unique`, `logoUrl`, `policy` และฟิลด์ Audit
- การจัดการข้อผิดพลาด P2002 เป็น 409 ที่ `PrismaErrorHandler.ts`
- หลักการที่ Repository ใช้ Prisma บันทึกข้อมูลพรรค

## สิ่งที่เปลี่ยนแปลง

| ไฟล์ | ก่อนปรับปรุง | หลังปรับปรุง | เหตุผล |
|---|---|---|---|
| `package.json` | `npm test` ไม่เรียก Test Suite | ใช้ `tsx --test tests/*.test.ts` และมี Faker | ทำให้ทดสอบซ้ำด้วยคำสั่งเดียวได้ |
| `package-lock.json` | ไม่มี Faker | ระบุ Faker เวอร์ชันที่ใช้ | ให้ Dependency สอดคล้องกัน |
| `src/utils/validateCreateParty.ts` | ไม่มีหน่วยตรวจข้อมูลนี้ | เพิ่มฟังก์ชัน Validation | ตรวจ Required Fields และช่องว่างตาม FR-10–12 |
| `src/services/createPartyUseCase.ts` | ไม่มีการแยก Use Case นี้ | รับ `writeParty` เป็น Dependency | ทดสอบด้วย Stub/Spy/Mock ได้ |
| `src/services/PartyService.ts` | เรียก Repository ตรง | เรียก Use Case ก่อนบันทึก | ตรวจข้อมูลก่อนเรียก Persistence |
| `src/middlewares/AuthMiddleware.ts` | เรียก `meService` โดยตรง | ใช้ `makeRequireAuth` พร้อมฉีด Lookup | แยก Unit Test ออกจากการยืนยันตัวตนจริง |
| `src/repositories/PartyRepository.ts` | ฟังก์ชันสร้างพรรคเรียก Prisma โดยตรง | แยก `makeCreateParty` และยังใช้ Prisma จริงใน Production | ตรวจ Audit Mapping ด้วย Mock |
| `tests/*.test.ts` | ไม่มี Unit Tests ชุดนี้ | เพิ่ม Test Cases ของ Validation, Role, Authentication, Persistence, Error, Faker | ตรวจผลลัพธ์และ Interaction |

การเปลี่ยนแปลงเน้น **Testability** และตรวจจับ Regression โดยคงโครงสร้าง API, Schema และ Business Rules เดิมเป็นหลัก ไม่ใช่การเปลี่ยนฟีเจอร์หรือขยายขอบเขตระบบโดยไม่มี Requirement

## ผลการตรวจสอบ

ตรวจสอบเวอร์ชันที่มี Unit Tests ครบ 21 กรณีด้วย GitHub Actions แล้ว: `npm ci`, `npx prisma generate`, `npm run build` และ `npm test` ผ่านทั้งหมด (21 Passed, 0 Failed) ตาม [Test Execution Report](../2.3-unit-test-implementation/test-execution-report.md) และ [หลักฐานการรัน](https://github.com/Grimstoey/Unit-Testing_Election/actions/runs/37763536100)

ดูรายละเอียดการปรับปรุงที่ [vnv-improvements.md](./vnv-improvements.md)
