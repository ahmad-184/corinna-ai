import bcrypt from "bcryptjs";
// import { User } from "@prisma/client";
import { Schema } from "zod";
import jwt from "jsonwebtoken";
import { PublicError } from "./errors";
import { User } from "@prisma/client";

export async function hashPassword(
  plainTextPassword: string,
  salt: number = 10
) {
  return await bcrypt.hash(plainTextPassword, salt);
}

export function generateRandomSixDigitNumber(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export const createHash = async (string: string) => {
  return await bcrypt.hash(string, 10);
};

export const compareHashes = (candidate: string, mainValue: string) => {
  return bcrypt.compare(candidate, mainValue);
};

export const returnUserDataUseCase = (data: User) => {
  return {
    id: data.id,
    fullname: data.fullname,
    avatar: data.avatar,
    type: data.type,
    email: data.email,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const ZodValidator = <T>(schema: Schema, data: T): T => {
  const res = schema.safeParse(data);
  if (!res.success) throw new PublicError(res.error.message);
  return res.data;
};

export const createJwtToken = async ({
  data,
  expireAt,
}: {
  data: any;
  expireAt: number;
}) => {
  return await jwt.sign(data, process.env.PW!, {
    expiresIn: expireAt,
  });
};

export const verifyJwtToken = async (token: string) => {
  const res = await jwt.verify(token, process.env.PW!);
  return res;
};
