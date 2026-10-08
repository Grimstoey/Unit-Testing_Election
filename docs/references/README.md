# เอกสารอ้างอิงสำหรับการบ้าน Unit Testing

เอกสารและแหล่งข้อมูลที่ใช้เป็นฐานในการออกแบบ Test Cases และปรับปรุงโค้ดมีดังนี้

1. **`Feature.docx`** — คำอธิบายฟีเจอร์ Create Political Party, Use Case UC-EC-01, Functional Requirements FR-01–FR-12, Business Rules BR-01–BR-05 และ Requirements Traceability Matrix
2. **`Test_Specification_with_Boundary_Double_Data_FIXED.xlsx`** — กรณีทดสอบเดิม TC-CP-001–013 และผลที่บันทึกไว้
3. **`ภาคผนวก.docx`** — ภาพประกอบการส่ง Request และตรวจสอบ Response ผ่าน Postman
4. **โค้ดต้นฉบับใน Branch `main`** — โดยเฉพาะ `src/controllers/PartyController.ts`, `src/services/PartyService.ts`, `src/repositories/PartyRepository.ts`, `src/middlewares/`, `src/routes/ECRoutes.ts` และ `prisma/schema.prisma`

**ข้อควรระวัง:** เอกสารต้นทางเป็นไฟล์ที่ได้รับจากผู้ใช้ ไม่ได้หมายความว่าทั้งสามไฟล์ถูกอัปโหลดขึ้น Repository โดยอัตโนมัติ หากต้องเผยแพร่เอกสารประกอบ ควรตรวจสอบและปกปิด Token, Password และข้อมูลส่วนบุคคลในภาพหรือ Test Data ก่อน
