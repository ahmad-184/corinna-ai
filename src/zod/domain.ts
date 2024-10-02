import { z } from "zod";

export const createDomainFormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "A domain must have atleast 3 characters" })
    .refine(
      (value) =>
        /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,3}$/.test(value ?? ""),
      { message: "This is not a valid domain" }
    ),
  image: z.string().default("").optional(),
});

export const useDomainSettingFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "A domain must have atleast 3 characters" })
    .refine(
      (value) =>
        /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,3}$/.test(value ?? ""),
      { message: "This is not a valid domain" }
    ),
  welcomeMessage: z
    .string()
    .min(6, { message: "Welcome message must have atleast 6 characters" }),
  chatbot_icon: z.string().optional(),
  domain_icon: z.string().optional(),
});

export const helpDeskFormSchema = z.object({
  question: z.string().min(1, { message: "Question can not be empty" }),
  answer: z.string().min(1, { message: "Answer can not be empty" }),
});

export const filterQuetionFormSchema = z.object({
  question: z.string().min(1, { message: "Question can not be empty" }),
});
