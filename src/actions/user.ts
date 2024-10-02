import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { AuthenticatedAction, SafeAction } from "@/lib/safe-action";
import { z } from "zod";

export const getUserByEmail = SafeAction(
  z.object({ email: z.string() }),
  async (data) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email: data.email,
        },
        select: {
          type: true,
          id: true,
          avatar: true,
          email: true,
          fullname: true,
          stripeId: true,
          subscription: true,
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
        select: {
          type: true,
          id: true,
          avatar: true,
          email: true,
          fullname: true,
          stripeId: true,
          subscription: true,
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
          subscription: {
            create: {},
          },
        },
        select: {
          type: true,
          id: true,
          avatar: true,
          email: true,
          fullname: true,
          stripeId: true,
          subscription: true,
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
        select: {
          type: true,
          id: true,
          avatar: true,
          email: true,
          fullname: true,
          stripeId: true,
          subscription: true,
        },
      });
      return res;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const getUserSubscriptionPlan = AuthenticatedAction(
  z.object({
    user_id: z.string().min(1),
  }),
  async ({ user_id }) => {
    try {
      const res = await db.billings.findUnique({
        where: { userId: user_id },
        select: {
          plan: true,
        },
      });

      return res;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);
