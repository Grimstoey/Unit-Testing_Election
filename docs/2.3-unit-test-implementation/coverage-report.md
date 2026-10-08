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

## การเปรียบเทียบ Coverage ก่อนและหลังเพิ่ม Tests

เพิ่มกรณีทดสอบ `UT-CP-022` ถึง `UT-CP-028` สำหรับการจัดการ Prisma P2025/P2003/Unknown Error, การปกปิด Metadata ใน Production, การส่งต่อ Error เมื่อ Response Headers ถูกส่งแล้ว, Bearer Token ช่องว่าง และ Persistence Failure จากนั้นรัน GitHub Actions เพื่อเปรียบเทียบด้วยคำสั่งและขอบเขตไฟล์เดียวกัน

| Metric (GitHub Actions / Linux) | ก่อนเพิ่ม Tests (21 กรณี) | หลังเพิ่ม Tests (28 กรณี) | เปลี่ยนแปลง |
|---|---:|---:|---:|
| Line Coverage | 86.82% | **90.88%** | +4.06 จุดเปอร์เซ็นต์ |
| Branch Coverage | 90.29% | **90.99%** | +0.70 จุดเปอร์เซ็นต์ |
| Function Coverage | 80.60% | **80.60%** | 0.00 จุดเปอร์เซ็นต์ |
| PrismaErrorHandler — Line | 78.48% | **93.67%** | +15.19 จุดเปอร์เซ็นต์ |
| PrismaErrorHandler — Branch | 70.00% | **79.31%** | +9.31 จุดเปอร์เซ็นต์ |
| Passed Tests | 21 | **28** | +7 |

**หลักฐานก่อนเพิ่ม:** [GitHub Actions Run #37766547423](https://github.com/Grimstoey/Unit-Testing_Election/actions/runs/37766547423)  
**หลักฐานหลังเพิ่ม:** [GitHub Actions Run #37767512280](https://github.com/Grimstoey/Unit-Testing_Election/actions/runs/37767512280) — ผลรัน `npm run test:coverage` ผ่าน 28 กรณี

```mermaid
xychart-beta
  title "Scoped Coverage บน GitHub Actions: ก่อนและหลัง"
  x-axis ["Line ก่อน", "Line หลัง", "Branch ก่อน", "Branch หลัง", "Function ก่อน", "Function หลัง"]
  y-axis "ร้อยละ" 0 --> 100
  bar [86.82, 90.88, 90.29, 90.99, 80.60, 80.60]
```

Function Coverage ของ `PartyRepository.ts` ยังคง 47.83% เนื่องจากไฟล์มีฟังก์ชัน CRUD/Pagination ส่วนอื่นรวมอยู่ด้วยซึ่งอยู่นอกขอบเขต Create Political Party ส่วนเส้นทาง `PrismaErrorHandler` ที่ยังไม่ครอบคลุม ได้แก่ 67–68 และ 74–76 ตาม Output รอบหลัง การเพิ่ม Tests ถัดไปต้องพิจารณา Requirement/Risk ก่อน ไม่ควรเพิ่มเพียงเพื่อให้ตัวเลขเป็น 100%

## ความแตกต่างระหว่าง Windows กับ GitHub Actions

ผล **ก่อนเพิ่ม UT-CP-022–028** ใช้ชุดทดสอบ 21 กรณีเหมือนกัน แต่พบ Line Coverage ต่างกันเล็กน้อย:

| Metric | GitHub Actions (Linux, Node.js 22) | Windows (Node.js v22.14.0) | ส่วนต่าง |
|---|---:|---:|---:|
| Line Coverage | 86.82% | 85.47% | 1.35 จุดเปอร์เซ็นต์ |
| Branch Coverage | 90.29% | 90.29% | 0.00 จุดเปอร์เซ็นต์ |
| Function Coverage | 80.60% | 80.60% | 0.00 จุดเปอร์เซ็นต์ |

การทดสอบบน Windows ผ่าน **21/21** ใช้เวลา **1077.8876 ms** และการรันบน GitHub Actions ผ่าน **21/21** เช่นกัน

ตัวอย่างความแตกต่างรายไฟล์ที่พบ:

| ไฟล์ | Line: Linux | Line: Windows |
|---|---:|---:|
| `PrismaErrorHandler.ts` | 78.48% | 74.68% |
| `PartyRepository.ts` | 76.09% | 78.26% |
| `createPartyUseCase.ts` | 100.00% | 92.86% |
| `validateCreateParty.ts` | 100.00% | 97.22% |

ทั้งสองสภาพแวดล้อมใช้ Runtime และระบบปฏิบัติการต่างกัน ความแตกต่างอาจเกี่ยวข้องกับเวอร์ชัน Node.js/V8 หรือ Source Mapping ระหว่าง Runtime Transformation ของ TypeScript แต่ข้อมูลที่มีไม่สามารถระบุสาเหตุแน่ชัด จึงรายงานค่าจากแต่ละสภาพแวดล้อมแยกกัน และไม่กล่าวอ้างว่าเป็นการเปลี่ยนแปลงคุณภาพของ Source Code

**หมายเหตุ:** ตัวเลขหลังเพิ่ม Tests ในตารางก่อน–หลังเป็นผล GitHub Actions เท่านั้น ต้องรันทดสอบใหม่บน Windows เพื่อทราบผลของชุด 28 กรณีในสภาพแวดล้อมนั้น จึงไม่เปรียบเทียบ Windows ชุดเก่ากับ Linux ชุดใหม่ในฐานะผลก่อน–หลัง

---

## ข้อสรุปด้าน V&V

ผล Unit Tests **ผ่าน 28/28** ในการวัดรอบล่าสุดบน GitHub Actions และสามารถยืนยันการวัด Line, Branch และ Function Coverage ตามตารางได้ อย่างไรก็ตาม Coverage ที่สูงไม่ได้พิสูจน์ความถูกต้องของทุก Requirement และไม่ได้ทดแทน Integration Test ที่ตรวจฐานข้อมูลจริง

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
