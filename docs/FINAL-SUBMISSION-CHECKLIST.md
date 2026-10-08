# Final Review & Submission Checklist — Create Political Party

**วันที่ตรวจ:** 8 ตุลาคม 2026  
**Repository:** [Unit-Testing_Election](https://github.com/Grimstoey/Unit-Testing_Election)  
**Branch ส่งงาน:** `vnv/election-unit-testing` (แยกจาก `main`)  
**ขอบเขต:** Unit Testing ฟีเจอร์ Create Political Party (`POST /ec/parties`)

## ผลตรวจรับ

| รายการ | ผลตรวจ | หลักฐาน |
|---|---|---|
| การออกแบบ Test Cases และ RTM | ผ่านการตรวจความเชื่อมโยงเอกสาร | [2.1](./2.1-unit-test-design/README.md), [Test Cases](./2.1-unit-test-design/test-cases.md), [RTM](./2.1-unit-test-design/requirement-traceability.md) |
| เปรียบเทียบ Source Code เดิมกับเวอร์ชันทดสอบ | มีเอกสารและ Mermaid Diagram | [2.2](./2.2-code-comparison/README.md) |
| Implementation ครบ Happy Path, Failure, Stub, Spy, Mock, Faker | มีไฟล์ Test จริงและเอกสาร | [2.3](./2.3-unit-test-implementation/README.md) |
| ผล Build / Unit Tests / Coverage บน CI | PASS, 28/28 Unit Tests | [GitHub Actions Run #37768182384](https://github.com/Grimstoey/Unit-Testing_Election/actions/runs/37768182384) |
| ผล Unit Tests บน Windows | PASS, 28/28, Build สำเร็จ | [Test Execution Report](./2.3-unit-test-implementation/test-execution-report.md) |
| วิเคราะห์ Coverage จริง | มีผลแยก Linux/Windows และก่อน–หลังเพิ่ม Tests | [Coverage Report](./2.3-unit-test-implementation/coverage-report.md) |
| README สำหรับการรันทดสอบ | มีคำสั่ง Git Bash, npm, Prisma Generate, Build, Tests, Coverage | [README หลัก](../README.md) |
| Dependency Security | บันทึก `npm audit` เป็นข้อจำกัด; ไม่ Force Upgrade | [V&V Improvements](./2.2-code-comparison/vnv-improvements.md) |
| ภาพ/กราฟประกอบ | มี Flowchart, Code Comparison, Coverage Chart และ SVG Audit | [2.1](./2.1-unit-test-design/README.md), [2.2](./2.2-code-comparison/README.md), [Coverage](./2.3-unit-test-implementation/coverage-report.md) |

## ตัวเลขสำหรับใช้ในรายงานส่งงาน

| ตัวชี้วัด (6 ไฟล์ที่เลือกวัด) | GitHub Actions / Linux | Windows / Git Bash |
|---|---:|---:|
| Tests | 28/28 PASS | 28/28 PASS |
| Line Coverage | 90.88% | 89.86% |
| Branch Coverage | 90.99% | 90.99% |
| Function Coverage | 80.60% | 80.60% |

Line Coverage ต่างกัน **1.02 จุดเปอร์เซ็นต์** ระหว่างสองสภาพแวดล้อม ไม่ได้พิสูจน์ว่าเป็น Bug; ยังระบุสาเหตุไม่ได้แน่นอนโดยไม่มีการเปรียบเทียบ Runtime/Source Mapping เพิ่มเติม

## ข้อจำกัดที่ต้องรายงานอย่างตรงไปตรงมา

- Unit Tests ใช้ Test Doubles จึงไม่ได้ยืนยันการเชื่อมต่อ PostgreSQL, Unique Constraint จากฐานข้อมูลจริง หรือ Timestamp จริง
- ค่าร้อยละ Coverage จำกัดเฉพาะ 6 ไฟล์ ไม่ใช่ทั้ง Repository และไม่ใช่ Statement Coverage
- Function Coverage ของ `PartyRepository.ts` ต่ำกว่าไฟล์อื่นเพราะมีฟังก์ชัน CRUD/Pagination นอกขอบเขตการสร้างพรรครวมอยู่ด้วย
- ผล `npm audit` มี Advisory ใน Dependencies ที่ยังไม่ได้แก้ไขทั้งหมด; ไม่สามารถสรุปจากจำนวน Advisory เพียงอย่างเดียวว่า API นี้ถูกโจมตีได้จริง
- ไม่ได้ยืนยันการทำงาน End-to-End ของหน้าเว็บหรือการ Upload จริง

## ขั้นตอนตรวจซ้ำสำหรับผู้ประเมิน

```bash
git checkout vnv/election-unit-testing
git pull origin vnv/election-unit-testing
npm ci
export DIRECT_URL="postgresql://test:test@localhost:5432/election_test"
export JWT_SECRET="unit-test-only-secret-not-for-production"
export JWT_EXPIRES_IN="1h"
npx prisma generate
npm run build
npm test
npm run test:coverage
```

**ข้อควรระวัง:** `DIRECT_URL` นี้เป็นค่าตัวอย่างสำหรับให้ Prisma Config โหลดผ่าน ไม่ใช่ฐานข้อมูลใช้งานจริง **ห้ามใช้กับ `prisma migrate` หรือ `prisma db push`** ไม่จำเป็นต้องเปิด Server หรือ PostgreSQL เพื่อรัน Unit Tests เหล่านี้

## การตรวจสอบก่อนส่ง

- ยืนยันว่าได้เลือก Branch `vnv/election-unit-testing` ในหน้า GitHub หรือ URL ที่ส่งให้ผู้ประเมิน
- ใช้ [README หลัก](../README.md) เป็นจุดเริ่มต้น และส่งลิงก์รายงาน 2.1, 2.2, 2.3 ตามหัวข้อ
- ตรวจ GitHub Actions ของ Commit ล่าสุดก่อนส่งจริง หากมี Commit เอกสารเพิ่มเติมหลังรายงานนี้ ให้ยึดผล Workflow ของ Commit นั้น
- **ไม่ Merge เข้า `main`** เพื่อคงเวอร์ชันต้นฉบับไว้ใช้เปรียบเทียบ
