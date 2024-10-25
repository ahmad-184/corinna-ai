"use server";

import { db } from "@/lib/db";
import { emailSender } from "@/lib/email";
import { PublicError, returnError } from "@/lib/errors";
import { AuthenticatedAction } from "@/lib/safe-action";
import {
  CreateCampaignFormSchema,
  UpdateEmailTemplateFormSchema,
} from "@/zod/marketing";
import { z } from "zod";

export const createCampaignAction = AuthenticatedAction(
  CreateCampaignFormSchema,
  async ({ name }, user) => {
    try {
      const res = await db.campaign.create({
        data: {
          name,
          userId: user.id,
        },
        select: {
          id: true,
          name: true,
          Customer: true,
          createdAt: true,
        },
      });

      return res;
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const deleteCampaignAction = AuthenticatedAction(
  z.object({ campaign_id: z.string() }),
  async ({ campaign_id }, user) => {
    try {
      const res = await db.campaign.delete({
        where: {
          id: campaign_id,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return res;
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const addCustomersToCampaignAction = AuthenticatedAction(
  z.object({
    campaignId: z.string().min(1),
    customers: z.array(z.string()).min(1),
  }),
  async ({ campaignId, customers }) => {
    try {
      await db.$transaction(
        customers.map((e) =>
          db.campaign.update({
            where: { id: campaignId },
            data: {
              Customer: {
                connect: {
                  id: e,
                },
              },
            },
          })
        )
      );

      return { status: 200 };
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const removeCustomerCampaignAction = AuthenticatedAction(
  z.object({
    campaignId: z.string().min(1),
    customers: z.array(z.string()).min(1),
  }),
  async ({ campaignId, customers }) => {
    try {
      await db.$transaction(
        customers.map((e) =>
          db.campaign.update({
            where: { id: campaignId },
            data: {
              Customer: {
                disconnect: {
                  id: e,
                },
              },
            },
          })
        )
      );

      return { status: 200 };
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const updateEmailTemplateAction = AuthenticatedAction(
  UpdateEmailTemplateFormSchema,
  async ({ campaignId, emailTemplate }) => {
    try {
      const res = await db.campaign.update({
        where: { id: campaignId },
        data: {
          template: emailTemplate,
        },
        select: {
          id: true,
          name: true,
          template: true,
        },
      });

      return res;
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const sendEmailMarketingAction = AuthenticatedAction(
  z.object({ campaignId: z.string().min(1) }),
  async ({ campaignId }, user) => {
    try {
      const campaign = await db.campaign.findUnique({
        where: { id: campaignId },
        include: {
          Customer: {
            select: { email: true },
          },
        },
      });

      if (!campaign) throw new PublicError("Campaign dos not exist.");
      if (!campaign.Customer.length)
        throw new PublicError("Please add customer to campaign.");
      if (!campaign.template)
        throw new PublicError("Please create a template for campaign.");

      if (!user.subscription)
        throw new PublicError("Subscription plan not found.");
      const remainCredits =
        user.subscription.credits - user.subscription.spent_credits;
      if (remainCredits === 0 || campaign.Customer.length > remainCredits)
        throw new PublicError("Not enough credit.");

      const { error, message } = await emailSender({
        body: JSON.parse(campaign.template) || "",
        email: campaign.Customer.map((e) => e.email || ""),
        subject: campaign.name,
      });

      if (error) throw new PublicError(message);

      await db.billings.update({
        where: { userId: user.id },
        data: {
          spent_credits: {
            increment: campaign.Customer.length,
          },
        },
      });

      return { status: 200 };
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);
