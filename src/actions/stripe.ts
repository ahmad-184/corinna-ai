"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { AuthenticatedAction, SafeAction } from "@/lib/safe-action";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

export const getPaymentConnectedAction = AuthenticatedAction(
  z.object({}),
  async ({}, user) => {
    try {
      const connected = await db.user.findUnique({
        where: { id: user.id },
        select: { stripeId: true },
      });

      return connected;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const createCustomerPaymentIntentSecretAction = SafeAction(
  z.object({ amount: z.number(), stripeId: z.string().min(1) }),
  async ({ amount, stripeId }) => {
    try {
      const res = await stripe.paymentIntents.create(
        {
          currency: "usd",
          amount: amount * 100,
          automatic_payment_methods: {
            enabled: true,
          },
        },
        {
          stripeAccount: stripeId,
        }
      );

      return { secret: res.client_secret };
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const upgradePlanAction = AuthenticatedAction(
  z.object({ plan: z.enum(["STANDARD", "PRO", "ULTIMATE"]) }),
  async ({ plan }, user) => {
    try {
      const res = await db.billings.update({
        where: {
          userId: user.id,
        },
        data: {
          plan: plan,
          credits: {
            increment: plan === "PRO" ? 50 : plan === "ULTIMATE" ? 500 : 10,
          },
        },
      });

      return res;
    } catch (err) {
      console.log(err);
      return returnError(err as Error);
    }
  }
);

export const increaseCreditAction = AuthenticatedAction(
  z.object({ credit: z.string() }),
  async ({ credit }, user) => {
    try {
      const res = await db.billings.update({
        where: {
          userId: user.id,
        },
        data: {
          credits: {
            increment: parseInt(credit),
          },
        },
      });

      return res;
    } catch (err) {
      return returnError(err as Error);
    }
  }
);
