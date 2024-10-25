"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { AuthenticatedAction, SafeAction } from "@/lib/safe-action";
import { createProductFormSchema } from "@/zod/domain";
import { string, z } from "zod";

export const createProductAction = AuthenticatedAction(
  createProductFormSchema,
  async ({ domain_id, price, ...props }) => {
    try {
      const res = await db.product.create({
        data: {
          domainId: domain_id,
          price: parseInt(price),
          ...props,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const getDomainProductsAction = AuthenticatedAction(
  z.object({ domain_id: z.string().min(1) }),
  async ({ domain_id }) => {
    try {
      const res = await db.product.findMany({
        where: {
          domainId: domain_id,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const createTransactionAction = SafeAction(
  z.object({ price: z.number(), customer_id: z.string(), domain_id: string() }),
  async ({ domain_id, customer_id, price }) => {
    try {
      const res = await db.transaction.create({
        data: {
          price,
          domainId: domain_id,
          customerId: customer_id,
        },
        select: {
          id: true,
          price: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);
