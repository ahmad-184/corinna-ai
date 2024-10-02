"use server";

import { redirect } from "next/navigation";
import { createUser, getUserByEmail, getUserById, updateUser } from "./user";
import { cache } from "react";
import { validateRequest } from "@/lib/auth";
import { deleteSession, setSession } from "@/lib/session";
import {
  EmailInUseError,
  LoginError,
  PublicError,
  returnError,
  VerifyCodeExpiredError,
} from "@/lib/errors";
import { emailSender } from "@/lib/email";
import verifyEmailTemplate from "@/templates/verify-email";
import { SafeAction } from "@/lib/safe-action";
import { rateLimitter } from "./global";
import {
  emailSchema,
  resetPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema,
  verifyOtpFormSchema,
} from "@/zod/auth";
import { db } from "@/lib/db";
import { Account, User } from "@prisma/client";
import {
  compareHashes,
  createHash,
  generateRandomSixDigitNumber,
  hashPassword,
} from "@/lib/use-cases";
import { z } from "zod";

const TOKEN_TTL = 1000 * 60 * 10; // 10 min

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return undefined;
  const user = await getUserById({ id: session.user.id });
  return user.data;
});

export const validateUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return redirect("/sign-in");
  const user = await getUserById({ id: session.user.id });
  if (!user.data) return redirect("/sign-in");
  return user.data;
});

export const logoutUser = async () => {
  await validateUser();
  await deleteSession();
  return redirect("/sign-in");
};

export const getAccountByUserId = SafeAction(
  z.object({ userId: z.string() }),
  async ({ userId }) => {
    try {
      const res = await db.account.findUnique({
        where: {
          userId,
        },
      });
      return res;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const registerUserAction = SafeAction(signUpFormSchema, async (data) => {
  try {
    await rateLimitter({ limit: 3, duration: 45 });

    const existingUser = await await db.user.findUnique({
      where: {
        email: data.email,
      },
      include: {
        Account: true,
      },
    });

    let user = null;

    if (existingUser) {
      if (existingUser.Account?.emailVerified) throw new EmailInUseError();
      const updated_user = await updateUser({
        id: existingUser.id,
        data: {
          fullname: data.fullname,
          type: data.type,
        },
      });
      if (updated_user.data) user = updated_user.data;
      if (!user) throw new PublicError();
    } else {
      const created_user = await createUser({
        type: data.type,
        email: data.email,
        fullname: data.fullname,
      });
      if (created_user.data) user = created_user.data;
      if (!user) throw new PublicError();
    }

    if (!user) throw new PublicError();

    const otp = generateRandomSixDigitNumber().toString();

    const hashedOtp = await createHash(otp);

    const acc_exist = await getAccountByUserId({ userId: user.id });

    let acc: { data: Account | null | void } = { data: null };
    if (acc_exist.data) {
      acc = await updateAccount({
        id: acc_exist.data.id,
        data: {
          type: "PASSWORD",
          password: data.password,
          otpToken: hashedOtp,
          otpExpireAt: new Date(Date.now() + TOKEN_TTL),
        },
      });
    } else {
      acc = await createAccount({
        userId: user.id,
        type: "PASSWORD",
        password: data.password,
        otpToken: hashedOtp,
        otpExpireAt: new Date(Date.now() + TOKEN_TTL),
      });
    }

    if (!acc.data)
      throw new PublicError("Something went wrong, please try again");

    const { error } = await emailSender({
      subject: "Verification code",
      body: verifyEmailTemplate({ code: otp }),
      email: user.email,
    });

    if (error)
      throw new PublicError("Our email sender fk up, please try again");

    return { id: user.id };
  } catch (err) {
    return returnError(err as Error);
  }
});

export const signInUserAction = SafeAction(signInFormSchema, async (data) => {
  try {
    const user = await getUserByEmail({ email: data.email });

    if (!user.data) throw new LoginError();

    const account = await getAccountByUserId({ userId: user.data.id });
    if (!account.data) throw new PublicError();

    if (account.data.type === "GOOGLE")
      throw new PublicError(
        "This email used to sign in with google, try another email or sign in with google"
      );

    if (!account.data.password) throw new PublicError();

    const result = await compareHashes(data.password, account.data.password);

    if (!result) throw new LoginError();

    await setSession(user.data.id);

    await updateAccount({
      id: account.data.id,
      data: {
        otpExpireAt: undefined,
        otpToken: "",
      },
    });

    return user.data.id;
  } catch (err) {
    return returnError(err as Error);
  }
});

export const sendForgotPasswordOtpUserAction = SafeAction(
  emailSchema,
  async (data) => {
    try {
      const user = await getUserByEmail({ email: data.email });
      if (!user.data) throw new PublicError("There is no user with this email");

      const account = await getAccountByUserId({ userId: user.data.id });
      if (!account.data)
        throw new PublicError("There is no user with this email");

      const otp = generateRandomSixDigitNumber().toString();

      const hashedOtp = await createHash(otp);

      await updateAccount({
        id: account.data.id,
        data: {
          otpToken: hashedOtp,
          otpExpireAt: new Date(Date.now() + TOKEN_TTL),
        },
      });

      const { error, message } = await emailSender({
        email: data.email,
        subject: `Rest password code`,
        body: verifyEmailTemplate({ code: otp }),
      });

      if (error)
        throw new PublicError(
          "Sorry our email sender fk up, please try again."
        );

      return user.data.id;
    } catch (err) {
      return returnError(err as Error);
    }
  }
);

export const verifyOtpAction = SafeAction(verifyOtpFormSchema, async (data) => {
  try {
    const account = await getAccountByUserId({ userId: data.userId });

    if (!account.data?.otpToken || !account.data?.otpExpireAt)
      throw new PublicError();

    const isEqual = await compareHashes(data.otp, account.data.otpToken);

    if (!Boolean(isEqual)) throw new PublicError("Entered code is incorrect");

    if (new Date(account.data.otpExpireAt) < new Date(Date.now()))
      throw new VerifyCodeExpiredError();

    await updateAccount({
      id: account.data.id,
      data: {
        otpExpireAt: undefined,
        otpToken: "",
      },
    });

    return account.data.userId;
  } catch (err) {
    return returnError(err as Error);
  }
});

export const resetPasswordUserAction = SafeAction(
  resetPasswordFormSchema,
  async (data) => {
    try {
      const user_exist = await getUserById({ id: data.userId });
      if (!user_exist.data) throw new PublicError("User not found");

      const account = await getAccountByUserId({ userId: data.userId });
      if (!account.data) throw new PublicError();

      const hashedPassword = await hashPassword(data.password, 10);

      await updateAccount({
        id: account.data.id,
        data: {
          password: hashedPassword,
        },
      });

      return user_exist.data.id;
    } catch (err) {
      return returnError(err as Error);
    }
  }
);

export const createAccount = SafeAction(
  z.object({
    type: z.enum(["PASSWORD", "GOOGLE"]),
    userId: z.string(),
    otpToken: z.string().optional(),
    otpExpireAt: z.date().optional(),
    password: z.string().optional(),
    verified: z.boolean().optional(),
  }),
  async ({ type, userId, password, verified, otpExpireAt, otpToken }) => {
    let hash;
    if (password) {
      hash = await hashPassword(password, 10);
    }
    const account = await db.account.create({
      data: {
        userId,
        password: hash,
        type,
        emailVerified: verified || false,
        otpExpireAt,
        otpToken,
      },
    });
    return account;
  }
);

export const getAccountById = SafeAction(
  z.object({
    id: z.string(),
  }),
  async ({ id }) => {
    try {
      const res = await db.account.findUnique({
        where: {
          id,
        },
      });
      return res;
    } catch (err) {
      return returnError(err as Error);
    }
  }
);

export const updateAccount = SafeAction(
  z.object({
    id: z.string(),
    data: z.object({
      emailVerified: z.boolean().optional(),
      password: z.string().optional(),
      otpToken: z.string().optional(),
      otpExpireAt: z.date().optional(),
      type: z.enum(["PASSWORD", "GOOGLE"]).optional(),
      userId: z.string().optional(),
    }),
  }),
  async ({ id, data }) => {
    try {
      const res = await db.account.update({
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
