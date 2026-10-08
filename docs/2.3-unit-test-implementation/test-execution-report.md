# รายงานการรัน Unit Tests (Test Execution Report)

## สถานะปัจจุบัน
ไฟล์ที่เพิ่มหรือปรับปรุงบน Branch `vnv/election-unit-testing` ได้แก่

| ไฟล์ | สิ่งที่ดำเนินการ |
|---|---|
| `src/utils/validateCreateParty.ts` | ตรวจข้อมูลบังคับ ปฏิเสธ null, ค่าว่าง และช่องว่างล้วน พร้อมตัดช่องว่างชื่อและนโยบาย |
| `src/services/createPartyUseCase.ts` | ใช้ Dependency Injection เพื่อจำลองการบันทึกโดยไม่ใช้ฐานข้อมูลจริง |
| `src/services/PartyService.ts` | ปรับการสร้างพรรคให้เรียก Use Case ที่แยกออกมา |
| `tests/party-validation.test.ts` | เขียน Test UT-CP-001–008 รวม 8 กรณี |
| `tests/create-party-use-case.test.ts` | เขียน Test UT-CP-015–017 รวม 3 กรณีสำหรับ Stub, Spy และ Mock |
| `package.json` | ตั้งค่า `npm test` เป็น `tsx --test tests/*.test.ts` |

**ผลการรัน: ยังไม่ยืนยัน (NOT VERIFIED)**

สามารถอ่านโค้ดผ่าน GitHub ที่เชื่อมไว้ได้ แต่ก่อนหน้านี้ไม่สามารถ Clone Repository มารันในสภาพแวดล้อมทดสอบได้เนื่องจากการเชื่อมต่อเครือข่าย จึง **ยังไม่มีหลักฐาน Pass/Fail จริง** รวมถึงยังไม่อ้างว่า Build ผ่าน

## งานที่ยังต้องดำเนินการ
1. เพิ่ม Authentication และ Authorization Tests (UT-CP-009–011)
2. เพิ่มการตรวจ Audit Fields, Duplicate และ Error Handling (UT-CP-012–014)
3. ติดตั้ง `@faker-js/faker` อย่างถูกต้อง ปรับ `package-lock.json` ให้สอดคล้อง และเขียน UT-CP-018
4. รัน `npm ci`, `npm run build`, `npm test` และแก้ไขข้อผิดพลาดหากพบ
5. ปรับปรุง README หลัก และจัดทำ Code Comparison ฉบับสมบูรณ์

## คำสั่งสำหรับตรวจสอบบนเครื่อง
```bash
git fetch origin
git switch vnv/election-unit-testing
npm ci
npm run build
npm test
```

เมื่อมีผลทดสอบแล้ว ต้องบันทึก Node.js/npm Version, Commit SHA, ผล Pass/Fail/Skip, รายละเอียดกรณีที่ล้มเหลว และหลักฐานประกอบ ไม่ให้สมมติผลขึ้นเอง
