# 2.2 การเปรียบเทียบโค้ดก่อนและหลังปรับปรุงตามหลัก V&V

## Branch ที่ใช้เปรียบเทียบ
- **`main`** — เก็บโค้ดต้นฉบับที่ใช้เป็นฐานเปรียบเทียบ ไม่แก้ไขสำหรับงานนี้
- **`vnv/election-unit-testing`** — เก็บการพัฒนาและเอกสาร Unit Testing

ดูความแตกต่างผ่าน GitHub Compare (`main...vnv/election-unit-testing`) หรือใช้คำสั่ง:
```bash
git diff main...vnv/election-unit-testing
```

จะไม่ Merge งานกลับเข้า `main` ระหว่างทำการบ้าน

## สิ่งที่ตรวจพบในโค้ดต้นฉบับ (main)
| ไฟล์ | พฤติกรรมเดิม | ประเด็นที่ควรพิจารณาตามหลัก V&V |
|---|---|---|
| `package.json` | `npm test` แจ้ง `no test specified` | ยังไม่มีชุด Unit Test ที่รันได้ |
| `src/routes/ECRoutes.ts` | `POST /parties` ใช้ `requireAuth` และ `requireRole(RoleName.EC)` | ต้องรักษาการตรวจสอบตัวตนและสิทธิ์เดิม |
| `src/controllers/PartyController.ts` | อ่าน name, logoUrl, policy และ user.id แล้วเรียก Service | ค่าว่างอาจถูกส่งต่อไปยัง Service |
| `src/services/PartyService.ts` | เรียก Repository เพื่อสร้างพรรคทันทีและคืนผลสำเร็จ | ไม่มี Validation หรือการตัดช่องว่างใน Service |
| `src/repositories/PartyRepository.ts` | ใช้ Prisma เพื่อบันทึกและกำหนดรหัสผู้สร้าง/ผู้แก้ไข | ควรแยกการทดสอบออกจากฐานข้อมูลจริง |
| `prisma/schema.prisma` | ชื่อพรรคเป็น Unique และมีฟิลด์ข้อมูล/เวลา | รักษา Database Constraint พร้อมตรวจข้อมูลก่อนบันทึก |
| `src/middlewares/PrismaErrorHandler.ts` | จัดการ Prisma P2002 ด้วย 409 และข้อผิดพลาดเชื่อมต่อด้วย 500 | ต้องทดสอบการส่งสถานะและการไม่เปิดเผยข้อมูลอ่อนไหว |

## วิธีจัดทำรายงานเปรียบเทียบฉบับสมบูรณ์
สำหรับทุกไฟล์ที่แก้ไข จะอธิบาย (1) สิ่งที่คงเดิม (2) จุดที่เปลี่ยนจาก Before เป็น After (3) ข้อกำหนดหรือปัญหาที่เกี่ยวข้อง (4) Test Case ที่ตรวจสอบ และ (5) ผลลัพธ์จริงพร้อมข้อดีและข้อจำกัด

**สถานะ:** นี่เป็นข้อมูลสำรวจโค้ดเดิมและแผนการเปรียบเทียบ ยังไม่ใช่รายงานผลการทดสอบฉบับสมบูรณ์
