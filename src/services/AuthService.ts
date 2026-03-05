import bcrypt from "bcryptjs";
import { LoginUserInput } from "../models/user/loginUserDto";
import { RegisterUserInput } from "../models/user/registerUserDto";
import { findRoleByName } from "../repositories/RoleRepository";
import { createUserRepository, findByCitizenIdRepository } from "../repositories/UserRepository";
import { signAccessToken, verifyAccessToken } from "../utils/jwt";
import { findByUserIdService } from "./UserService";
import { RoleName } from "@/models/role/roleNameDto";

export async function registerService(regisInput: RegisterUserInput) {
  const {
    citizenId,
    password,
    firstName,
    lastName,
    address,
    provinceId,
    districtId,
  } = regisInput;

  if (citizenId.length !== 13) {
    return {
      ok: false as const,
      status: 400,
      message: "The national identification number must have 13 digits.",
    };
  }

  if (!/^\d{13}$/.test(citizenId)) {
    return {
      ok: false as const,
      status: 400,
      message: "Citizen ID must contain exactly 13 digits",
    };
  }
  //ต้องเป็นตัวเลขล้วน 13 ตัว และไม่มีอย่างอื่นเลย 
  // / ... / --> Regular Expression (Regex)
  // \d --> ตัวเลข 0–9
  // {13} --> ต้องมีจำนวน 13 ตัวพอดี
  // ^ --> ต้องเริ่มต้นจากตัวแรกของข้อความ
  // $ --> ต้องจบตรงนี้พอดี


  if (typeof provinceId !== "number" || Number.isNaN(provinceId)) {
    return {
      ok: false as const,
      status: 400,
      message: "provinceId must be a valid number",
    };
  }

  const userExists = await findByCitizenIdRepository(citizenId);
  if (userExists) {
    return {
      ok: false as const,
      status: 409,
      message: "Citizen ID already exists",
    };
  }

  const role = await findRoleByName(RoleName.VOTER);
  if (!role) {
    return {
      ok: false as const,
      status: 500,
      message: "Default role ROLE_VOTER not found",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await createUserRepository({
      citizenId,
      hashedPassword,
      firstName,
      lastName,
      address,
      provinceId,
      districtId,
      roleId: role.id,
    });

    return {
      ok: true as const,
      data: user,
    };
  } catch (err: any) {
    // ดัก error จาก repository ตรงนี้เลย

    if (err.message === "District not found") {
      return {
        ok: false as const,
        status: 404,
        message: err.message,
      };
    }

    if (err.message === "District does not belong to selected province") {
      return {
        ok: false as const,
        status: 400,
        message: err.message,
      };
    }

  }
}

export async function loginService(loginInput: LoginUserInput) {
  const { citizenId, password } = loginInput;

  // หา user
  const user = await findByCitizenIdRepository(citizenId);
  if (!user) {
    return {
      ok: false as const,
      status: 401,
      message: "Invalid citizenId or password",
    };
  }

  // compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return {
      ok: false as const,
      status: 401,
      message: "Invalid citizenId or password",
    };
  }

  // role names
  const roles = user.roles.map((r: { role: { name: string } }) => r.role.name);

  // sign token
  const accessToken = signAccessToken({
    userId: user.id,
    citizenId: user.citizenId,
    roles,
  });

  return {
    ok: true as const,
    data: {
      accessToken,
    },
  };
}

export async function meService(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const decoded = verifyAccessToken(token);
  return findByUserIdService(decoded.userId);
}
