import bcrypt from "bcryptjs";
import { LoginUserInput } from "../models/user/loginUserDto";
import { RegisterUserInput } from "../models/user/registerUserDto";
import { findRoleByName } from "../repositories/RoleRepository";
import { createUser, findByCitizenId } from "../repositories/UserRepository";
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

  // เช็ค citizenId ซ้ำ
  const userExists = await findByCitizenId(citizenId);
  if (userExists) {
    return {
      ok: false as const,
      status: 409,
      message: "Citizen ID already exists",
    };
  }

  // default role = ROLE_VOTER
  const role = await findRoleByName(RoleName.VOTER);
  if (!role) {
    return {
      ok: false as const,
      status: 500,
      message: "Default role ROLE_VOTER not found",
    };
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await createUser({
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
}

export async function loginService(loginInput: LoginUserInput) {
  const { citizenId, password } = loginInput;

  // หา user
  const user = await findByCitizenId(citizenId);
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
