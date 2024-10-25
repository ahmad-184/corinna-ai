"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { AuthenticatedAction, SafeAction } from "@/lib/safe-action";
import { z } from "zod";

export const getAllDomainBookingsAction = SafeAction(
  z.object({ domain_id: z.string().min(1) }),
  async ({ domain_id }) => {
    try {
      const res = await db.bookings.findMany({
        where: { domainId: domain_id },
        select: {
          slot: true,
          date: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const createNewAppointmentAction = SafeAction(
  z.object({
    domain_id: z.string().min(1),
    customer_id: z.string().min(1),
    slot: z.string().min(1),
    date: z.date(),
    email: z.string(),
  }),
  async ({ customer_id, date, domain_id, email, slot }) => {
    try {
      const res = await db.bookings.create({
        data: {
          date,
          email,
          slot,
          customerId: customer_id,
          domainId: domain_id,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          slot: true,
          date: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const deleteManyAppointmentAction = AuthenticatedAction(
  z.array(z.string()),
  async (data) => {
    try {
      await db.bookings.deleteMany({
        where: {
          id: {
            in: data,
          },
        },
      });

      return { status: 200 };
    } catch (err) {
      returnError(err as Error);
    }
  }
);
