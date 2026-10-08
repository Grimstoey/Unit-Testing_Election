# รายงานผล Code Coverage — Create Political Party

## ขอบเขตการตรวจสอบ

วัด Coverage ด้วย Node.js 22 Test Runner และ V8 Coverage ตามคำสั่ง `npm run test:coverage` โดยเลือกวิเคราะห์ 6 ไฟล์ที่เกี่ยวข้องกับการสร้างพรรคการเมืองและกระบวนการทดสอบที่มีอยู่ ไม่ได้วัด Code Coverage ของโปรเจกต์ Election ทั้งหมด

**หลักฐานที่ตรวจสอบได้:** [GitHub Actions Run #37766547423](https://github.com/Grimstoey/Unit-Testing_Election/actions/runs/37766547423) และ [V8 Coverage Artifact](https://github.com/Grimstoey/Unit-Testing_Election/actions/runs/37766547423/artifacts/11543719679)

## ผลการทดสอบและ Coverage

GitHub Actions รัน `npm ci`, `npx prisma generate`, `npm run build`, `npm test` และ `npm run test:coverage` สำเร็จ โดยในการรันพร้อม Coverage มี **21 Passed, 0 Failed** ใช้เวลา **1096.582652 ms**

| ไฟล์ที่วัด | Line (%) | Branch (%) | Function (%) |
|---|---:|---:|---:|
| `AuthMiddleware.ts` | 100.00 | 95.65 | 90.00 |
| `PrismaErrorHandler.ts` | 78.48 | 70.00 | 100.00 |
| `RoleMiddleware.ts` | 100.00 | 100.00 | 100.00 |
| `PartyRepository.ts` | 76.09 | 92.86 | 47.83 |
| `createPartyUseCase.ts` | 100.00 | 92.31 | 100.00 |
| `validateCreateParty.ts` | 100.00 | 94.44 | 100.00 |
| **รวมเฉพาะไฟล์ที่เลือก** | **86.82** | **90.29** | **80.60** |

ค่าร้อยละคำนวณโดยเครื่องมือ Coverage จากบรรทัด คำสั่งสาขา และฟังก์ชันที่วัดได้จริง ไม่ใช่ค่าเฉลี่ยเลขคณิตอย่างง่ายของหกไฟล์

### แผนภาพเปรียบเทียบ Coverage รายไฟล์

```mermaid
xychart-beta
  title "Line Coverage ของไฟล์ที่เกี่ยวข้อง (%)"
  x-axis ["Auth", "Error", "Role", "Repository", "UseCase", "Validator"]
  y-axis "Line %" 0 --> 100
  bar [100, 78.48, 100, 76.09, 100, 100]
```

## การวิเคราะห์ช่องว่างของการทดสอบ

- **`PartyRepository.ts`:** Function Coverage 47.83% เป็นค่าต่ำสุดของกลุ่ม เพราะ Repository มีฟังก์ชัน CRUD และ Pagination อื่น ๆ ที่ไม่ได้อยู่ในขอบเขตการทดสอบ Create Political Party โดยตรง สำหรับการสร้างพรรคมีการใช้ Test Double ตรวจว่าจัดส่ง `createdBy` และ `updatedBy` ถูกต้อง แต่ยังไม่ยืนยันพฤติกรรมกับ PostgreSQL จริง
- **`PrismaErrorHandler.ts`:** Line Coverage 78.48% และ Branch Coverage 70% ยังมีเส้นทางจัดการข้อผิดพลาดที่ไม่ได้กระตุ้นในการทดสอบครั้งนี้ โดยรายงานระบุ Uncovered Lines 52, 54–64, 67–68 และ 74–76
- **`AuthMiddleware.ts`:** Line Coverage 100% แต่ Branch 95.65% และ Function 90.00% จึงยังไม่ครบทุกกรณีในรายงาน Coverage
- **`validateCreateParty.ts` และ `createPartyUseCase.ts`:** Line Coverage 100% แต่ Branch Coverage ยังต่ำกว่า 100% เป็นหลักฐานว่าการรันครบทุกบรรทัดไม่ได้เท่ากับการทดสอบครบทุกเงื่อนไข
- **`RoleMiddleware.ts`:** รายงาน 100% ทั้งสามตัวชี้วัดสำหรับไฟล์นี้ภายใต้ชุดทดสอบที่รัน

## ข้อสรุปด้าน V&V

ผล Unit Tests **ผ่าน 21/21** และสามารถยืนยันการวัด Line, Branch และ Function Coverage ตามตารางได้ อย่างไรก็ตาม Coverage ที่สูงไม่ได้พิสูจน์ความถูกต้องของทุก Requirement และไม่ได้ทดแทน Integration Test ที่ตรวจฐานข้อมูลจริง

การเพิ่ม Tests ควรพิจารณาความสำคัญของเส้นทางที่ขาดก่อน โดยให้ความสำคัญกับเส้นทาง Error Handler และเงื่อนไขของฟีเจอร์ Create Political Party มากกว่าการเพิ่มกรณีของ CRUD อื่นที่อยู่นอกขอบเขตงาน

## การรันทดสอบซ้ำ

```bash
export DIRECT_URL="postgresql://test:test@localhost:5432/election_test"
export JWT_SECRET="unit-test-only-secret-not-for-production"
export JWT_EXPIRES_IN="1h"
npm ci
npx prisma generate
npm run build
npm run test:coverage
```

คำสั่งนี้ใช้ URL ตัวอย่างเพื่อให้ Prisma Config ทำงานได้ ไม่ควรใช้ตัวอย่าง URL นี้เพื่อ Migration หรือเชื่อมต่อฐานข้อมูลใช้งานจริง

**ข้อจำกัดการรายงาน:** Node.js Test Runner แสดง Line, Branch และ Function Coverage โดยไม่มีค่า Statement Coverage แยกต่างหาก จึงไม่ใช้ตัวเลข Line Coverage อ้างเป็น Statement Coverage
