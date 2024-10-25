"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { SafeAction } from "@/lib/safe-action";
import { z } from "zod";

export const getCustomerResponsesAction = SafeAction(
  z.object({ customer_id: z.string().min(1) }),
  async ({ customer_id }) => {
    try {
      const res = await db.customer.findUnique({
        where: { id: customer_id },
        select: {
          id: true,
          email: true,
          questions: {
            select: {
              answered: true,
              id: true,
              question: true,
            },
          },
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const updateCustomerResponsesAction = SafeAction(
  z.object({
    questions: z.record(z.string().nullable()),
  }),
  async ({ questions }) => {
    try {
      const update = Object.entries(questions).map((e) =>
        db.customerResponses.update({
          where: { id: e[0] },
          data: {
            answered: e[1],
          },
        })
      );
      await db.$transaction(update);

      return { status: 200 };
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const getCustomerQuestionsResponsesAction = SafeAction(
  z.object({
    customerId: z.string().min(1),
  }),
  async ({ customerId }) => {
    try {
      const res = await db.customerResponses.findMany({
        where: {
          customerId,
        },
        select: {
          id: true,
          question: true,
          answered: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);
