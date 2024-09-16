import { signUpFormSchema } from "@/zod/auth";
import { z } from "zod";

export type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;
