"use server";

import { db } from "@/lib/db";
import { returnError } from "@/lib/errors";
import { AuthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";

export const toggleRealtimeAction = AuthenticatedAction(
  z.object({ status: z.boolean(), id: z.string().min(1) }),
  async ({ status, id }) => {
    try {
      const chatRoom = await db.chatRoom.update({
        where: { id },
        data: {
          live: status,
          ...(!status && { mailed: status }),
        },
        select: { id: true, live: true },
      });
      return chatRoom;
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const getConversationModeAction = AuthenticatedAction(
  z.object({ id: z.string().min(1) }),
  async ({ id }) => {
    try {
      const mode = await db.chatRoom.findUnique({
        where: { id },
        select: { live: true },
      });
      return mode;
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const getMenuRoomsDataAction = AuthenticatedAction(
  z.object({}),
  async ({}, user) => {
    try {
      const domains_list = await db.domain.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
        },
      });

      if (!domains_list.length) return null;

      const customers_list = await db.customer.findMany({
        where: {
          Domain: {
            userId: user.id,
          },
        },
        select: {
          id: true,
          email: true,
          domainId: true,
          chatRoom: {
            select: {
              id: true,
              createdAt: true,
              message: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: {
                  createdAt: true,
                  id: true,
                  image: true,
                  link: true,
                  message: true,
                  role: true,
                  seen: true,
                  chatRoomId: true,
                },
              },
            },
          },
        },
      });

      return {
        domains_list,
        customers_list,
      };
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);

export const getChatRoomConversationDataAction = AuthenticatedAction(
  z.object({ id: z.string().min(1) }),
  async ({ id }) => {
    try {
      const res = await db.chatRoom.findUnique({
        where: { id },
        select: {
          live: true,
          message: {
            select: {
              createdAt: true,
              id: true,
              image: true,
              link: true,
              message: true,
              role: true,
              seen: true,
              chatRoomId: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return res;
    } catch (err) {
      console.log(err);
      throw returnError(err as Error);
    }
  }
);
