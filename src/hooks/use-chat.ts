"use client";

import { updateUnreadMessagesAction } from "@/actions/chat-bot";
import {
  getChatRoomConversationDataAction,
  toggleRealtimeAction,
} from "@/actions/conversation";
import { useChatStore } from "@/zustand/chat-store/chat-store-provider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useChat = () => {
  const selected_chatroom = useChatStore((store) => store.selected_chatroom);
  const rooms = useChatStore((store) => store.rooms);
  const setLoading = useChatStore((store) => store.setLoading);
  const setRealtime = useChatStore((store) => store.setRealtime);
  const setChats = useChatStore((store) => store.setChats);
  const setChatRoom = useChatStore((store) => store.setChatRoom);
  const setCurrentRoom = useChatStore((store) => store.setCurrentRoom);
  const channel = useChatStore((store) => store.channel);
  const setUnreadMessagesRead = useChatStore(
    (store) => store.setUnreadMessagesRead
  );

  const { mutate: toggleRealtime, isPending: onActivateRealtimeLoading } =
    useMutation({
      mutationFn: toggleRealtimeAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          setRealtime(e.data.live);
          if (channel)
            channel.send({
              type: "broadcast",
              event: "on_realtime",
              payload: {
                chatRoom: e.data.id || "",
                mode: e.data.live,
              },
            });
        }
      },
    });

  const { mutate: getChatRoomConversationData } = useMutation({
    mutationFn: getChatRoomConversationDataAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        setRealtime(e.data.live);
        setChats(e.data.message || []);
        setLoading(false);
      }
    },
    onMutate: () => setLoading(true),
  });

  const { mutate: updateUnreadMessages } = useMutation({
    mutationFn: updateUnreadMessagesAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        setUnreadMessagesRead();
      }
    },
  });

  const onActivateRealtime = async (status: boolean) => {
    if (!selected_chatroom) return;
    toggleRealtime({ status, id: selected_chatroom });
  };

  const onFetchConversationData = async (chatroom_id: string) => {
    if (!chatroom_id || selected_chatroom === chatroom_id) return;
    setCurrentRoom(
      rooms.find((e) => e.chatRoom[0].id === chatroom_id || undefined)
    );
    setChatRoom(chatroom_id);
    getChatRoomConversationData({ id: chatroom_id });
  };

  return {
    onActivateRealtime,
    onActivateRealtimeLoading,
    onFetchConversationData,
    updateUnreadMessages,
  };
};

export default useChat;
