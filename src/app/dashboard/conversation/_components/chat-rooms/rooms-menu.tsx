"use client";

import useChat from "@/hooks/use-chat";
import { isChatExpired } from "@/lib/use-cases";
import { RoomsType } from "@/zustand/chat-store";
import { useEffect, useState } from "react";
import RoomItem from "./room-item";
import { useChatStore } from "@/zustand/chat-store/chat-store-provider";

type Props = {
  list_type: "all" | "unread" | "expired" | "starred";
};

const RoomsMenu = ({ list_type }: Props) => {
  const [filteredChats, setFilteredChats] = useState<RoomsType[]>([]);
  const { onFetchConversationData } = useChat();
  const rooms = useChatStore((store) => store.rooms);
  const selected_chatroom = useChatStore((store) => store.selected_chatroom);
  const selected_domain = useChatStore((store) => store.selected_domain);

  useEffect(() => {
    if (list_type === "all")
      setFilteredChats(rooms.filter((e) => e.domainId === selected_domain));
    if (list_type === "unread")
      setFilteredChats(() =>
        rooms.filter(
          (e) =>
            e.domainId === selected_domain &&
            !!e.chatRoom[0]?.message[0] &&
            !e.chatRoom[0]?.message[0]?.seen
        )
      );
    if (list_type === "expired")
      setFilteredChats(() =>
        rooms.filter(
          (e) =>
            e.domainId === selected_domain &&
            isChatExpired(e.chatRoom[0]?.message[0]?.createdAt)
        )
      );
  }, [rooms, selected_domain]);

  return (
    <div className="w-full">
      <div className="w-full pb-6 flex flex-col gap-3">
        <p className="text-zinc-400 text-xs font-bold select-none">CHATS</p>
        {filteredChats.length ? (
          filteredChats.map((e, i) => (
            <RoomItem
              key={e.id}
              onFetchConversationData={onFetchConversationData}
              room={e}
              selected_chatroom={selected_chatroom}
            />
          ))
        ) : (
          <div className="w-full py-2">
            <p className="text-sm font-medium text-muted-foreground">
              ...There is no chats...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default RoomsMenu;
