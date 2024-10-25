"use client";

import {
  getCurrentBotDataAction,
  onChatWithAiAction,
} from "@/actions/chat-bot";
import CustomAvatar from "@/components/custom/custom-avatar";
import { BotIcon } from "@/icons/bot-icon";
import { cn } from "@/lib/utils";
import { ChatBotMessageSchemaType, ChatsStateType } from "@/types";
import { ChatBotMessageSchema } from "@/zod/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Chatbot from "./chatbot";
import useUpload from "@/hooks/use-upload";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

type Props = {};

export type RealtimeStateType = boolean | undefined;

const AiChatbot = ({}: Props) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [botId, setbotId] = useState<string>();
  const [openBot, setOpenBot] = useState(false);
  const [chats, setChats] = useState<ChatsStateType>([]);
  const [isRealtime, setIsRealtime] = useState<RealtimeStateType>(undefined);
  const [chatRoomId, setChatRoomId] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const numsOfOpenedBots = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { files, isUploading, startUpload } = useUpload({
    ref: fileInputRef,
    max_size: 1,
  });

  const form = useForm<ChatBotMessageSchemaType>({
    resolver: zodResolver(ChatBotMessageSchema),
    defaultValues: { message: undefined, image: undefined },
  });
  const { handleSubmit, reset } = form;

  const { data: currentBotData } = useQuery({
    queryFn: () => getCurrentBotDataAction({ id: botId! }),
    queryKey: ["current-bot"],
    enabled: botId?.length ? true : false,
  });

  const { mutate: onChatWithAI, isPending } = useMutation({
    mutationFn: async (values: ChatBotMessageSchemaType) => {
      if (!botId?.length) throw new Error("bot id required");
      let imageUrl: string | undefined = undefined;

      if (files.length) {
        const uploadedImage = await startUpload();
        if (uploadedImage) imageUrl = uploadedImage[0].file.secure_url;
      }

      setChats((prev) => [
        ...prev,
        {
          message: values.message || "",
          createdAt: new Date(Date.now()),
          role: "user",
          ...(imageUrl?.length && { image: imageUrl }),
        },
      ]);

      reset();

      const { error, data } = await onChatWithAiAction({
        bot_id: botId,
        chats,
        message: values.message,
        ...(imageUrl?.length && { image: imageUrl }),
        ...(customerEmail?.length && { customerEmail }),
      });

      if (error || !data)
        throw new Error(
          error ||
            "Sorry, our assistant bot have problem, please try again or later."
        );

      if (data.customerEmail) setCustomerEmail(data.customerEmail);

      if (data.live) {
        setIsRealtime(data.live);
        setChatRoomId(data.chatRoomId || "");
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "on_realtime",
            payload: {
              chatRoom: data.chatRoomId || "",
              mode: data.live,
            },
          });
        }
      }

      if (data.user_msg && channel) {
        channel.send({
          type: "broadcast",
          event: "realtime_chat",
          payload: {
            message: data.user_msg,
          },
        });
      }

      if (data.message) {
        setChats((prev) => [
          ...prev,
          {
            message: data.message?.message || "",
            createdAt: data.message?.createdAt || new Date(Date.now()),
            role: "assistant",
            image: data.message?.image || "",
            link: data.message?.link || "",
          },
        ]);
        if (channel) {
          if (data.message)
            channel.send({
              type: "broadcast",
              event: "realtime_chat",
              payload: {
                message: data.message,
              },
            });
        }
      } else {
        if (data.content || data.link || data.role)
          setChats((prev) => [
            ...prev,
            {
              message: data?.content || "",
              createdAt: new Date(Date.now()),
              role: data?.role as "assistant" | "user",
              ...(data?.link && { link: data?.link }),
            },
          ]);
      }
    },
    onError: (e) => {
      toast.error("Error", { description: e.message });
    },
  });

  useEffect(() => {
    if (currentBotData?.data?.chatbot)
      setChats((prev) => [
        ...prev,
        {
          role: "assistant",
          message: currentBotData.data?.chatbot?.welcomeMessage || "",
          createdAt: new Date(Date.now()),
        },
      ]);
    if (window) {
      const data = JSON.stringify({
        show: true,
        width: 60,
        height: 60,
      });
      window.parent.postMessage(data, "*");
    }
  }, [currentBotData]);

  useEffect(() => {
    if (!currentBotData?.data || !currentBotData?.data.chatbot.domainId) return;

    const new_channel = supabase.channel(currentBotData.data.chatbot.domainId);
    new_channel.subscribe((status) => {
      if (status !== "SUBSCRIBED") return;
      setChannel(new_channel);
      new_channel.on("broadcast", { event: "realtime_chat" }, ({ payload }) => {
        if (chatRoomId && chatRoomId === payload.message.chatRoomId) {
          if (payload?.message)
            setChats((prev) => [
              ...prev,
              {
                message: payload.message.message || "",
                createdAt: payload.message.createdAt,
                role: payload.message.role as "assistant" | "user",
                link: payload.message.link,
                image: payload.message.image,
              },
            ]);
        }
      });
      new_channel.on("broadcast", { event: "on_realtime" }, ({ payload }) => {
        if (chatRoomId && chatRoomId === payload.chatRoom) {
          setIsRealtime(payload.mode);
        }
      });
    });

    return () => {
      !!channel && supabase.removeChannel(channel);
      if (new_channel) {
        supabase.removeChannel(new_channel);
        setChannel(null);
      }
    };
  }, [currentBotData?.data, chatRoomId]);

  useEffect(() => {
    if (!window) return;
    const data = JSON.stringify({
      width: openBot ? 400 : 60,
      height: openBot ? 550 : 60,
      open: openBot ? true : false,
    });
    window.parent.postMessage(data, "*");
  }, [openBot]);

  useEffect(() => {
    if (!window) return;
    const onWindowMessage = async (e: any) => {
      const data = e.data;
      if (data && typeof data === "string" && data.includes("open")) {
        setOpenBot(JSON.parse(data).open);
        return;
      }
      if (data && typeof data === "string" && numsOfOpenedBots.current !== 1) {
        setbotId(data);
        numsOfOpenedBots.current = 1;
      }
    };

    window.addEventListener("message", onWindowMessage);
    return () => window.removeEventListener("message", onWindowMessage);
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    if (!botId?.length) return;
    if (!values.message?.trim().length && !files.length) return;
    onChatWithAI({ ...values });
  });

  const isLoading = useMemo(() => {
    if (isPending || isUploading) return true;
    else false;
  }, [isPending, isUploading]);

  return (
    <div>
      <div
        className={cn("w-[400px] h-[550px] bg-white shadow-xl", {
          "fade-animate hidden": !openBot,
        })}
      >
        {!!currentBotData?.data?.chatbot.id && (
          <Chatbot
            avatar={currentBotData?.data?.chatbot.avatar || ""}
            company_name={currentBotData?.data?.chatbot.company_name || ""}
            helpdesk={currentBotData?.data?.helpdesk}
            name={currentBotData?.data?.chatbot.name || ""}
            showHelpdesk={currentBotData?.data?.chatbot.helpdesk}
            watermark={currentBotData?.data?.chatbot.watermark}
            chats={chats}
            ref={fileInputRef}
            onSubmit={onSubmit}
            form={form}
            isTyping={isLoading || isPending}
            isOpen={openBot}
            isRealtime={isRealtime}
            isLoading={isUploading || false}
          />
        )}
      </div>
      {!openBot && currentBotData?.data?.chatbot && (
        <div
          onClick={() => setOpenBot(true)}
          className="w-[60px] h-[60px] cursor-pointer rounded-full flex items-center justify-center"
        >
          {!!currentBotData?.data?.chatbot.icon?.length ? (
            <Image
              src={currentBotData.data.chatbot.icon}
              alt="Bot Icon"
              width={60}
              height={60}
              className="w-full h-full max-w-full object-cover"
            />
          ) : (
            <div className="rounded-full w-full h-full flex items-center justify-center bg-orange">
              <BotIcon />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
