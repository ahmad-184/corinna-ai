import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { SafeAction } from "@/lib/safe-action";
import { z } from "zod";

export const getUserByEmail = SafeAction(
  z.object({ email: z.string() }),
  async (data) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email: data.email,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const getUserById = SafeAction(
  z.object({ id: z.string() }),
  async (data) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id: data.id,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const createUser = SafeAction(
  z.object({
    fullname: z.string(),
    email: z.string().email(),
    id: z.string().optional(),
    avatar: z.string().optional(),
    type: z.string(),
  }),
  async (data) => {
    try {
      const user = await db.user.create({
        data: {
          fullname: data.fullname,
          email: data.email,
          type: data.type,
          ...(data.id && { id: data.id }),
          ...(data.avatar && { avatar: data.avatar }),
        },
      });
      return user;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const updateUser = SafeAction(
  z.object({
    id: z.string(),
    data: z.object({
      id: z.string().optional(),
      fullname: z.string().optional(),
      avatar: z.string().optional(),
      type: z.string().optional(),
      stripeId: z.string().optional(),
      email: z.string().email().optional(),
    }),
  }),
  async ({ id, data }) => {
    try {
      const res = await db.user.update({
        where: { id },
        data,
      });
      return res;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);
