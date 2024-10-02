"use server";

import { db } from "@/lib/db";
import { AccesssibilityError, PublicError, returnError } from "@/lib/errors";
import { AuthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { updateChatBotAction } from "./chat-bot";
import {
  filterQuetionFormSchema,
  helpDeskFormSchema,
  useDomainSettingFormSchema,
} from "@/zod/domain";

export const getUserDomains = AuthenticatedAction(
  z.object({}),
  async (_, user) => {
    try {
      const res = await db.domain.findMany({
        where: {
          userId: user.id,
        },
        select: {
          name: true,
          icon: true,
          id: true,
          customer: {
            select: {
              chatRoom: {
                select: {
                  id: true,
                  live: true,
                },
              },
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

export const createDomainAction = AuthenticatedAction(
  z.object({
    name: z.string().min(3),
    image: z.string().default("").optional(),
  }),
  async (data, user) => {
    try {
      const subscription = await db.billings.findUnique({
        where: {
          userId: user.id,
        },
      });
      const domain_counts = await db.domain.count({
        where: { userId: user.id },
      });

      if (!subscription) throw new PublicError("User plan not found");

      if (
        (subscription.plan === "STANDARD" && domain_counts >= 1) ||
        (subscription.plan === "PRO" && domain_counts >= 5) ||
        (subscription.plan === "ULTIMATE" && domain_counts >= 10)
      )
        throw new PublicError(
          "You've reached the maximum number of domains, upgrade your plan"
        );

      const domain_exist = await db.domain.findFirst({
        where: {
          name: data.name,
        },
      });

      if (domain_exist)
        throw new PublicError(
          "There is a domain with this name, please choose a diffrent name"
        );

      const new_domain = await db.domain.create({
        data: {
          name: data.name,
          icon: data.image || "",
          userId: user.id,
          chatBot: {
            create: {
              welcomeMessage: "Hey there, have a question? Text us here.",
            },
          },
        },
        select: {
          id: true,
        },
      });

      return new_domain;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const updateDomainAction = AuthenticatedAction(
  z.object({
    id: z.string().min(1),
    data: useDomainSettingFormSchema.pick({ name: true, domain_icon: true }),
  }),
  async (data) => {
    try {
      const res = await db.domain.update({
        where: { id: data.id },
        data: {
          name: data.data.name,
          icon: data.data.domain_icon,
        },
        select: {
          name: true,
          userId: true,
          icon: true,
          id: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const deleteDomainAction = AuthenticatedAction(
  z.object({
    id: z.string().min(1),
  }),
  async (data, user) => {
    try {
      const domain = await db.domain.findUnique({ where: { id: data.id } });

      if (!domain) throw new PublicError("Domain not found");
      if (domain.userId !== user.id) throw new AccesssibilityError();

      const res = await db.domain.delete({
        where: { id: data.id },
        select: {
          id: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const updateDomainSettingsAction = AuthenticatedAction(
  z.object({
    domain_id: z.string().min(1),
    chatbot_id: z.string().min(1),
    data: useDomainSettingFormSchema,
  }),
  async ({ chatbot_id, data, domain_id }, user) => {
    try {
      const domain_res = await updateDomainAction({
        id: domain_id,
        data: { name: data.name, domain_icon: data.domain_icon },
      });
      const chatbot_res = await updateChatBotAction({
        id: chatbot_id,
        data: { icon: data.chatbot_icon, welcomeMessage: data.welcomeMessage },
      });
      return {
        domain: domain_res,
        chatbot: chatbot_res,
      };
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const getAllHelDeskQuestionsAction = AuthenticatedAction(
  z.object({
    domainId: z.string().min(1),
  }),
  async ({ domainId }) => {
    try {
      const res = await db.helpDesk.findMany({
        where: { domainId },
        select: {
          id: true,
          answer: true,
          question: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const createHelpDeskQuestionAction = AuthenticatedAction(
  z
    .object({
      domain_id: z.string().min(1),
    })
    .and(helpDeskFormSchema),
  async ({ domain_id, answer, question }) => {
    try {
      const res = await db.helpDesk.create({
        data: {
          domainId: domain_id,
          question,
          answer,
        },
        select: {
          id: true,
          answer: true,
          question: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const deleteHelpDeskQuestionAction = AuthenticatedAction(
  z.object({
    id: z.string().min(1),
  }),
  async ({ id }) => {
    try {
      const res = await db.helpDesk.delete({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const createFilterQuestionAction = AuthenticatedAction(
  z
    .object({
      domainId: z.string().min(1),
    })
    .and(filterQuetionFormSchema),
  async ({ domainId, question }) => {
    try {
      const res = await db.filterQuestions.create({
        data: {
          domainId,
          question,
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

export const deleteFilterQuestionAction = AuthenticatedAction(
  z.object({
    id: z.string().min(1),
  }),
  async ({ id }) => {
    try {
      const res = await db.filterQuestions.delete({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const getAllFilterQuestionsAction = AuthenticatedAction(
  z.object({
    domainId: z.string().min(1),
  }),
  async ({ domainId }) => {
    try {
      const res = await db.filterQuestions.findMany({
        where: {
          domainId,
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
