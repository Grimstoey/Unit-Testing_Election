# 📋 Election System - API Endpoints Summary

> **Backend:** Express.js + Prisma + PostgreSQL (Supabase)
> **Base URL:** `http://localhost:3000`
> **Authentication:** JWT Bearer Token

---

## 📊 สรุปจำนวน Endpoints

| ประเภท                       | จำนวน | Authentication | Authorization          |
| ---------------------------- | ------ | -------------- | ---------------------- |
| **Health Check**             | 1      | ❌             | -                      |
| **Authentication**           | 3      | บางส่วน        | -                      |
| **Admin**                    | 8      | ✅             | `admin`                |
| **EC (Election Commission)** | 5      | ✅             | `ec`, `admin`          |
| **Voter**                    | 5      | ✅             | `voter`, `admin`, `ec` |
| **Location**                 | 3      | ❌             | -                      |
| **รวมทั้งหมด**               | **25** | -              | -                      |

---

## 🏥 Health Check (1 endpoint)

### `GET /`

- **คำอธิบาย:** ตรวจสอบสถานะ server
- **Authentication:** ❌ ไม่ต้อง
- **Response:**
  ```json
  {
    "message": "Welcome to Election Backend API"
  }
  ```

---

## 🔐 Authentication (3 endpoints)

### 1. `POST /auth/register`

- **คำอธิบาย:** ลงทะเบียนผู้ใช้ใหม่
- **Authentication:** ❌ ไม่ต้อง
- **Request Body:**
  ```json
  {
    "citizenId": "1234567890123",
    "password": "string (min 6 chars)",
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "provinceId": "number",
    "districtId": "number",
    "constituencyId": "number (optional)"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "ok": true,
    "status": 200,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

### 2. `POST /auth/login`

- **คำอธิบาย:** เข้าสู่ระบบ
- **Authentication:** ❌ ไม่ต้อง
- **Request Body:**
  ```json
  {
    "citizenId": "1234567890123",
    "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "ok": true,
    "status": 200,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

### 3. `GET /auth/me`

- **คำอธิบาย:** ดึงข้อมูลผู้ใช้ปัจจุบัน
- **Authentication:** ✅ ต้องมี JWT Token
- **Response:**
  ```json
  {
    "ok": true,
    "status": 200,
    "data": { ... }
  }
  ```

---

## 👨‍💼 Admin Routes (8 endpoints)

> **Authorization:** ต้องมี role `admin` ทั้งหมด

### Constituencies Management

#### 1. `GET /admin/constituencies`

- **คำอธิบาย:** ดึงรายการเขตเลือกตั้ง (มี pagination + filter)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `provinceId` (optional)
- **Response:** `200 OK`
  ```json
  {
    "ok": true,
    "status": 200,
    "data": {
      "total": 25,
      "data": [...],
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
  ```

#### 2. `POST /admin/constituencies`

- **คำอธิบาย:** สร้างเขตเลือกตั้งใหม่
- **Authentication:** ✅ ต้องมี JWT Token + ADMIN role
- **Request Body:**
  ```json
  {
    "number": 1,
    "provinceId": 1
  }
  ```
- **Response:** `200 OK`

#### 3. `PUT /admin/constituencies/:id`

- **คำอธิบาย:** แก้ไขเขตเลือกตั้ง (ใช้ปิดหีบ isClosed)
- **Request Body:**
  ```json
  {
    "number": 1,
    "provinceId": 1,
    "isClosed": true
  }
  ```
- **Response:** `200 OK`

#### 4. `DELETE /admin/constituencies/:id`

- **คำอธิบาย:** ลบเขตเลือกตั้ง
- **Response:** `200 OK`

---

### Users Management

#### 5. `GET /admin/users`

- **คำอธิบาย:** ดึงรายการผู้ใช้ (มี pagination + filter)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (optional)
  - `sortBy` (default: id)
  - `order` (default: desc)

#### 6. `GET /admin/users/:id/roles`

- **คำอธิบาย:** ดู roles ของ user

#### 7. `POST /admin/users/:userId/roles`

- **คำอธิบาย:** เพิ่ม role ให้ user
- **Request Body:**
  ```json
  {
    "roleName": "ROLE_EC" // ROLE_VOTER, ROLE_EC, ROLE_ADMIN
  }
  ```

#### 8. `DELETE /admin/users/:id/roles`

- **คำอธิบาย:** ลบ role ออกจาก user
- **Request Body:**
  ```json
  {
    "roleName": "ROLE_EC"
  }
  ```

---

## 🗳️ EC (Election Commission) Routes (5 endpoints)

> **Authorization:** ต้องมี role `ec` หรือ `admin`

### Parties Management

#### 1. `GET /ec/parties`

- **คำอธิบาย:** ดึงรายการพรรคการเมือง (มี pagination)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)

#### 2. `GET /ec/parties/:id`

- **คำอธิบาย:** ดูพรรคตาม ID

#### 3. `POST /ec/parties`

- **คำอธิบาย:** สร้างพรรคการเมืองใหม่
- **Request Body:**
  ```json
  {
    "name": "string",
    "logoUrl": "string (optional)",
    "policy": "string"
  }
  ```
- **Response:** `200 OK`

#### 4. `PUT /ec/parties/:id`

- **คำอธิบาย:** แก้ไขข้อมูลพรรคการเมือง
- **Request Body:** เหมือน POST

#### 5. `DELETE /ec/parties/:id`

- **คำอธิบาย:** ลบพรรคการเมือง
- **Response:** `200 OK`

---

### ⚠️ ยังไม่มี (ต้องสร้างเพิ่ม)

| Endpoint | Description |
|----------|-------------|
| `GET /ec/candidates` | ดูรายการผู้สมัคร |
| `POST /ec/candidates` | สร้างผู้สมัครใหม่ |
| `PUT /ec/candidates/:id` | แก้ไขผู้สมัคร |
| `DELETE /ec/candidates/:id` | ลบผู้สมัคร |

---

## 🗳️ Voter Routes (5 endpoints)

> **Authorization:** ต้องมี role `voter`, `admin`, หรือ `ec`

#### 1. `GET /voter/candidates`

- **คำอธิบาย:** ดึงรายการผู้สมัครในเขตของผู้ใช้
- **Response:** `200 OK`

#### 2. `GET /voter/constituency`

- **คำอธิบาย:** ดึงข้อมูลเขตเลือกตั้งของผู้ใช้
- **Response:** `200 OK`

#### 3. `GET /voter/my-vote`

- **คำอธิบาย:** ดึงข้อมูลคะแนนที่ผู้ใช้ลงไปแล้ว
- **Response:** `200 OK`

#### 4. `POST /voter/vote`

- **คำอธิบาย:** ลงคะแนนเสียง
- **Request Body:**
  ```json
  {
    "candidateId": 1
  }
  ```
- **Response:** `200 OK`

#### 5. `PUT /voter/vote`

- **คำอธิบาย:** เปลี่ยนคะแนนเสียง (ก่อนปิดหีบ)
- **Request Body:**
  ```json
  {
    "candidateId": 2
  }
  ```
- **Response:** `200 OK`

---

## 📍 Location Routes (3 endpoints)

> **Authentication:** ❌ ไม่ต้อง (public)

#### 1. `GET /location/provinces`

- **คำอธิบาย:** ดึงรายการจังหวัด

#### 2. `GET /location/provinces/:provinceId/districts`

- **คำอธิบาย:** ดึงรายการอำเภอตามจังหวัด

#### 3. `GET /location/districts/:districtId/constituencies`

- **คำอธิบาย:** ดึงรายการเขตเลือกตั้งตามอำเภอ

---

## ⚠️ ยังไม่มี (Public Routes)

| Endpoint | Description |
|----------|-------------|
| `GET /results/:constituencyId` | ดูผลรายเขต (ถ้าปิดหีบแล้ว) |
| `GET /parties/overview` | ภาพรวมพรรค + จำนวนที่นั่ง |
| `GET /public/stats` | สถิติสาธารณะ |

---

## 🔑 Authentication & Authorization

### JWT Token Format

```
Authorization: Bearer <jwt_token>
```

### Role Hierarchy

```
admin > ec > voter
```

- **admin:** เข้าถึงได้ทุก endpoint
- **ec:** เข้าถึง EC routes + Voter routes
- **voter:** เข้าถึงเฉพาะ Voter routes

### Available Roles

| Role | Description |
|------|-------------|
| ROLE_ADMIN | ผู้ดูแลระบบ |
| ROLE_EC | กกต. (Election Commission) |
| ROLE_VOTER | ผู้ลงคะแนน (default) |

---

## 📁 Project Structure

```
src/
├── server.ts              # Express entry point
├── routes/               # 5 route files
│   ├── AuthRoutes.ts     # 3 endpoints
│   ├── AdminRoutes.ts    # 8 endpoints
│   ├── ECRoutes.ts       # 5 endpoints
│   ├── VoterRoutes.ts    # 5 endpoints
│   └── LocationRoutes.ts # 3 endpoints
├── controllers/          # HTTP handlers
├── services/             # Business logic
├── repositories/         # Database access
├── middlewares/          # Auth & Error handling
├── models/               # DTOs
└── utils/                # Utilities
```

---

## 🛠️ Tech Stack

| Component  | Technology                  |
| ---------- | ---------------------------|
| Framework  | Express.js 5.x              |
| ORM        | Prisma 7.x                 |
| Database   | PostgreSQL (Supabase)      |
| Auth       | JWT (jsonwebtoken)         |
| Validation | Manual + TypeScript        |

---

## 🎯 Use Cases by Role

### 👨‍💼 Admin

- จัดการผู้ใช้ทั้งหมด
- จัดการเขตเลือกตั้ง
- เปลี่ยน role ผู้ใช้
- ปิดหีบเลือกตั้ง

### 🗳️ EC (Election Commission)

- จัดการพรรคการเมือง
- ⚠️ จัดการผู้สมัคร (ยังไม่มี)
- ดูข้อมูลการเลือกตั้ง

### 🙋 Voter

- ดูข้อมูลเขตเลือกตั้งของตัวเอง
- ดูรายการผู้สมัครในเขต
- ลงคะแนนเสียง
- เปลี่ยนคะแนนเสียง (ถ้าหีบยังเปิดอยู่)

### 🌐 Public (ยังไม่มี)

- ดูผลการเลือกตั้ง
- ดูภาพรวมพรรค

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# ตั้งค่า DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Start dev server
npm run dev
```

Server จะรันที่: `http://localhost:3000`

---

## 📝 Notes

- ทุก endpoint ส่ง response เป็น JSON
- รูปแบบ response สำเร็จ: `{ ok: true, status: 200, data: ... }`
- รูปแบบ response ผิดพลาด: `{ ok: false, status: 400, message: "..." }`
- CORS เปิดให้ frontend ที่กำหนดไว้เท่านั้น
