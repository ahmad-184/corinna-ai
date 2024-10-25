import { z } from "zod";

export const portalFormSchema = z.object({
  date: z.date(),
  slot: z.string().min(1),
});
