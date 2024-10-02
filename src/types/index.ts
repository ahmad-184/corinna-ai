import {
  emailSchema,
  resetPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema,
  verifyOtpFormSchema,
} from "@/zod/auth";
import { ChatBotMessageSchema } from "@/zod/chat";
import {
  createDomainFormSchema,
  filterQuetionFormSchema,
  helpDeskFormSchema,
  useDomainSettingFormSchema,
} from "@/zod/domain";
import { User } from "@prisma/client";
import { z } from "zod";

export type UserType = Omit<User, "createdAt" | "updatedAt">;

export type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;

export type verifyOtpFormSchemaType = z.infer<typeof verifyOtpFormSchema>;

export type signInFormSchemaType = z.infer<typeof signInFormSchema>;

export type emailSchemaType = z.infer<typeof emailSchema>;

export type createDomainFormSchemaType = z.infer<typeof createDomainFormSchema>;

export type resetPasswordFormSchemaType = z.infer<
  typeof resetPasswordFormSchema
>;

export type useDomainSettingFormSchemaType = z.infer<
  typeof useDomainSettingFormSchema
>;

export type helpDeskFormSchemaType = z.infer<typeof helpDeskFormSchema>;

export type filterQuetionFormSchemaType = z.infer<
  typeof filterQuetionFormSchema
>;

export type ChatBotMessageSchemaType = z.infer<typeof ChatBotMessageSchema>;
