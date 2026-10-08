# รายงานการวัด Code Coverage ของ Create Political Party

## ขอบเขตและเครื่องมือ

ใช้ Node.js Test Runner พร้อม V8 Coverage ผ่าน `node --import tsx --test --experimental-test-coverage` เพื่อวัดเส้นทางโค้ดที่ทำงานระหว่างรัน Unit Tests ในไฟล์ `tests/*.test.ts`

กำหนดขอบเขตเฉพาะไฟล์ที่เกี่ยวข้องโดยตรงกับชุด Unit Tests:

- `src/utils/validateCreateParty.ts`
- `src/services/createPartyUseCase.ts`
- `src/middlewares/AuthMiddleware.ts`
- `src/middlewares/RoleMiddleware.ts`
- `src/middlewares/PrismaErrorHandler.ts`
- `src/repositories/PartyRepository.ts`

## วิธีรัน

```bash
export DIRECT_URL="postgresql://test:test@localhost:5432/election_test"
export JWT_SECRET="unit-test-only-secret-not-for-production"
export JWT_EXPIRES_IN="1h"
npx prisma generate
npm run build
npm test
npm run test:coverage
```

คำสั่ง `test:coverage` แสดงตาราง Coverage บน Terminal โดยมี Line, Branch และ Function Coverage ของไฟล์ที่เข้าเกณฑ์ตามตัวกรอง V8 Coverage; ค่า Statement Coverage แยกต่างหากไม่ได้รายงานด้วยคำสั่งนี้ จึงไม่ประมาณหรือใช้ Line Coverage แทน Statement Coverage

GitHub Actions เรียกคำสั่งเดียวกัน และเก็บไฟล์ V8 Raw Coverage เป็น Artifact สำหรับตรวจสอบรายละเอียดเพิ่มเติม

## ผลการตรวจสอบและการแปลผล

ให้ยึดผลจากการรันจริงในการรายงานค่าร้อยละของแต่ละไฟล์ แยกกรณีที่ยังไม่ทดสอบของ Service หรือ Repository ออกจากส่วนที่มี Test Double ครอบคลุมแล้ว

ค่าการผ่าน Unit Tests (21/21) ไม่ได้เป็น Code Coverage 100% การวัดแบบ V8 อาจรวมรายละเอียดของไฟล์ที่ถูกโหลดขณะทดสอบ และ Coverage ของ TypeScript ผ่าน Runtime Transformation ควรพิจารณา Source Mapping และขอบเขตการวัดร่วมด้วย

หากพบ Branch หรือ Function ที่ยังไม่ครอบคลุม ต้องพิจารณาความเสี่ยงและ Requirement ก่อนเพิ่ม Test Cases
