import { z } from "zod";
import { ZodValidator } from "./use-cases";
import { validateUser } from "@/actions/auth";
import { Prisma } from "@prisma/client";

export function SafeAction<
  InputZod extends
    | z.ZodEffects<z.ZodObject<z.ZodRawShape>>
    | z.ZodIntersection<z.ZodObject<z.ZodRawShape>, z.ZodObject<z.ZodRawShape>>
    | z.ZodObject<z.ZodRawShape>
    | z.ZodArray<z.ZodMap<z.ZodType, z.ZodType>, "many">,
  Output
>(validator: InputZod, action: (input: z.infer<InputZod>) => Promise<Output>) {
  return async (input: z.infer<InputZod>) => {
    try {
      const validatedInput = ZodValidator(validator, input);
      const responseDto = await action(validatedInput);

      return { data: responseDto };
    } catch (e) {
      if (e instanceof Error) {
        return {
          data: null,
          error: e.message || "Something went wrong",
        };
      } else return { data: null, error: "Something went wrong" };
    }
  };
}

export function AuthenticatedAction<
  InputZod extends
    | z.ZodEffects<z.ZodObject<z.ZodRawShape>>
    | z.ZodIntersection<z.ZodObject<z.ZodRawShape>, z.ZodObject<z.ZodRawShape>>
    | z.ZodObject<z.ZodRawShape>
    | z.ZodArray<z.ZodString, "many">
    | z.ZodArray<z.ZodMap<z.ZodType, z.ZodType>, "many">,
  Output
>(
  validator: InputZod,
  action: (
    input: z.infer<InputZod>,
    user: Prisma.PromiseReturnType<typeof validateUser>
  ) => Promise<Output>
) {
  return async (input: z.infer<InputZod>) => {
    try {
      const user = await validateUser();

      const validatedInput = ZodValidator(validator, input);
      const responseDto = await action(validatedInput, user);

      return { data: responseDto };
    } catch (e) {
      if (e instanceof Error) {
        return { data: null, error: e.message };
      } else return { data: null, error: "Something went wrong" };
    }
  };
}
