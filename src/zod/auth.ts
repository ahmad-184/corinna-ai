import { z } from "zod";

export const signUpFormSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Name should have more than 3 characters" })
      .max(64, { message: "It is too much brother" }),
    email: z.string().email({ message: "Invalid email address" }).min(1),
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

export const verifyOtpFormSchema = z.object({
  otp: z.string().max(6).min(1, { message: "Please enter the code" }),
  userId: z
    .string()
    .min(1, { message: "You can not do this more than one time" }),
});

export const signInFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "password must have more than 8 characteres" }),
});

export const emailSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "password must have more than 8 characteres" }),
    passwordConfirmation: z.string().min(8),
    userId: z
      .string()
      .min(1, { message: "You can not do this more than one time" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password and Confirm password don't match",
    path: ["passwordConfirmation"],
  });
