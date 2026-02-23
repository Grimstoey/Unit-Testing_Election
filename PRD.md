# PRD - ระบบเลือกตั้งออนไลน์ (Election System)

## 1. ภาพรวมโปรเจค (Overview)

### 1.1 วัตถุประสงค์
ระบบเลือกตั้งออนไลน์ เพื่อให้ประชาชนสามารถลงคะแนนเสียงเลือกตั้งผู้สมัครในเขตของตนเองผ่านระบบออนไลน์ได้อย่างสะดวกและโปร่งใส

### 1.2 ขอบเขตโปรเจค
- เว็บแอปพลิเคชันสำหรับการเลือกตั้ง
- รองรับการลงทะเบียนผู้ใช้ การลงคะแนน และการแสดงผล
- ผู้ใช้ 3 กลุ่ม: ผู้ดูแลระบบ (Admin), กกต. (EC), และผู้ใช้สิทธิเลือกตั้ง (Voter)

---

## 2. ผู้ใช้ระบบ (Users)

### 2.1 ประเภทผู้ใช้

| ประเภท | สิทธิ์ | คำอธิบาย |
|---------|--------|-----------|
| **Admin** | ROLE_ADMIN | ผู้ดูแลระบบ จัดการเขตเลือกตั้ง จัดการผู้ใช้ |
| **EC** | ROLE_EC | กกต. จัดการพรรค จัดการผู้สมัคร เปิด/ปิดหีบ |
| **Voter** | ROLE_VOTER | ผู้ใช้สิทธิเลือกตั้ง ลงคะแนน |
| **Public** | - | บุคคลทั่วไป ดูผลการเลือกตั้ง |

### 2.2 การลงทะเบียน

**ข้อมูลที่ต้องการ:**
- หมายเลขบัตรประจำตัวประชาชน (13 หลัก)
- รหัสผ่าน
- ชื่อ
- นามสกุล
- ที่อยู่
- จังหวัด
- อำเภอ
- เขตเลือกตั้ง (เลือกจากระบบ)

**เงื่อนไข:**
- ผู้ใช้ใหม่จะได้รับสิทธิ์ ROLE_VOTER โดยอัตโนมัติ
- Admin สามารถเปลี่ยนสิทธิ์เป็น ROLE_EC ได้

---

## 3. ฟีเจอร์ (Features)

### 3.1 การยืนยันตัวตน (Authentication)

| ฟีเจอร์ | รายละเอียด |
|---------|-------------|
| ลงทะเบียน | ผู้ใช้ลงทะเบียนด้วยข้อมูลส่วนตัว 13 หลัก |
| เข้าสู่ระบบ | ใช้ citizenId + password |
| JWT Token | ใช้ Bearer Token สำหรับ API ที่ต้องการ auth |

### 3.2 ผู้ดูแลระบบ (Admin)

| ฟีเจอร์ | รายละเอียด |
|---------|-------------|
| จัดการเขตเลือกตั้ง | สร้าง, แก้ไข, ลบ เขตเลือกตั้ง (จังหวัด-เขตที่) |
| จัดการผู้ใช้ | ดูรายชื่อ, เปลี่ยน role |
| ปิดหีบเลือกตั้ง | อัปเดตสถานะ isClosed ของเขต |

**เขตเลือกตั้ง:**
- รูปแบบ: จังหวัด-เขตเลือกตั้งที่ X
- ตัวอย่าง: กรุงเทพมหานคร-เขตเลือกตั้งที่ 1

### 3.3 กกต. (EC)

| ฟีเจอร์ | รายละเอียด |
|---------|-------------|
| จัดการพรรค | สร้าง, แก้ไข, ลบ พรรคการเมือง |
| จัดการผู้สมัคร | เพิ่ม, แก้ไข, ลบ ผู้สมัครในแต่ละเขต |
| เปิด/ปิดหีบ | ปิดหีบเลือกตั้งต่อเขต |

**พรรคการเมือง:**
- ชื่อพรรค
- โลโก้พรรค (URL รูปภาพ)
- นโยบายพรรค

**ผู้สมัคร:**
- หมายเลขผู้สมัคร
- รูปภาพ
- ชื่อ-นามสกุล
- พรรคที่สังกัด (ต้องมีในระบบแล้ว)
- นโยบายส่วนตัว

### 3.4 ผู้ใช้สิทธิเลือกตั้ง (Voter)

| ฟีเจอร์ | รายละเอียด |
|---------|-------------|
| ดูเขตเลือกตั้ง | ดูว่าตัวเองอยู่เขตไหน |
| ดูผู้สมัคร | เห็นเฉพาะผู้สมัครในเขตของตัวเอง |
| ลงคะแนน | เลือกผู้สมัครได้ 1 คน |
| แก้ไขคะแนน | เปลี่ยนได้เรื่อยๆ จนกว่าจะปิดหีบ |

**เงื่อนไขการลงคะแนน:**
- เลือกได้ 1 คนต่อ 1 คน
- แก้ไขคะแนนได้ตลอดเวลาก่อนปิดหีบ
- เมื่อปิดหีบแล้ว แก้ไขไม่ได้

### 3.5 บุคคลทั่วไป (Public)

| ฟีเจอร์ | รายละเอียด |
|---------|-------------|
| ดูผลรายเขต | เลือกเขตเลือกตั้งเพื่อดูผล |
| ดูรายชื่อผู้สมัคร | ดูผู้สมัครในแต่ละเขต (ก่อนปิดหีบ) |
| ดูภาพรวมพรรค | ดูทุกพรรค + จำนวนที่นั่ง |

**เงื่อนไขการแสดงผล:**
- **ยังไม่ปิดหีบ:** เห็นผู้สมัคร ไม่เห็นคะแนน
- **ปิดหีบแล้ว:** เห็นทั้งผู้สมัครและคะแนน
- **ภาพรวมพรรค:** นับจำนวนที่นั่งเฉพาะเขตที่ปิดหีบแล้ว

---

## 4. การทำงาน (User Flows)

### 4.1 Flow: การลงทะเบียนผู้ใช้ใหม่

```
1. ผู้ใช้เปิดหน้าลงทะเบียน
2. กรอกข้อมูล: citizenId, password, ชื่อ, นามสกุล, ที่อยู่
3. เลือกจังหวัด → อำเภอ → เขตเลือกตั้ง
4. ระบบบันทึกข้อมูล
5. ระบบกำหนดสิทธิ์เริ่มต้น: ROLE_VOTER
6. เข้าสู่ระบบสำเร็จ
```

### 4.2 Flow: การลงคะแนน

```
1. Voter เข้าสู่ระบบ
2. ระบบแสดงผู้สมัครในเขตของตน
3. Voter เลือกผู้สมัคร 1 คน
4. ระบบบันทึกคะแนน
5. หากต้องการเปลี่ยน → เลือกใหม่ → อัปเดตคะแนน
6. เมื่อ EC ปิดหีบ → Voter ไม่สามารถแก้ไขได้
```

### 4.3 Flow: การปิดหีบเลือกตั้ง

```
1. EC เข้าสู่ระบบ
2. ไปที่หน้าจัดการเขตเลือกตั้ง
3. เลือกเขตที่ต้องการปิดหีบ
4. กดปุ่ม "ปิดหีบ"
5. ระบบอัปเดต isClosed = true
6. ผู้ใช้ในเขตนั้นไม่สามารถแก้ไขคะแนนได้
7. บุคคลทั่วไปเห็นคะแนนได้
```

---

## 5. โครงสร้างข้อมูล (Data Models)

### 5.1 User

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| citizenId | String | หมายเลข 13 หลัก (unique) |
| password | String | bcrypt hash |
| firstName | String | ชื่อ |
| lastName | String | นามสกุล |
| address | String | ที่อยู่ |
| provinceId | Int | FK → Province |
| districtId | Int | FK → District |
| constituencyId | Int? | FK → Constituency (nullable) |
| roles | UserRole[] | สิทธิ์ผู้ใช้ |
| createdAt | DateTime | วันที่สร้าง |

### 5.2 Role

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| name | String | ROLE_ADMIN, ROLE_EC, ROLE_VOTER |

### 5.3 Province

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| name | String | ชื่อจังหวัด |

### 5.4 District

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| name | String | ชื่ออำเภอ |
| provinceId | Int | FK → Province |

### 5.5 Constituency (เขตเลือกตั้ง)

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| number | Int | เขตที่ 1, 2, 3... |
| provinceId | Int | FK → Province |
| isClosed | Boolean | สถานะปิดหีบ (default: false) |

### 5.6 Party (พรรค)

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| name | String | ชื่อพรรค |
| logoUrl | String | URL รูปโลโก้ |
| policy | String | นโยบายพรรค |

### 5.7 Candidate (ผู้สมัคร)

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| number | Int | หมายเลขผู้สมัคร |
| fullName | String | ชื่อ-นามสกุล |
| imageUrl | String | URL รูปภาพ |
| partyId | Int | FK → Party |
| constituencyId | Int | FK → Constituency |

### 5.8 Vote

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary Key |
| userId | Int | FK → User (unique) |
| candidateId | Int | FK → Candidate |
| constituencyId | Int | FK → Constituency |
| createdAt | DateTime | วันที่โหวต |
| updatedAt | DateTime | วันที่แก้ไขล่าสุด |

---

## 6. API Endpoints

### 6.1 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | ❌ | ลงทะเบียน |
| POST | /auth/login | ❌ | เข้าสู่ระบบ |
| GET | /auth/me | ✅ | ข้อมูลผู้ใช้ปัจจุบัน |

### 6.2 Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /admin/constituencies | ADMIN | ดูเขตทั้งหมด |
| POST | /admin/constituencies | ADMIN | สร้างเขต |
| PUT | /admin/constituencies/:id | ADMIN | แก้ไข/ปิดหีบ |
| DELETE | /admin/constituencies/:id | ADMIN | ลบเขต |
| GET | /admin/users | ADMIN | ดูผู้ใช้ทั้งหมด |
| GET | /admin/users/:id/roles | ADMIN | ดู roles |
| POST | /admin/users/:userId/roles | ADMIN | เพิ่ม role |
| DELETE | /admin/users/:id/roles | ADMIN | ลบ role |

### 6.3 EC

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /ec/parties | EC | ดูพรรคทั้งหมด |
| GET | /ec/parties/:id | EC | ดูพรรคตาม ID |
| POST | /ec/parties | EC | สร้างพรรค |
| PUT | /ec/parties/:id | EC | แก้ไขพรรค |
| DELETE | /ec/parties/:id | EC | ลบพรรค |
| GET | /ec/candidates | EC | ดูผู้สมัคร |
| POST | /ec/candidates | EC | สร้างผู้สมัคร |
| PUT | /ec/candidates/:id | EC | แก้ไขผู้สมัคร |
| DELETE | /ec/candidates/:id | EC | ลบผู้สมัคร |

### 6.4 Voter

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /voter/candidates | VOTER | ดูผู้สมัครในเขต |
| GET | /voter/constituency | VOTER | ดูเขตของตัวเอง |
| GET | /voter/my-vote | VOTER | ดูคะแนนที่โหวต |
| POST | /voter/vote | VOTER | โหวต |
| PUT | /voter/vote | VOTER | แก้ไขโหวต |

### 6.5 Location (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /location/provinces | ❌ | ดูจังหวัด |
| GET | /location/provinces/:provinceId/districts | ❌ | ดูอำเภอ |
| GET | /location/districts/:districtId/constituencies | ❌ | ดูเขตเลือกตั้ง |

### 6.6 Public Results

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /results/:constituencyId | ❌ | ดูผลรายเขต |
| GET | /parties/overview | ❌ | ภาพรวมพรรค + ที่นั่ง |
| GET | /public/stats | ❌ | สถิติสาธารณะ |

---

## 7. การตัดสินใจทางเทคนิค (Technical Decisions)

### 7.1 Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Express.js |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | JWT |
| Password | bcrypt |

### 7.2 Security

- ใช้ JWT Bearer Token
- bcrypt สำหรับ hash password
- Role-based Access Control (RBAC)
- CORS จำกัดเฉพาะ frontend

---

## 8. เงื่อนไขและข้อจำกัด (Constraints)

1. **หมายเลขบัตร 13 หลัก** ต้อง unique ในระบบ
2. **1 คน 1 เสียง** - ผู้ใช้ 1 คนมีได้ 1 vote record
3. **แก้ได้ก่อนปิดหีบ** - เมื่อ isClosed = true แก้ไม่ได้
4. **ผู้สมัครต้องมีพรรค** - ต้องสร้างพรรคก่อนเพิ่มผู้สมัคร
5. **Voter เห็นแค่เขตตัวเอง** - กรองตาม constituencyId

---

## 9. Timeline (แนวทาง)

| Phase | Tasks |
|-------|-------|
| Phase 1 | Auth, Admin Constituency, Admin Users |
| Phase 2 | EC Parties, EC Candidates |
| Phase 3 | Voter Voting |
| Phase 4 | Public Results |
| Phase 5 | Testing & Deployment |

---

## 10. Acceptance Criteria

| Feature | Success Criteria |
|---------|------------------|
| ลงทะเบียน | สร้าง user ใหม่ได้ ได้ role VOTER |
| Login | ได้ JWT token |
| Admin เปลี่ยน role | user มี role ใหม่หลังเรียก API |
| Admin สร้างเขต | สร้าง constituency ใหม่ได้ |
| EC สร้างพรรค | สร้าง party ใหม่ได้ |
| EC สร้างผู้สมัคร | สร้าง candidate ใหม่ได้ (ต้องมี party) |
| Voter โหวต | บันทึก vote ได้ |
| Voter แก้ไขโหวต | อัปเดต vote ได้ (ก่อนปิดหีบ) |
| EC ปิดหีบ | isClosed = true |
| ปิดแล้วแก้ไม่ได้ | คืน error 400 เมื่อพยายามแก้ไข |
| Public ดูผล | เห็นคะแนนเฉพาะเขตที่ปิดหีบ |
| Public ภาพรวมพรรค | นับที่นั่งเฉพาะเขตที่ปิดหีบ |
