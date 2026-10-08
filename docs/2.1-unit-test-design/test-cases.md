# 2.1 รายละเอียดการออกแบบ Test Cases

รหัส `UT-CP-` ใช้ระบุ Unit Tests ที่พัฒนาขึ้น ส่วน `TC-CP-` อ้างถึงกรณีทดสอบ API เดิม

| Test ID | เงื่อนไข/ข้อมูลทดสอบ | ผลที่คาดหวัง | เทคนิค/ความเชื่อมโยง |
|---|---|---|---|
| UT-CP-001 | ชื่อพรรค โลโก้ และนโยบายถูกต้อง | ผ่าน Validation | Happy Path, FR-04 |
| UT-CP-002 | ไม่ส่งชื่อพรรค | ปฏิเสธข้อมูล | EP, FR-11–12 |
| UT-CP-003 | ไม่ส่งโลโก้ | ปฏิเสธข้อมูล | EP, FR-12 |
| UT-CP-004 | ไม่ส่งนโยบาย | ปฏิเสธข้อมูล | EP, FR-12 |
| UT-CP-005 | ชื่อพรรคเป็นช่องว่างล้วน | ปฏิเสธข้อมูล | EP/BVA, FR-10–11 |
| UT-CP-006 | นโยบายเป็นช่องว่างล้วน | ปฏิเสธข้อมูล | EP/BVA, FR-10–11 |
| UT-CP-007 | ค่าบังคับเป็น `null`, `undefined`, String ว่าง หรือช่องว่างล้วน | ไม่ผ่าน Validation | EP, FR-11–12 |
| UT-CP-008 | ชื่อพรรค/นโยบายมีช่องว่างด้านหน้าและท้าย | ตัดช่องว่างก่อนใช้งาน | FR-10 |
| UT-CP-009 | Request ไม่มี Bearer Token | HTTP 401 และไม่เรียก Lookup | Authentication, FR-02 |
| UT-CP-010 | Lookup ไม่พบผู้ใช้จาก Token | HTTP 401 และไม่เรียก `next()` | Authentication, FR-02 |
| UT-CP-011 | ผู้ใช้มี Role `VOTER` แต่ไม่มี `EC` | HTTP 403 และไม่เรียก `next()` | Authorization, FR-03 |
| UT-CP-012 | บันทึกพรรคด้วย User ID 17 | Argument ที่ส่งให้ Prisma มี createdBy/updatedBy = 17 | Interaction, FR-07 |
| UT-CP-013 | Prisma คืนข้อผิดพลาด `P2002` | Error Handler ตอบ HTTP 409 | Failure, FR-05 |
| UT-CP-014 | Error ที่ไม่รู้จักและมีข้อความภายใน | HTTP 500 และ Response ไม่เปิดเผยข้อความภายใน | Failure, FR-09 |
| UT-CP-015 | ใช้ Stub ส่งคืนข้อมูลพรรคที่กำหนดไว้ | Use Case ส่งข้อมูลสำเร็จตาม Stub | Stub, FR-06/08 |
| UT-CP-016 | ชื่อพรรคไม่ผ่าน Validation | Spy ยืนยันว่าฟังก์ชันบันทึกไม่ถูกเรียก | Spy, FR-11 |
| UT-CP-017 | ชื่อพรรค/นโยบายมีช่องว่าง | Mock ตรวจ Arguments ที่ส่งไปยังฟังก์ชันบันทึก | Mock, FR-06 |
| UT-CP-018 | Faker สุ่ม UUID, URL รูป และนโยบาย 5 ชุด | ทั้ง 5 ชุดผ่าน Use Case และมีชื่อไม่ซ้ำ | Dynamic Data, FR-04 |
| UT-CP-019 | Token ถูกต้องและ Lookup คืนข้อมูลผู้ใช้ | บันทึก user ลง Request และเรียก `next()` | Happy Path, FR-02 |
| UT-CP-020 | ผู้ใช้มี Role `EC` | เรียก `next()` | Happy Path, FR-03 |
| UT-CP-021 | Lookup โยน Exception จาก Token | ตอบ HTTP 401 โดยไม่เรียก `next()` | Failure, FR-02 |
| UT-CP-022 | Prisma Known Error P2025 | ตอบ 404 Not Found | Error Decision, FR-09 |
| UT-CP-023 | Prisma Known Error P2003 | ตอบ 400 Foreign Key Constraint | Error Decision, FR-09 |
| UT-CP-024 | Prisma Known Error อื่น | ตอบ 400 Database error | Error Decision, FR-09 |
| UT-CP-025 | Prisma P2002 ใน Production | 409 โดยไม่แสดง Code หรือ Metadata | Security / Error Handling, FR-09 |
| UT-CP-026 | Response ส่ง Headers ไปแล้ว | ส่ง Error ให้ next() | Middleware Branch, FR-09 |
| UT-CP-027 | Bearer Token มีแต่ช่องว่าง | 401 และไม่เรียก Lookup | Authentication, FR-02 |
| UT-CP-028 | Persistence Dependency โยน Error | Use Case ส่งต่อ Error และไม่คืน Success | Failure Path, FR-09 |

## เหตุผลที่เพิ่มกรณีทดสอบ

นอกจากข้อมูลไม่ครบและช่องว่าง ยังตรวจการทำงานของ Middleware ทั้งเส้นทางสำเร็จและล้มเหลว การแมป Audit Fields การแปลง Database Error เป็น HTTP Status และการป้องกันเปิดเผยข้อมูลจาก Exception เนื่องจากกรณีเหล่านี้มีความสำคัญต่อความถูกต้อง ความมั่นคงปลอดภัย และการตรวจสอบย้อนกลับของการสร้างพรรคการเมือง

## ข้อจำกัดของ Test Cases

UT-CP-001 ตรวจฟังก์ชัน Validation ไม่ใช่การสร้างข้อมูลในฐานข้อมูลจริง ส่วน UT-CP-017 ใช้ Mock ของฟังก์ชันบันทึกที่ฉีดให้ Use Case และ UT-CP-012 ตรวจ Argument ที่ส่งผ่าน Repository Mapper ไม่ได้ตรวจ Timestamp ที่ฐานข้อมูลสร้างจริง การทดสอบ Timestamp และ Unique Constraint กับฐานข้อมูลจริงต้องใช้ Integration Test แยกต่างหาก
