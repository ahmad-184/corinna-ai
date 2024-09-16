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
  forgotPasswordFormSchema,
  resetPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema,
  verifyEmailFormSchema,
} from "@/zod/auth";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import {
  compareHashes,
  createHash,
  createJwtToken,
  generateRandomSixDigitNumber,
  hashPassword,
  verifyJwtToken,
} from "@/lib/use-cases";
import resetPasswordTemplate from "@/templates/reset-password";
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
  return redirect("/");
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

    let user: User | null = null;

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

    const verify_otp_data_exist = await getVerifyOtpByUserId({
      userId: user.id,
    });

    if (verify_otp_data_exist.data) {
      await deleteVerifyOtp({ userId: verify_otp_data_exist.data.userId });
    }

    const verifyOtpData = await createVerifyOtp({
      userId: user.id,
      otp,
    });

    if (!verifyOtpData) throw new PublicError();

    const acc = await createAccount({
      userId: user.id,
      type: "PASSWORD",
      password: data.password,
    });
    if (!acc.data) throw new PublicError();

    const { error } = await emailSender({
      subject: "Verify your email",
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

export const verifyEmailAction = SafeAction(
  verifyEmailFormSchema,
  async (data) => {
    try {
      const verifiy_otp_data = await getVerifyOtpByUserId({
        userId: data.userId,
      });

      if (!verifiy_otp_data.data)
        throw new PublicError("Something went wrong, please try again");

      const isEqual = await compareHashes(data.otp, verifiy_otp_data.data.otp);

      if (!Boolean(isEqual)) throw new PublicError("Entered code is incorrect");

      if (new Date(verifiy_otp_data.data.expireAt) < new Date(Date.now()))
        throw new VerifyCodeExpiredError();

      const account = await getAccountByUserId({
        userId: verifiy_otp_data.data.userId,
      });

      if (!account.data) throw new PublicError();

      await updateAccount({
        id: account.data.id,
        data: {
          emailVerified: true,
        },
      });

      await deleteVerifyOtp({ userId: verifiy_otp_data.data.userId });

      return verifiy_otp_data.data.userId;
    } catch (err) {
      return returnError(err as Error);
    }
  }
);

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

    return user.data.id;
  } catch (err) {
    return returnError(err as Error);
  }
});

export const forgotPasswordUserAction = SafeAction(
  forgotPasswordFormSchema,
  async (data) => {
    try {
      const user = await getUserByEmail({ email: data.email });

      if (!user.data) throw new PublicError("There is no user with this email");

      const token = await createJwtToken({
        data: {
          user_id: user.data.id,
        },
        expireAt: 10 * 60,
      });

      if (!token) throw new PublicError();

      const link = `${process.env.NEXT_PUBLIC_URL}/forgot-password?token=${token}`;

      const { error, message } = await emailSender({
        email: data.email,
        subject: `Rest Your Password`,
        body: resetPasswordTemplate({
          link,
        }),
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

export const resetPasswordUserAction = SafeAction(
  resetPasswordFormSchema,
  async (data) => {
    try {
      const verified_token = (await verifyJwtToken(data.token)) as {
        user_id: string;
      };

      if (!verified_token) throw new PublicError("Link expired or invalid");

      const { user_id } = verified_token;
      if (!user_id) throw new PublicError("Link expired or invalid");

      const user_exist = await getUserById({ id: user_id });

      if (!user_exist) throw new PublicError("User not found");

      const account = await getAccountByUserId({ userId: user_id });
      if (!account.data) throw new PublicError();

      const hashedPassword = await hashPassword(data.password, 10);

      await updateAccount({
        id: account.data.id,
        data: {
          password: hashedPassword,
        },
      });

      return user_id;
    } catch (err) {
      return returnError(err as Error);
    }
  }
);

export const createAccount = SafeAction(
  z.object({
    type: z.enum(["PASSWORD", "GOOGLE"]),
    userId: z.string(),
    password: z.string().optional(),
    verified: z.boolean().optional(),
  }),
  async ({ type, userId, password, verified }) => {
    const account_exist = await db.account.findUnique({ where: { userId } });
    if (account_exist) await db.account.delete({ where: { userId } });

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
      },
    });
    return account;
  }
);

export const updateAccount = SafeAction(
  z.object({
    id: z.string(),
    data: z.object({
      emailVerified: z.boolean().optional(),
      password: z.string().optional(),
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

export const createVerifyOtp = SafeAction(
  z.object({ userId: z.string(), otp: z.string() }),
  async ({ userId, otp }) => {
    try {
      const hashedOtp = await createHash(otp);

      const existing_varify_otp = await db.verifyEmailOtp.findUnique({
        where: {
          userId,
        },
      });

      if (existing_varify_otp) {
        await db.verifyEmailOtp.deleteMany({
          where: {
            userId,
          },
        });
      }

      const res = await db.verifyEmailOtp.create({
        data: {
          userId,
          expireAt: new Date(Date.now() + TOKEN_TTL),
          otp: hashedOtp,
        },
      });

      return res;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const deleteVerifyOtp = SafeAction(
  z.object({ userId: z.string() }),
  async ({ userId }) => {
    try {
      const res = await db.verifyEmailOtp.deleteMany({
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

export const getVerifyOtpByUserId = SafeAction(
  z.object({ userId: z.string() }),
  async ({ userId }) => {
    try {
      const res = await db.verifyEmailOtp.findUnique({
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
