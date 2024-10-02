import { z } from "zod";

export const ChatBotMessageSchema = z.object({
  content: z
    .string()
    .min(1)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  image: z.string().optional(),
});
