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
        data: { live: status },
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
