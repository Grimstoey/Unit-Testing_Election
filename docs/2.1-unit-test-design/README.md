# 2.1 การออกแบบ Unit Test — ระบบ Election

## ขอบเขตและข้อมูลอ้างอิง
ฟีเจอร์ที่ศึกษา คือ **สร้างพรรคการเมือง (Create Political Party)** รหัส UC-EC-01 ผ่าน API `POST /ec/parties`

ใช้ข้อมูลจาก `Feature.docx` (FR-01 ถึง FR-12 และ BR-01 ถึง BR-05), แบบทดสอบเดิม TC-CP-001 ถึง TC-CP-013 และโค้ดต้นฉบับบน Branch `main`

การทดสอบ TC-CP เดิมดำเนินการผ่าน Postman ซึ่งเป็นการทดสอบระดับ API ไม่ใช่ Unit Test โดยอัตโนมัติ ดังนั้นงานนี้จะออกแบบการทดสอบแยกตามหน่วยของโปรแกรม และทดแทน Dependency ภายนอกด้วย Test Double

## หน่วยที่ต้องทดสอบ
| หน่วย | ไฟล์ที่เกี่ยวข้อง | การแยก Dependency | วัตถุประสงค์ |
|---|---|---|---|
| ตรวจสอบและจัดรูปแบบข้อมูล | `src/utils/validateCreateParty.ts` | ไม่พึ่งพาภายนอก | ปฏิเสธค่า missing, null, String ว่าง และช่องว่างล้วน พร้อมตัดช่องว่างต้น/ท้ายของชื่อและนโยบาย |
| กระบวนการสร้างพรรค | `src/services/createPartyUseCase.ts`, `src/services/PartyService.ts` | ฉีดฟังก์ชันบันทึกข้อมูลด้วย Dependency Injection | ตรวจสอบผลสำเร็จ/ล้มเหลวโดยไม่ต้องเชื่อมต่อฐานข้อมูลจริง |
| การจัดเตรียมข้อมูลบันทึกพรรค | `src/repositories/PartyRepository.ts` | Mock Prisma Client | ตรวจสอบการส่ง name, logoUrl, policy, createdBy และ updatedBy |
| Controller สำหรับสร้างพรรค | `src/controllers/PartyController.ts` | Stub Service และ Spy Response | ตรวจสอบการรับ/ส่งข้อมูลและ HTTP Status |
| Middleware ตรวจสอบตัวตนและสิทธิ์ | `src/middlewares/AuthMiddleware.ts`, `RoleMiddleware.ts` | Stub ข้อมูลผู้ใช้และ Spy `next()` | ตรวจสอบการตอบกลับ 401 และ 403 |

**ขอบเขต Unit Testing:** ไม่ต้องเปิด PostgreSQL, S3 หรือ HTTP Server จริง เพราะการทดสอบการเชื่อมต่อหลายระบบเป็นคนละระดับกับ Unit Testing

## เทคนิคออกแบบการทดสอบ
- **Equivalence Partitioning (EP):** แบ่งกลุ่มข้อมูลถูกต้อง/ไม่ถูกต้อง เช่น ไม่ส่งค่า, null, ข้อความว่าง หรือช่องว่างล้วน
- **Boundary Value Analysis (BVA):** พิจารณาค่าขอบเขต เช่น ความยาวเป็นศูนย์หรือหนึ่งตัวอักษร และไม่สมมติขีดจำกัดที่ไม่ได้กำหนดใน Requirements
- **Decision Testing:** ตรวจสอบทางเลือก เช่น เข้าสู่ระบบหรือไม่ มี Role EC หรือไม่ และข้อมูลผ่าน Validation หรือไม่
- **Risk-Based Testing:** จัดลำดับตามผลกระทบจากการเขียนข้อมูลผิด สิทธิ์ไม่ถูกต้อง ข้อมูลชื่อซ้ำ และข้อมูลภายในรั่วไหล
- **Interaction Verification:** ตรวจสอบว่ามีการเรียก Repository ด้วย Argument ถูกต้อง และไม่เรียกเมื่อข้อมูลไม่ผ่านการตรวจสอบ

## การเชื่อมโยง Requirements
| Requirement | พฤติกรรมที่ต้องตรวจสอบ | กรณีทดสอบ API เดิม |
|---|---|---|
| FR-01, FR-06, FR-08 | สร้างพรรคสำเร็จและตอบกลับ | TC-CP-001 |
| FR-02 | ไม่มี Token หรือ Token ใช้ไม่ได้ | TC-CP-006, 007 |
| FR-03 | ผู้ใช้ต้องมีสิทธิ์ EC | TC-CP-008 |
| FR-04, FR-12 | ข้อมูลบังคับต้องครบ | TC-CP-002, 003, 004, 010, 012 |
| FR-05 | ไม่อนุญาตชื่อซ้ำ | TC-CP-005 |
| FR-07 | บันทึกผู้สร้างและเวลา | TC-CP-009 |
| FR-09 | แจ้งเมื่อสร้างไม่สำเร็จ | TC-CP-002–008, 010–013 |
| FR-10, FR-11 | ตัดช่องว่างและปฏิเสธข้อความว่าง | TC-CP-010–013 |

## เกณฑ์การตรวจรับ
1. ทุก Test Case ต้องระบุเงื่อนไข ผลที่คาดหวัง และ Requirement ที่เกี่ยวข้อง
2. กรณี Happy Path, Failure, Stub, Spy, Mock และ Faker ต้องเขียนและ **รันจริง** ก่อนระบุว่าข้อ 2.3 สำเร็จ
3. ผู้ประเมินต้องรันทดสอบซ้ำได้ พร้อมข้อมูลเวอร์ชัน คำสั่ง ผล Pass/Fail/Skip และข้อจำกัด
4. ไม่อ้างว่าทดสอบผ่านจากการอ่านโค้ดเพียงอย่างเดียว

อ่านต่อได้ที่ [รายการ Test Cases](./test-cases.md) และ [Requirements Traceability](./requirement-traceability.md)
