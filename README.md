# 🗳️ Election System Backend

> **ระบบเลือกตั้งออนไลน์** — Backend API สำหรับการลงทะเบียนผู้ใช้ การจัดการเขตเลือกตั้ง พรรคการเมือง ผู้สมัคร การลงคะแนนเสียง และการแสดงผลการเลือกตั้ง

**Tech Stack:** Express.js 5 + Prisma 7 + PostgreSQL (Supabase) + TypeScript
**Base URL:** `http://localhost:3000`

---

## 📊 สรุปจำนวน Endpoints

| ประเภท                       | จำนวน | Authentication | Authorization          |
| ---------------------------- | ------ | -------------- | ---------------------- |
| **Health Check**             | 1      | ❌             | —                      |
| **Authentication**           | 3      | บางส่วน        | —                      |
| **Admin**                    | 9      | ✅             | `ROLE_ADMIN`           |
| **EC (Election Commission)** | 13     | ✅             | `ROLE_EC`              |
| **Voter**                    | 5      | ✅             | ทุก role (ต้อง login)  |
| **Location**                 | 3      | ❌             | —                      |
| **Upload**                   | 1      | ❌             | —                      |
| **Public**                   | 5      | ❌             | —                      |
| **รวมทั้งหมด**               | **40** | —              | —                      |

---

## 🛠️ Tech Stack

| Component       | Technology                          |
| --------------- | ----------------------------------- |
| Runtime         | Node.js + TypeScript 5.x            |
| Framework       | Express.js 5.x                      |
| ORM             | Prisma 7.x                          |
| Database        | PostgreSQL (Supabase)               |
| Auth            | JWT (`jsonwebtoken`) + `bcryptjs`   |
| File Upload     | Multer + AWS S3 SDK (Supabase Storage) |
| Image Processing| Sharp                               |
| Dev Tools       | Nodemon, tsx, tsc-alias             |

---

## 📁 Project Structure

```
election-backend-project/
├── prisma/
│   ├── schema.prisma          # Database schema (8 models)
│   ├── seed.ts                # Main seed runner
│   └── migrations/            # Prisma migrations
├── src/
│   ├── server.ts              # Express entry point
│   ├── awsConfig.ts           # S3 client config (Supabase Storage)
│   ├── config/
│   │   └── env.ts             # Environment variable loader
│   ├── routes/                # 7 route modules
│   │   ├── AuthRoutes.ts      # 3 endpoints
│   │   ├── AdminRoutes.ts     # 9 endpoints
│   │   ├── ECRoutes.ts        # 13 endpoints
│   │   ├── VoterRoutes.ts     # 5 endpoints
│   │   ├── LocationRoutes.ts  # 3 endpoints
│   │   ├── UploadRoutes.ts    # 1 endpoint
│   │   └── PublicRoutes.ts    # 5 endpoints
│   ├── controllers/           # HTTP request handlers
│   ├── services/              # Business logic
│   ├── repositories/          # Database access (Prisma queries)
│   ├── middlewares/
│   │   ├── AuthMiddleware.ts  # JWT verification + user injection
│   │   ├── RoleMiddleware.ts  # Role-based access control
│   │   └── PrismaErrorHandler.ts # Global error handler
│   ├── models/                # DTOs (Data Transfer Objects)
│   ├── db/                    # Seed data modules
│   ├── lib/
│   │   └── prisma.ts          # Prisma client instance
│   ├── utils/
│   │   └── jwt.ts             # JWT sign/verify utilities
│   └── generated/             # Prisma generated client (gitignored)
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── PRD.md                     # Product Requirements Document
```

---

## 🏥 Health Check

### `GET /`

- **Authentication:** ❌
- **Response:**
  ```json
  { "message": "Welcome to Election Backend API" }
  ```

---

## 🔐 Authentication (3 endpoints)

### 1. `POST /auth/register`

- **คำอธิบาย:** ลงทะเบียนผู้ใช้ใหม่ (จะได้ `ROLE_VOTER` อัตโนมัติ)
- **Authentication:** ❌
- **Request Body:**
  ```json
  {
    "citizenId": "1234567890123",
    "password": "string (min 6 chars)",
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "provinceId": 1,
    "districtId": 1
  }
  ```
- **Response:** `200 OK` — `{ ok, status, data: { accessToken } }`

### 2. `POST /auth/login`

- **คำอธิบาย:** เข้าสู่ระบบ
- **Authentication:** ❌
- **Request Body:**
  ```json
  {
    "citizenId": "1234567890123",
    "password": "string"
  }
  ```
- **Response:** `200 OK` — `{ ok, status, data: { accessToken } }`

### 3. `GET /auth/me`

- **คำอธิบาย:** ดึงข้อมูลผู้ใช้ปัจจุบัน (จาก JWT)
- **Authentication:** ✅ Bearer Token
- **Response:** `200 OK` — `{ ok, status, data: { user info + roles } }`

---

## 👨‍💼 Admin Routes (9 endpoints)

> **Authorization:** ต้องมี role `ROLE_ADMIN`

### Constituencies Management

| Method   | Endpoint                                             | คำอธิบาย                        |
| -------- | ---------------------------------------------------- | ------------------------------- |
| `GET`    | `/admin/constituencies`                              | ดึงรายการเขตเลือกตั้ง (pagination + filter) |
| `POST`   | `/admin/constituencies`                              | สร้างเขตเลือกตั้งใหม่          |
| `PUT`    | `/admin/constituencies/:id`                          | แก้ไขเขตเลือกตั้ง / ปิดหีบ     |
| `DELETE` | `/admin/constituencies/:id`                          | ลบเขตเลือกตั้ง                 |
| `GET`    | `/admin/constituencies/:provinceId/available-districts` | ดึงอำเภอที่ยังไม่ถูกผูกกับเขต  |

**Query Parameters สำหรับ GET constituencies:**
- `page` (default: 1), `limit` (default: 10), `provinceId` (optional)

### Users Management

| Method   | Endpoint                      | คำอธิบาย                |
| -------- | ----------------------------- | ----------------------- |
| `GET`    | `/admin/users`                | ดึงรายการผู้ใช้ (pagination + search) |
| `GET`    | `/admin/users/:id/roles`      | ดู roles ของ user       |
| `POST`   | `/admin/users/:userId/roles`  | เพิ่ม role ให้ user     |
| `DELETE` | `/admin/users/:id/roles`      | ลบ role ออกจาก user     |

**Query Parameters สำหรับ GET users:**
- `page`, `limit`, `search`, `sortBy` (default: id), `order` (default: desc)

**Request Body สำหรับ role management:**
```json
{ "roleName": "ROLE_EC" }
```
> Roles: `ROLE_VOTER`, `ROLE_EC`, `ROLE_ADMIN`

---

## 🗳️ EC Routes (13 endpoints)

> **Authorization:** ต้องมี role `ROLE_EC`

### Parties Management

| Method   | Endpoint         | คำอธิบาย              |
| -------- | ---------------- | --------------------- |
| `GET`    | `/ec/parties`    | ดึงรายการพรรค (pagination) |
| `GET`    | `/ec/parties/:id`| ดูพรรคตาม ID          |
| `POST`   | `/ec/parties`    | สร้างพรรคใหม่         |
| `PUT`    | `/ec/parties/:id`| แก้ไขพรรค             |
| `DELETE` | `/ec/parties/:id`| ลบพรรค               |

**Request Body (POST/PUT):**
```json
{
  "name": "string",
  "logoUrl": "string",
  "policy": "string"
}
```

### Candidates Management

| Method   | Endpoint              | คำอธิบาย              |
| -------- | --------------------- | --------------------- |
| `GET`    | `/ec/candidates`      | ดึงรายการผู้สมัคร (pagination + filter) |
| `POST`   | `/ec/candidates`      | สร้างผู้สมัครใหม่     |
| `PATCH`  | `/ec/candidates/:id`  | แก้ไขผู้สมัคร         |
| `DELETE` | `/ec/candidates/:id`  | ลบผู้สมัคร            |

**Query Parameters สำหรับ GET candidates:**
- `page`, `limit`, `search`, `sortBy`, `order`, `partyId`, `constituencyId`, `provinceId`

**Request Body (POST):**
```json
{
  "citizenId": "1234567890123",
  "number": 1,
  "firstName": "string",
  "lastName": "string",
  "candidatePolicy": "string (optional)",
  "imageUrl": "string",
  "partyId": 1,
  "constituencyId": 1
}
```

### Constituency Management (EC)

| Method | Endpoint                               | คำอธิบาย                   |
| ------ | -------------------------------------- | -------------------------- |
| `GET`  | `/ec/constituencies`                   | ดึงรายการเขตเลือกตั้ง     |
| `POST` | `/ec/constituencies/close-all`         | ปิดหีบทุกเขตเลือกตั้ง     |
| `POST` | `/ec/constituencies/open-all`          | เปิดหีบทุกเขตเลือกตั้ง    |
| `POST` | `/ec/constituencies/:id/toggle`        | สลับสถานะเปิด/ปิดหีบ      |

---

## 🙋 Voter Routes (5 endpoints)

> **Authorization:** ต้องมี JWT Token (ทุก role ที่ login แล้ว)

| Method | Endpoint              | คำอธิบาย                           |
| ------ | --------------------- | ---------------------------------- |
| `GET`  | `/voter/candidates`   | ดึงรายการผู้สมัครในเขตของผู้ใช้    |
| `GET`  | `/voter/constituency` | ดึงข้อมูลเขตเลือกตั้งของผู้ใช้    |
| `GET`  | `/voter/my-vote`      | ดึงข้อมูลคะแนนที่ลงไปแล้ว         |
| `POST` | `/voter/vote`         | ลงคะแนนเสียง                      |
| `PUT`  | `/voter/vote`         | เปลี่ยนคะแนนเสียง (ก่อนปิดหีบ)   |

**Request Body (POST/PUT vote):**
```json
{ "candidateId": 1 }
```

---

## 📍 Location Routes (3 endpoints)

> **Authentication:** ❌ Public

| Method | Endpoint                                          | คำอธิบาย                    |
| ------ | ------------------------------------------------- | --------------------------- |
| `GET`  | `/location/provinces`                             | ดึงรายการจังหวัด            |
| `GET`  | `/location/provinces/:provinceId/districts`       | ดึงรายการอำเภอตามจังหวัด   |
| `GET`  | `/location/districts/:districtId/constituencies`  | ดึงเขตเลือกตั้งตามอำเภอ    |

---

## 📤 Upload Routes (1 endpoint)

| Method | Endpoint       | คำอธิบาย                              |
| ------ | -------------- | ------------------------------------- |
| `POST` | `/upload`      | อัปโหลดไฟล์ไปยัง Supabase Storage (S3) |

**Request:** `multipart/form-data`
- `file` — ไฟล์ที่ต้องการอัปโหลด
- `folder` — (optional) โฟลเดอร์ปลายทาง (default: `uploads`)

---

## 📊 Public Routes (5 endpoints)

> **Authentication:** ❌ Public

| Method | Endpoint                               | คำอธิบาย                               |
| ------ | -------------------------------------- | -------------------------------------- |
| `GET`  | `/public/results`                      | ดูผลการเลือกตั้งแบบ dashboard          |
| `GET`  | `/public/contstituencies-result/:id`   | ดูผลรายเขตเลือกตั้ง                   |
| `GET`  | `/public/provinces-with-constituencies`| ดูจังหวัดพร้อมเขตเลือกตั้ง            |
| `GET`  | `/public/parties`                      | ดูรายการพรรคการเมืองทั้งหมด            |
| `GET`  | `/public/candidates`                   | ดูรายการผู้สมัครทั้งหมด                |

---

## 🔑 Authentication & Authorization

### JWT Token Format

```
Authorization: Bearer <jwt_token>
```

### Available Roles

| Role         | Description                | สิทธิ์การเข้าถึง                  |
| ------------ | -------------------------- | --------------------------------- |
| `ROLE_ADMIN` | ผู้ดูแลระบบ               | เข้าถึงได้ทุก endpoint            |
| `ROLE_EC`    | กกต. (Election Commission) | EC routes + Voter routes          |
| `ROLE_VOTER` | ผู้ลงคะแนน (default)       | Voter routes เท่านั้น             |

### Middleware Flow

```
Request → CORS → JSON Parser → [requireAuth] → [requireRole] → Controller → [errorHandler]
```

---

## 🗄️ Database Schema (Prisma)

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  user    │────▶│ userRole │◀────│   role   │
│          │     └──────────┘     └──────────┘
│          │────▶ vote
│          │────▶ province
│          │────▶ district
└─────────┘

┌──────────┐     ┌──────────────┐     ┌───────────┐
│ province │────▶│ constituency │◀────│ candidate │────▶ party
│          │────▶│              │     │           │────▶ vote
│          │────▶│  district    │     └───────────┘
└──────────┘     └──────────────┘
```

### Models

| Model          | คำอธิบาย              | Key Fields                                    |
| -------------- | --------------------- | --------------------------------------------- |
| `user`         | ผู้ใช้ระบบ            | citizenId (unique), firstName, lastName, address |
| `role`         | สิทธิ์ผู้ใช้          | name (unique): ROLE_ADMIN / ROLE_EC / ROLE_VOTER |
| `userRole`     | ความสัมพันธ์ user-role | composite PK: (userId, roleId)                |
| `province`     | จังหวัด               | name (unique)                                 |
| `district`     | อำเภอ                | name, provinceId, constituencyId (nullable)    |
| `constituency` | เขตเลือกตั้ง          | number, provinceId, isClosed                  |
| `party`        | พรรคการเมือง          | name (unique), logoUrl, policy                |
| `candidate`    | ผู้สมัคร              | citizenId (unique), number, partyId, constituencyId |
| `vote`         | คะแนนเสียง            | userId (unique), candidateId                  |

---

## 📝 Response Format

### สำเร็จ
```json
{
  "ok": true,
  "status": 200,
  "message": "...",
  "data": { ... }
}
```

### ผิดพลาด
```json
{
  "ok": false,
  "status": 400,
  "message": "..."
}
```

### Error Handling (Global)

| Prisma Error | HTTP Status | Description                       |
| ------------ | ----------- | --------------------------------- |
| P2002        | 409         | Duplicate value (unique constraint) |
| P2025        | 404         | Record not found                  |
| P2003        | 400         | Foreign key constraint failed     |
| Validation   | 400         | Invalid database query            |
| Init Error   | 500         | Database connection error         |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# ตั้งค่า: DATABASE_URL, DIRECT_URL, JWT_SECRET, JWT_EXPIRES_IN,
#          AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION,
#          SUPABASE_ENDPOINT_URL

# 3. Generate Prisma client
npx prisma generate

# 4. Run migrations
npx prisma migrate dev

# 5. Seed database (optional)
npm run seed

# 6. Start dev server
npm run dev
```

Server จะรันที่: `http://localhost:3000`

### Available Scripts

| Script          | Command                      | คำอธิบาย                  |
| --------------- | ---------------------------- | ------------------------- |
| `npm run dev`   | `nodemon --exec tsx src/server.ts` | รัน dev server (hot reload) |
| `npm run build` | `tsc && tsc-alias`           | Build production          |
| `npm start`     | `node dist/server.js`        | รัน production server     |
| `npm run seed`  | `prisma db seed`             | Seed ข้อมูลตัวอย่าง       |

---

## ⚙️ Environment Variables

| Variable               | Description                        | Required |
| ---------------------- | ---------------------------------- | -------- |
| `DATABASE_URL`         | PostgreSQL connection (pooler)     | ✅       |
| `DIRECT_URL`           | PostgreSQL direct connection       | ✅       |
| `JWT_SECRET`           | Secret key สำหรับ JWT              | ✅       |
| `JWT_EXPIRES_IN`       | อายุ token เช่น `24h`             | ✅       |
| `AWS_ACCESS_KEY_ID`    | Supabase Storage access key        | ✅       |
| `AWS_SECRET_ACCESS_KEY`| Supabase Storage secret key        | ✅       |
| `AWS_REGION`           | AWS region เช่น `ap-southeast-1`  | ✅       |
| `SUPABASE_ENDPOINT_URL`| Supabase S3 endpoint URL          | ✅       |
| `FRONTEND_URL`         | Frontend URL สำหรับ CORS           | ❌       |
| `PORT`                 | Port (default: 3000)               | ❌       |

---

## 🎯 Use Cases by Role

### 👨‍💼 Admin
- จัดการเขตเลือกตั้ง (CRUD)
- ดูอำเภอที่ว่างสำหรับผูกเขต
- จัดการผู้ใช้ทั้งหมด
- เปลี่ยน role ผู้ใช้

### 🗳️ EC (Election Commission)
- จัดการพรรคการเมือง (CRUD)
- จัดการผู้สมัคร (CRUD)
- ดูรายการเขตเลือกตั้ง
- ปิด/เปิดหีบเลือกตั้ง (ทีละเขต หรือ ทั้งหมด)

### 🙋 Voter
- ดูข้อมูลเขตเลือกตั้งของตัวเอง
- ดูรายการผู้สมัครในเขต
- ลงคะแนนเสียง
- เปลี่ยนคะแนนเสียง (ถ้าหีบยังเปิดอยู่)

### 🌐 Public
- ดูผลการเลือกตั้ง (dashboard)
- ดูผลรายเขตเลือกตั้ง
- ดูจังหวัดพร้อมเขตเลือกตั้ง
- ดูรายการพรรคการเมือง
- ดูรายการผู้สมัคร

---

## 🔗 Related

- **Frontend:** [election-frontend-project](https://election-frontend-project.vercel.app)
- **Repository:** [github.com/rotoon/election-backend-project](https://github.com/rotoon/election-backend-project)
