import { z } from "zod";

export const signUpFormSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Name should have more than 3 characters" })
      .max(64, { message: "It is too much brother" }),
    email: z.string().email({ message: "Invalid email address" }),
    type: z.enum(["owner", "student"]),
    password: z
      .string()
      .min(8, { message: "password must have more than 8 characteres" })
      .max(64, {
        message: "It is too much brother, how do you want to you remember this",
      }),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password and Confirm password don't match",
    path: ["passwordConfirmation"],
  });

export const verifyEmailFormSchema = z.object({
  otp: z.string().max(6),
  userId: z.string(),
});

export const signInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(1),
  password: z
    .string()
    .min(8, { message: "password must have more than 8 characteres" }),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(1),
});

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "password must have more than 8 characteres" }),
    passwordConfirmation: z.string().min(8),
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password and Confirm password don't match",
    path: ["passwordConfirmation"],
  });
