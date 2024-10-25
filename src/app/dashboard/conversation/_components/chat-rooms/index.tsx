"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailIcon from "@/icons/email-icon";
import { BellDotIcon } from "lucide-react";
import SelectDomainMenu from "./select-domain-menu";
import RoomsMenu from "./rooms-menu";
import TimerIcon from "@/icons/timer-icon";
import { MenuRoomsDataType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getMenuRoomsDataAction } from "@/actions/conversation";
import { useChatStore } from "@/zustand/chat-store/chat-store-provider";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  data: MenuRoomsDataType;
};

const ChatRoomMenu = ({ data: initialData }: Props) => {
  const selected_domain = useChatStore((store) => store.selected_domain);
  const setRealtime = useChatStore((store) => store.setRealtime);
  const setRooms = useChatStore((store) => store.setRooms);
  const current_room = useChatStore((store) => store.current_room);
  const setOneChat = useChatStore((store) => store.setOneChat);
  const setChannel = useChatStore((store) => store.setChannel);
  const storeChannel = useChatStore((store) => store.channel);
  const setRoomLastMessage = useChatStore((store) => store.setRoomLastMessage);

  const { data } = useQuery({
    queryFn: async () => {
      const { data } = await getMenuRoomsDataAction({});
      return data;
    },
    queryKey: [],
    initialData: initialData,
  });

  useEffect(() => {
    if (data?.customers_list) setRooms(data.customers_list);
  }, [data?.customers_list]);

  useEffect(() => {
    if (!selected_domain) return;
    const channel = supabase.channel(selected_domain);
    channel.subscribe((status) => {
      if (status !== "SUBSCRIBED") return;
      setChannel(channel);
      channel.on("broadcast", { event: "realtime_chat" }, ({ payload }) => {
        setRoomLastMessage(payload.message);
        if (payload.message.chatRoomId === current_room?.chatRoom[0].id) {
          setOneChat(payload.message);
        }
      });
      channel.on("broadcast", { event: "on_realtime" }, ({ payload }) => {
        if (current_room?.chatRoom[0].id === payload.chatRoom) {
          setRealtime(payload.mode);
        }
      });
    });

    return () => {
      !!channel && supabase.removeChannel(channel);
      setChannel(null);
      !!storeChannel && supabase.removeChannel(storeChannel);
    };
  }, [selected_domain, current_room]);

  return (
    <Tabs className="w-full" defaultValue="all">
      <div className="flex flex-col gap-5 w-full h-full">
        <TabsList className="w-full h-fit">
          <TabsTrigger value="all" className="flex gap-1 items-center h-10">
            <EmailIcon />
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="h-10 flex gap-1 items-center">
            <BellDotIcon color="#636363" strokeWidth={1.5} />
            Unread
          </TabsTrigger>
          <TabsTrigger value="expired" className="h-10 flex gap-1 items-center">
            <TimerIcon />
            Expired
          </TabsTrigger>
        </TabsList>
        <SelectDomainMenu domains_list={data?.domains_list || []} />
        <TabsContent value="all" className="w-full m-0 p-0">
          <RoomsMenu list_type="all" />
        </TabsContent>
        <TabsContent value="unread" className="w-full m-0 p-0">
          <RoomsMenu list_type="unread" />
        </TabsContent>
        <TabsContent value="expired" className="w-full m-0 p-0">
          <RoomsMenu list_type="expired" />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ChatRoomMenu;
