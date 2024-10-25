"use server";

import { db } from "@/lib/db";
import { emailSender } from "@/lib/email";
import { PublicError, returnError } from "@/lib/errors";
import { GeminiAIModel } from "@/lib/gemeniai";
import { AuthenticatedAction, SafeAction } from "@/lib/safe-action";
import { supabase } from "@/lib/supabase";
import { extractEmailsFromString, extractURLfromString } from "@/lib/use-cases";
import {
  ChatBotMessageSchema,
  ChatBotSettingsFormSchema,
  CreateMessageSchema,
  UpdateMessageSchema,
} from "@/zod/chat";
import { generateBusinessNameWithAiFormSchema } from "@/zod/domain";
import { ChatMessage } from "@prisma/client";
import { boolean, z } from "zod";

export const updateChatbotAction = AuthenticatedAction(
  ChatBotSettingsFormSchema,
  async (
    {
      helpdesk,
      id,
      name,
      welcomeMessage,
      avatar,
      company_name,
      icon,
      watermark,
    },
    user
  ) => {
    try {
      if (watermark === true && user.subscription?.plan === "STANDARD")
        throw new PublicError("Need to have premium subscription");

      const res = await db.chatBot.update({
        where: { id },
        data: {
          welcomeMessage: welcomeMessage,
          name,
          helpdesk,
          avatar,
          company_name,
          icon,
          watermark,
        },
        select: {
          avatar: true,
          company_name: true,
          helpdesk: true,
          domainId: true,
          icon: true,
          id: true,
          name: true,
          watermark: true,
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
      const chatbot = await db.chatBot.findUnique({
        where: { id },
        select: {
          domainId: true,
          helpdesk: true,
          icon: true,
          id: true,
          welcomeMessage: true,
          company_name: true,
          avatar: true,
          name: true,
          watermark: true,
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

export const onChatWithAiAction = SafeAction(
  z
    .object({
      bot_id: z.string(),
      chats: z.array(
        z.object({
          id: z.string().optional(),
          message: z.string(),
          image: z.string().optional(),
          role: z.enum(["user", "assistant"]),
        })
      ),
      customerEmail: z.string().optional(),
    })
    .and(ChatBotMessageSchema),
  async ({
    bot_id,
    chats,
    message,
    image,
    customerEmail: saveCustomerEmail,
  }): Promise<
    | {
        live?: boolean;
        chatRoomId?: string;
        role?: string;
        content?: string;
        link?: string;
        customerEmail?: string;
        message?: Omit<ChatMessage, "updatedAt"> | null | undefined;
        user_msg?: Omit<ChatMessage, "updatedAt"> | null | undefined;
      }
    | undefined
  > => {
    try {
      let customerEmail: string | undefined = saveCustomerEmail || undefined;

      const domain = await db.domain.findFirst({
        where: {
          chatBot: {
            id: bot_id,
          },
        },
        select: {
          name: true,
          id: true,
          User: true,
          filterQuestions: {
            select: { question: true },
          },
          chatBot: {
            select: {
              company_name: true,
              name: true,
            },
          },
        },
      });
      if (!domain) throw new PublicError();

      const extractedEmailArray = extractEmailsFromString(message || "");
      if (extractedEmailArray?.length) customerEmail = extractedEmailArray[0];

      if (customerEmail) {
        const getCustomer = await db.customer.findFirst({
          where: { email: { startsWith: customerEmail }, domainId: domain.id },
          select: {
            id: true,
            email: true,
            chatRoom: { select: { id: true, live: true, mailed: true } },
          },
        });

        if (!getCustomer?.id) {
          const newCustomer = await db.customer.create({
            data: {
              email: customerEmail,
              questions: { create: domain.filterQuestions },
              domainId: domain.id,
              chatRoom: {
                create: {},
              },
            },
          });

          if (!newCustomer.email) throw new PublicError();
          return {
            role: "assistant",
            content: `Welcome aboard ${
              newCustomer.email.split("@")[0]
            }! I'm glad to connect with you. Is there anything you need help with?`,
            customerEmail,
          };
        }

        const user_msg = await createMessageAction({
          chatRoomId: getCustomer.chatRoom[0].id,
          message,
          image,
          role: "user",
        });

        if (getCustomer.chatRoom[0].live) {
          if (!getCustomer.chatRoom[0].mailed) {
            await emailSender({
              email: domain.User?.email || "",
              subject: "A Customer Need Support",
              body: "One of your customer need support.",
            });

            await db.chatRoom.update({
              where: { id: getCustomer.chatRoom[0].id },
              data: { mailed: true },
            });
          }

          return {
            chatRoomId: getCustomer.chatRoom[0].id,
            customerEmail,
            user_msg: user_msg.data,
          };
        }

        const allChats = [...chats, { role: "user", message }].map((e) => {
          return `${e.role === "user" ? "customer" : domain.chatBot?.name}: ${
            e.message
          }`;
        });

        const appointment_link = `${process.env.NEXT_PUBLIC_URL}portal/${domain.id}/appointment/${getCustomer.id}`;
        const products_link = `${process.env.NEXT_PUBLIC_URL}portal/${domain.id}/payment/${getCustomer.id}`;

        const prompt = `
          Your name is ${domain.chatBot?.name || domain.name}.
          You are a highly knowledgeable and experienced sales representative for a ${
            domain.chatBot?.company_name || domain.name
          } that offers a valuable product or service. Your goal is to have a natural, human-like conversation with the customer in order to understand their needs.
          this is array of conversation between you and customer, answer based on this array [${allChats.join(
            ", "
          )}]. do not include your name in conversation.
          keep your answer short and useful.
          just give one answer.
          If the customer says something out of context. Simply say this is beyond me and ask customer how you can help him. Do not forget.
          If the customer says something inapporpriate or insist to talk with a real user. Simply say this is beyond me you will get a real user to continue the conversation. And add a keyword (realtime) at the end. the key word is (realtime).
          If the customer wants to book an appointment send them this link ${appointment_link}.
          if the customer wants to buy a product send them this link ${products_link}.
          Keep your answer short and useful.
        `;

        const res = await GeminiAIModel.generateContent(prompt);

        const text = await res.response.text();

        if (text?.includes("(realtime)") || text?.includes("realtime")) {
          const { error } = await emailSender({
            email: domain.User?.email || "",
            subject: "A Customer Need Support",
            body: `One of your customer "${getCustomer.email}" need support.`,
          });

          if (!error)
            await db.chatRoom.update({
              where: { id: getCustomer.chatRoom[0].id },
              data: { live: true, mailed: true },
            });

          const ai_msg = await createMessageAction({
            chatRoomId: getCustomer.chatRoom[0].id,
            message: text.replace("(realtime)", ""),
            role: "assistant",
          });

          return {
            live: true,
            chatRoomId: ai_msg.data?.chatRoomId || "",
            customerEmail,
            message: ai_msg.data,
            user_msg: user_msg.data,
          };
        }

        if (text) {
          const extractedLink = extractURLfromString(text as string);
          if (extractedLink?.[0]) {
            const ai_msg = await createMessageAction({
              message:
                "Greate! you can follow the link to procced. This link is for you, Do not share with anyone.",
              link: extractedLink[0]?.slice(0, -1),
              role: "assistant",
              chatRoomId: getCustomer.chatRoom[0].id,
            });

            return {
              customerEmail,
              message: ai_msg.data,
              user_msg: user_msg.data,
            };
          }

          const ai_msg = await createMessageAction({
            message: text as string,
            role: "assistant",
            chatRoomId: getCustomer.chatRoom[0].id,
          });

          return {
            message: ai_msg.data,
            customerEmail,
            user_msg: user_msg.data,
          };
        }
      }

      // No Customer

      const allChats = [...chats, { role: "user", message }].map((e) => {
        return `${e.role === "user" ? "customer" : "you"}: ${e.message}`;
      });

      const res = await GeminiAIModel.generateContent(
        `
        Your name is ${domain.chatBot?.company_name || domain.chatBot?.name}.

        You are a highly knowledgeable and experienced sales representative for a ${
          domain.chatBot?.company_name || domain.name
        } that offers a valuable product or service. Your goal is to have a natural, human-like conversation with the customer in order to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or redirect them to a link if they havent provided all relevant information.
        Right now you are talking to a customer for the first time. Start by giving them a warm welcome on behalf of ${
          domain.chatBot?.company_name || domain.name
        } and make them feel welcomed.
        this is array of conversation between you and customer, answer based on this array [${allChats.join(
          ", "
        )}].
        just give one answer.
        Your next task is lead the conversation naturally to get the customers email address. Be respectful and never break character.
        Keep your answer short and useful.
      `
      );

      const text = await res.response.text();

      if (text)
        return {
          content: text,
          role: "assistant",
        };

      throw new PublicError(
        "Sorry, Our assistant bot have problem, please try again or later."
      );
    } catch (err) {
      throw new PublicError(
        "Sorry, Our assistant bot have problem, please try again or later."
      );
    }
  }
);

export const generateBusinessNameSuggestion = AuthenticatedAction(
  generateBusinessNameWithAiFormSchema,
  async ({ input }) => {
    try {
      const prompt = `
        Suggest me 5 business name about this business: ${input}.
        just suggest 5 names. do not need explenations.
        put all names in array, like this ["name", "name"].
      `;

      const res = await GeminiAIModel.generateContent(prompt);
      const text = await res.response.text();

      return JSON.parse(text);
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const createMessageAction = SafeAction(
  CreateMessageSchema,
  async ({ chatRoomId, role, message, image, link, seen }) => {
    try {
      const res = await db.chatMessage.create({
        data: {
          message: message || "",
          image,
          chatRoomId: chatRoomId,
          role,
          link,
          seen: seen || false,
        },
        select: {
          id: true,
          role: true,
          chatRoomId: true,
          image: true,
          message: true,
          seen: true,
          link: true,
          createdAt: true,
        },
      });

      return res;
    } catch (err) {
      returnError(err as Error);
    }
  }
);

export const updateUnreadMessagesAction = SafeAction(
  z.object({ seen: z.boolean(), chatRoomId: z.string().min(1) }),
  async ({ seen, chatRoomId }) => {
    try {
      await db.chatMessage.updateMany({
        where: {
          chatRoomId,
        },
        data: {
          seen,
        },
      });
    } catch (err) {
      returnError(err as Error);
    }
  }
);
