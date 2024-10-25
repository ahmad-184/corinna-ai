import { z } from "zod";

export const ChatBotMessageSchema = z.object({
  message: z
    .string()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  image: z.string().optional(),
});

export const ChatBotSettingsFormSchema = z.object({
  id: z.string().min(1),
  welcomeMessage: z
    .string()
    .min(1, { message: "Welcome message can not be empty." }),
  helpdesk: z.boolean().default(false),
  name: z.string().min(1, { message: "Bot name can not be empty." }),
  icon: z.string().optional(),
  avatar: z.string().optional(),
  company_name: z
    .string()
    .min(3, { message: "Atleast 3 chars required" })
    .optional(),
  watermark: z.boolean().default(false).optional(),
});

export const CreateMessageSchema = z
  .object({
    chatRoomId: z.string(),
    role: z.enum(["user", "assistant"]),
    link: z.string().optional(),
    seen: z.boolean().optional(),
  })
  .and(ChatBotMessageSchema);

export const UpdateMessageSchema = z.object({
  id: z.string().min(1),
  chatRoomId: z.string().optional(),
  role: z.enum(["user", "assistant"]).optional(),
  link: z.string().optional().optional(),
  message: z.string().optional().optional(),
  image: z.string().optional().optional(),
  seen: z.boolean().optional(),
});
