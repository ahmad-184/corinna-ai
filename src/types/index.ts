import { getMenuRoomsDataAction } from "@/actions/conversation";
import {
  emailSchema,
  resetPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema,
  verifyOtpFormSchema,
} from "@/zod/auth";
import {
  ChatBotMessageSchema,
  ChatBotSettingsFormSchema,
  CreateMessageSchema,
} from "@/zod/chat";
import {
  createDomainFormSchema,
  createProductFormSchema,
  filterQuetionFormSchema,
  helpDeskFormSchema,
  useDomainSettingFormSchema,
} from "@/zod/domain";
import {
  CreateCampaignFormSchema,
  UpdateEmailTemplateFormSchema,
} from "@/zod/marketing";
import { portalFormSchema } from "@/zod/portal";
import { Prisma, Role, User } from "@prisma/client";
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

export type MenuRoomsDataType = {
  domains_list: {
    id: string;
    name: string;
  }[];
  customers_list: {
    id: string;
    email: string | null;
    domainId: string | null;
    chatRoom: {
      message: {
        message: string;
        id: string;
        createdAt: Date;
        role: Role;
        image: string | null;
        link: string | null;
        chatRoomId: string | null;
        seen: boolean;
      }[];
      id: string;
      createdAt: Date;
    }[];
  }[];
} | null;

export type ChatBotMessageSchemaType = z.infer<typeof ChatBotMessageSchema>;

export type CreateMessageSchemaType = z.infer<typeof CreateMessageSchema>;

export type ChatBotSettingsFormSchemaType = z.infer<
  typeof ChatBotSettingsFormSchema
>;

export type ChatsStateType =
  | {
      role: "assistant" | "user";
      message: string;
      image?: string;
      link?: string;
      createdAt: Date;
    }[]
  | [];

export type PortalFormType = "Appointment" | "Payment";

export type portalFormSchemaType = z.infer<typeof portalFormSchema>;

export type createProductFormSchemaType = z.infer<
  typeof createProductFormSchema
>;

export type CreateCampaignFormSchemaType = z.infer<
  typeof CreateCampaignFormSchema
>;

export type UpdateEmailTemplateFormSchemaType = z.infer<
  typeof UpdateEmailTemplateFormSchema
>;
