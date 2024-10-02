"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { AuthenticatedAction, SafeAction } from "@/lib/safe-action";
import { useDomainSettingFormSchema } from "@/zod/domain";
import { z } from "zod";

export const updateChatBotAction = AuthenticatedAction(
  z.object({
    id: z.string().min(1),
    data: useDomainSettingFormSchema
      .omit({ name: true, domain_icon: true, chatbot_icon: true })
      .and(z.object({ icon: z.string().optional() })),
  }),
  async (data) => {
    try {
      const res = await db.chatBot.update({
        where: { id: data.id },
        data: { ...data.data },
        select: {
          id: true,
          icon: true,
          welcomeMessage: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const getCurrentBotDataAction = SafeAction(
  z.object({
    id: z.string().min(1),
  }),
  async ({ id }) => {
    try {
      console.log("bot id: ", id);
      const chatbot = await db.chatBot.findUnique({
        where: { id },
        select: {
          background: true,
          domainId: true,
          helpdesk: true,
          icon: true,
          id: true,
          textColor: true,
          welcomeMessage: true,
        },
      });
      if (!chatbot || !chatbot?.domainId) return null;
      const helpdesk = await db.helpDesk.findMany({
        where: { domainId: chatbot.domainId },
      });
      return {
        chatbot,
        helpdesk,
      };
    } catch (err) {
      returnError(err as Error);
    }
  }
);

// export const getCurrentBotChatsAction = AuthenticatedAction(
//   z.object({
//     id: z.string().min(1),
//   }),
//   async ({ id }) => {
//     try {
//       const chatbot = await db.chatBot.findUnique({
//         where: { id },
//         select: {
//           background: true,
//           domainId: true,
//           helpdesk: true,
//           icon: true,
//           id: true,
//           textColor: true,
//           welcomeMessage: true,
//         },
//       });
//       if (!chatbot || !chatbot?.domainId) return null;
//       const helpdesk = await db.helpDesk.findMany({
//         where: { domainId: chatbot.domainId },
//       });

//       return {
//         chatbot,
//         helpdesk,
//       };
//     } catch (err) {
//       returnError(err as Error);
//     }
//   }
// );
