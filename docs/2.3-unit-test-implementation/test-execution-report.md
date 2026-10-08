# รายงานผลการรัน Unit Tests (Test Execution Report)

## รอบที่ 1 — ผลการทดสอบยืนยันจากเครื่องผู้พัฒนา

**วันที่บันทึกผล:** 8 ตุลาคม 2026  
**ที่มาของหลักฐาน:** Terminal Output จาก Git Bash บน Windows ซึ่งผู้พัฒนาส่งมาในบทสนทนา  
**Repository:** `Grimstoey/Unit-Testing_Election`  
**Branch ขณะทดสอบ:** `vnv/election-unit-testing`  
**Commit SHA ที่รันจริง:** ไม่ปรากฏใน Terminal Output จึงยังไม่สามารถระบุ SHA ของสำเนาในเครื่องได้อย่างมั่นใจ

> ผลต่อไปนี้เป็นผลการทดสอบที่ผู้พัฒนารันในเครื่องและส่ง Output มาให้ตรวจสอบ ไม่ใช่การรันโดย GitHub Actions หรือโดยผู้เขียนเอกสารในสภาพแวดล้อมของ GitHub

### 1. คำสั่งที่รัน

```bash
npm run build
npm test
```

ก่อนหน้านี้พบข้อผิดพลาดระหว่าง Generate Prisma Client เนื่องจากไม่มี `DIRECT_URL` และมี TypeScript Errors จาก Client ที่ยังไม่ได้ Generate แต่ในการรันรอบที่ส่งมา `npm run build` จบโดยไม่มี Error และ `npm test` ทำงานจนเสร็จ

### 2. ผลการ Build

| รายการ | ผลลัพธ์ | หลักฐาน |
|---|---|---|
| `npm run build` | **สำเร็จ** | Terminal แสดง `tsc && tsc-alias` แล้วเข้าสู่คำสั่ง `npm test` โดยไม่มีข้อความ Error |

### 3. ผล Unit Tests รอบแรก

| ตัวชี้วัด | ผลลัพธ์ |
|---|---:|
| Tests ทั้งหมด | **11** |
| Passed | **11** |
| Failed | **0** |
| Cancelled | **0** |
| Skipped | **0** |
| Todo | **0** |
| Suites (ตาม Node.js Test Runner) | **0** |
| ระยะเวลารวม | **295.4625 ms** |

**ข้อควรระวัง:** 11/11 ผ่าน หมายถึงอัตราผ่านของ *กรณีที่รันในรอบนี้* เท่านั้น ไม่ได้หมายถึง Code Coverage 100% หรือทดสอบระบบ Election ครบทุกฟีเจอร์

### 4. ผลแต่ละ Test Case

| Test ID | วัตถุประสงค์ / ชื่อที่รัน | ผล | เวลา (ms) |
|---|---|---|---:|
| UT-CP-001 | Happy Path รับข้อมูลพรรคครบถ้วน | PASS | 2.5828 |
| UT-CP-002 | ปฏิเสธเมื่อไม่ส่งชื่อพรรค | PASS | 0.3104 |
| UT-CP-003 | ปฏิเสธเมื่อไม่ส่ง logoUrl | PASS | 0.2294 |
| UT-CP-004 | ปฏิเสธเมื่อไม่ส่ง policy | PASS | 0.1326 |
| UT-CP-005 | ปฏิเสธชื่อพรรคที่เป็นช่องว่างล้วน | PASS | 0.2131 |
| UT-CP-006 | ปฏิเสธนโยบายที่เป็นช่องว่างล้วน | PASS | 0.1282 |
| UT-CP-007 | ปฏิเสธ null, String ว่าง และช่องว่างล้วนของฟิลด์บังคับ | PASS | 0.2415 |
| UT-CP-008 | ตัดช่องว่างต้นและท้ายของชื่อพรรคและนโยบาย | PASS | 0.1370 |
| UT-CP-015 | Stub คืนข้อมูลจำลองโดยไม่ต้องใช้ฐานข้อมูล | PASS | 1.7758 |
| UT-CP-016 | Spy ยืนยันว่าไม่เรียก Dependency เมื่อข้อมูลไม่ถูกต้อง | PASS | 0.8723 |
| UT-CP-017 | Mock ตรวจ Argument ของการบันทึก รวมถึง User ID | PASS | 0.4639 |

**หมายเหตุเรื่องความหมายของการทดสอบ:** UT-CP-017 ใช้ฟังก์ชันบันทึกที่จำลองขึ้นเพื่อตรวจ Argument ของ Use Case ไม่ใช่การทดสอบการเรียก `prisma.party.create()` ภายใน Repository โดยตรง และ UT-CP-001 ตรวจการผ่าน Validation ไม่ใช่การทดสอบ HTTP แบบ End-to-End

### 5. ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | บทบาท |
|---|---|
| `src/utils/validateCreateParty.ts` | ตรวจค่าว่างและปรับรูปแบบข้อมูล |
| `src/services/createPartyUseCase.ts` | Logic การสร้างพรรคที่ฉีด Dependency ได้ |
| `src/services/PartyService.ts` | เรียก Use Case จาก Service เดิม |
| `tests/party-validation.test.ts` | UT-CP-001 ถึง UT-CP-008 |
| `tests/create-party-use-case.test.ts` | UT-CP-015 ถึง UT-CP-017 (Stub, Spy, Mock) |
| `package.json` | `npm test` เรียก `tsx --test tests/*.test.ts` |

### 6. ผลสรุปและข้อจำกัด

การ Build และ Unit Tests ทั้ง 11 กรณี **ผ่านจากผลการรันที่ได้รับ** จึงถือเป็นหลักฐาน Milestone รอบแรก โดยยืนยันได้เฉพาะเงื่อนไขที่มี Test แล้ว

สิ่งที่ยังไม่ได้วัดหรือยืนยัน ได้แก่ Code Coverage, การทำงานร่วมกับ PostgreSQL จริง, การทดสอบ API, ความสมบูรณ์ของระบบทั้งหมด และการรันซ้ำบนเครื่องอื่น ยังไม่มีค่าเวอร์ชัน Node.js/npm หรือ Commit SHA ของเครื่องผู้ทดสอบในหลักฐานที่ได้รับ

## รอบถัดไป — งานที่ยังต้องทำ

1. เขียนและรัน Authentication/Authorization Tests (UT-CP-009–011)
2. เขียนและรัน Audit Fields, Duplicate Name และ Error Handling (UT-CP-012–014)
3. เพิ่ม `@faker-js/faker`, ปรับ Lockfile ให้ถูกต้อง และเขียน UT-CP-018
4. รัน Build และ Test Suite ทั้งหมดซ้ำ จากนั้นบันทึกผลรอบใหม่โดยไม่แทนที่หลักฐานรอบนี้
5. ปรับ README หลักให้ผู้ประเมินติดตั้งและรันได้ และสรุป Code Comparison ฉบับสุดท้าย

## วิธีรันทดสอบซ้ำบนเครื่อง

```bash
git fetch origin
git switch vnv/election-unit-testing
npm ci
# หากยังไม่มี Prisma Client ต้องกำหนด DIRECT_URL ใน Environment ก่อน
npx prisma generate
npm run build
npm test
```

การ Generate Prisma Client ไม่จำเป็นต้องเชื่อมต่อฐานข้อมูลจริง แต่ค่า `DIRECT_URL` อาจต้องมีอยู่เพื่อให้ Prisma Config โหลดได้ ทั้งนี้อย่าใช้ URL ตัวอย่างเพื่อทำ Migration กับฐานข้อมูลจริง
