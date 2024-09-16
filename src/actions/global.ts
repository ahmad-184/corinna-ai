import { TooManyRequest } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const rateLimitter = async ({
  limit = 3,
  duration = 25,
  identifier,
}: {
  limit?: number;
  duration?: number;
  identifier?: string;
}) => {
  const header = await headers();
  const ip = header.get("x-forwarded-for") as string;
  const rateLimitter = await rateLimit({ limit, duration });
  const { success } = await rateLimitter.limit(identifier || ip);
  if (!success) throw new TooManyRequest();
};
