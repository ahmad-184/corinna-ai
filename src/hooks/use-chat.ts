"use client";

import {
  getConversationModeAction,
  toggleRealtimeAction,
} from "@/actions/conversation";
import { useChatStore } from "@/zustand/chat-store/chat-store-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

const useChat = () => {
  const chatRoom = useChatStore((store) => store.chatRoom);
  const setLoading = useChatStore((store) => store.setLoading);
  const loading = useChatStore((store) => store.loading);
  const setRealtime = useChatStore((store) => store.setRealtime);
  const realtime = useChatStore((store) => store.realtime);

  const { mutate: toggleRealtime } = useMutation({
    mutationFn: toggleRealtimeAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        setLoading(false);
        setRealtime(e.data.live);
      }
    },
    onMutate: () => setLoading(true),
  });

  const { refetch: refetchCurrentMode } = useQuery({
    queryFn: () => getConversationModeAction({ id: chatRoom! }),
    queryKey: [],
  });

  const onActivateRealtime = async (status: boolean) => {
    if (!chatRoom) return;
    toggleRealtime({ status, id: chatRoom });
  };

  useEffect(() => {
    if (!chatRoom) return;
    (async () => {
      setLoading(true);
      const { data } = await refetchCurrentMode();
      if (data) {
        if (data.error)
          return toast.error("Error", { description: data.error });
        if (data.data) {
          setRealtime(data.data.live);
          setLoading(false);
        }
      }
    })();
  }, [chatRoom]);

  return {
    chatRoom,
    onActivateRealtime,
    loading,
    realtime,
  };
};

export default useChat;
