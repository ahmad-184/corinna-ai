"use client";

import { getCurrentBotDataAction } from "@/actions/chat-bot";
import CustomAvatar from "@/components/custom/custom-avatar";
import { BotIcon } from "@/icons/bot-icon";
import { cn } from "@/lib/utils";
import { ChatBotMessageSchemaType } from "@/types";
import { ChatBotMessageSchema } from "@/zod/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {};

type RealtimeStateType = { chatRoom: string; mode: boolean } | undefined;
type ChatsStateType =
  | { role: "assistant" | "user"; content: string; link?: string }[]
  | [];

const AiChatbot = ({}: Props) => {
  const [botId, setbotId] = useState<string>();
  const [openBot, setOpenBot] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState<RealtimeStateType>(undefined);
  const [chats, setChats] = useState<ChatsStateType>([]);

  const messageWindowRef = useRef<HTMLDivElement | null>(null);
  const botsNum = useRef(0);

  const form = useForm<ChatBotMessageSchemaType>({
    resolver: zodResolver(ChatBotMessageSchema),
    defaultValues: { content: undefined, image: undefined },
  });
  const { handleSubmit, reset, setValue } = form;

  const { data: currentBotData } = useQuery({
    queryFn: () => getCurrentBotDataAction({ id: botId! }),
    queryKey: ["current-bot"],
    enabled: botId?.length ? true : false,
  });

  useEffect(() => {
    if (currentBotData?.data?.chatbot)
      setChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: currentBotData.data?.chatbot?.welcomeMessage || "",
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
    if (!window) return;
    const data = JSON.stringify({
      width: openBot ? 380 : 60,
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
      if (data && typeof data === "string") {
        setbotId(data);
        botsNum.current = 1;
      }
    };

    window.addEventListener("message", onWindowMessage);

    return () => window.removeEventListener("message", onWindowMessage);
  }, []);

  const scrollToBottom = () => {
    if (!messageWindowRef.current) return;
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, messageWindowRef]);

  return (
    <div>
      <div
        className={cn("w-[380px] h-[550px] p-1 bg-white shadow-xl", {
          "fade-animate hidden": !openBot,
        })}
      >
        <div
          className={cn(
            "w-full fade-in-animate h-full border-zinc-100 rounded-2xl text-black"
          )}
        >
          <div className="w-full h-full flex flex-col gap-5">
            <div className="w-full flex p-4 gap-2">
              <div>
                <CustomAvatar
                  user={{
                    avatar:
                      currentBotData?.data?.chatbot.icon ||
                      "/images/domain.png",
                  }}
                  className="w-[70px] h-[70px]"
                />
              </div>
              <div className="flex items-center flex-col">
                <h3 className="text-lg font-bold leading-none">
                  Sales Rep - Corinna AI
                </h3>
              </div>
            </div>
            {currentBotData?.data?.chatbot.welcomeMessage}
          </div>
        </div>
      </div>
      {!openBot && currentBotData?.data?.chatbot && (
        <div
          onClick={() => setOpenBot(true)}
          className="w-[60px] h-[60px] cursor-pointer rounded-full flex items-center justify-center bg-orange"
        >
          {!currentBotData?.data?.chatbot.icon && <BotIcon />}
          {!!currentBotData?.data?.chatbot.icon && (
            <Image
              src={currentBotData.data.chatbot.icon}
              alt="Bot Icon"
              width={60}
              height={60}
              className="w-full h-full max-w-full object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
