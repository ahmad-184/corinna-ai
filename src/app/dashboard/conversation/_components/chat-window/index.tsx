"use client";

import { createMessageAction } from "@/actions/chat-bot";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import CustomAvatar from "@/components/custom/custom-avatar";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useChat from "@/hooks/use-chat";
import useUpload from "@/hooks/use-upload";
import { fDateTimeHM } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { CreateMessageSchemaType } from "@/types";
import { CreateMessageSchema } from "@/zod/chat";
import { useChatStore } from "@/zustand/chat-store/chat-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link2Icon, SendHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type Props = {};

const ChatWindow = ({}: Props) => {
  const {
    onActivateRealtime,
    onActivateRealtimeLoading,
    updateUnreadMessages,
  } = useChat();
  const current_room = useChatStore((store) => store.current_room);
  const chats = useChatStore((store) => store.chats);
  const channel = useChatStore((store) => store.channel);
  const setOneChat = useChatStore((store) => store.setOneChat);
  const setRoomLastMessage = useChatStore((store) => store.setRoomLastMessage);
  const loading = useChatStore((store) => store.loading);
  const realtime = useChatStore((store) => store.realtime);

  const shouldChatActive = Boolean(!realtime || !current_room?.id);

  const messageWindowRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(CreateMessageSchema),
    defaultValues: {
      message: "",
      chatRoomId: current_room?.chatRoom[0].id || "",
      image: "",
      link: "",
      role: "assistant",
    },
  });
  const { handleSubmit, setValue, register, reset } = form;

  useEffect(() => {
    if (current_room)
      setValue("chatRoomId", current_room?.chatRoom[0].id || "");
  }, [current_room]);

  const { files, startUpload } = useUpload({
    ref: fileInputRef,
    max_size: 1,
  });

  const { mutate: createMessage, isPending: createMessageLoading } =
    useMutation({
      mutationFn: async (e: CreateMessageSchemaType) => {
        let imageUrl = "";
        if (files.length) {
          const img = await startUpload();
          if (img && img[0].file) imageUrl = img[0].file.secure_url;
        }
        return createMessageAction({ ...e, image: imageUrl, seen: true });
      },
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          setOneChat(e.data);
          setRoomLastMessage(e.data);
          reset({
            chatRoomId: current_room?.chatRoom[0].id,
            message: "",
            image: "",
            link: "",
            role: "assistant",
          });
          if (channel) {
            channel.send({
              type: "broadcast",
              event: "realtime_chat",
              payload: {
                message: e.data,
              },
            });
          }
          !!current_room?.chatRoom[0].id &&
            updateUnreadMessages({
              seen: true,
              chatRoomId: current_room.chatRoom[0].id,
            });
        }
      },
      retry: 3,
    });

  const onMessage = handleSubmit((values) => {
    if (!values.message?.length && !files.length) return;
    createMessage({ ...values });
  });

  useEffect(() => {
    if (messageWindowRef.current) {
      messageWindowRef.current?.scroll({
        top: messageWindowRef.current.scrollHeight + 8,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [messageWindowRef, chats]);

  useEffect(() => {
    if (current_room?.chatRoom[0].id) {
      updateUnreadMessages({
        chatRoomId: current_room.chatRoom[0].id,
        seen: true,
      });
    }
  }, [current_room]);

  const [parent] = useAutoAnimate();

  return (
    <div
      className="w-full flex flex-col"
      style={{ height: "calc(100vh - 24px)" }}
    >
      <div className="w-full py-0 flex items-center justify-between gap-5 pb-3 border-b">
        <h1 className="text-3xl font-bold capitalize">Conversation</h1>
        <div
          className={cn("flex items-center gap-2", {
            "opacity-40": !current_room?.id,
          })}
        >
          <p className="text-sm select-none">
            Realtime Mode{" "}
            <span className="text-orange">{realtime ? "On" : "Off"}</span>
          </p>
          <Switch
            defaultChecked={realtime}
            checked={realtime}
            disabled={!current_room?.id || onActivateRealtimeLoading}
            onCheckedChange={(e) => onActivateRealtime(e)}
            className="data-[state=checked]:bg-orange data-[state=unchecked]:bg-peach"
          />
        </div>
      </div>
      <Loader
        className="h-full items-center flex justify-center"
        loading={loading}
      >
        <div
          className="flex flex-1 flex-col w-full overflow-y-auto"
          ref={messageWindowRef}
        >
          {!current_room?.id && (
            <div className="flex items-center justify-center flex-1 w-full">
              <p className="text-muted-foreground text-sm">No Conversation</p>
            </div>
          )}
          <div
            className="w-full h-fit px-2 flex flex-col gap-3 pt-5"
            ref={parent}
          >
            {chats.map((c, i) => {
              const msg = c.message.includes("(complete)")
                ? c.message.replace("(complete)", "")
                : c.message.includes("complete")
                ? c.message.replace("complete", "")
                : c.message.includes("realtime")
                ? c.message.replace("realtime", "")
                : c.message.includes("(realtime)")
                ? c.message.replace("(realtime)", "")
                : c.message;

              return (
                <>
                  <div
                    className={cn("flex gap-2", {
                      "justify-end": c.role === "user",
                      "justify-start": c.role === "assistant",
                      "pb-5": i + 1 === chats.length,
                    })}
                    key={i + c.id}
                  >
                    {c.role === "assistant" && (
                      <CustomAvatar
                        user={{ avatar: "/images/ai-bot.jpg" }}
                        className="!w-7 !h-7 self-end "
                      />
                    )}
                    <div
                      className={cn(
                        "p-3 max-w-[81%] min-w-[40%] flex flex-col gap-2",
                        {
                          "rounded-2xl rounded-ee-none bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900":
                            c.role === "user",
                          "rounded-2xl rounded-bl-none bg-zinc-100 dark:bg-zinc-800":
                            c.role === "assistant",
                        }
                      )}
                    >
                      <p className="text-xs">
                        {fDateTimeHM(new Date(c.createdAt))}
                      </p>
                      <div>
                        {!!c.image?.length && (
                          <div className="relative w-[340px] mb-2 h-[250px] rounded-md overflow-hidden">
                            <Image
                              width={250}
                              height={250}
                              src={c.image}
                              alt="image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm break-words inline-block [&_a]:text-blue-500">
                          <Markdown remarkPlugins={[remarkGfm]}>{msg}</Markdown>
                          {!!c.link && (
                            <span>
                              <a
                                href={c.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-sm text-blue-500"
                              >
                                your link
                              </a>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {c.role === "user" && (
                      <div className="!w-7 !h-7 self-end rounded-full text-[10px] font-bold flex items-center justify-center bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900">
                        US
                      </div>
                    )}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </Loader>
      <div className="w-full pb-3">
        <Form {...form}>
          <form
            onSubmit={onMessage}
            className="w-full flex gap-3 h-10 bg-background items-center overflow-x-hidden"
          >
            <Input
              className="!ring-0 flex-1 h-full !outline-none !shadow-none"
              placeholder="Type here..."
              {...register("message")}
              disabled={shouldChatActive}
            />
            <Button
              type="button"
              disabled={shouldChatActive}
              onClick={() => {
                if (fileInputRef?.current) {
                  fileInputRef.current.click();
                }
              }}
              className=""
              variant={"ghost"}
              size={"icon"}
            >
              <input type="file" hidden ref={fileInputRef} />
              <Link2Icon strokeWidth={1.4} />
            </Button>
            <ButtonWithLoaderAndProgress
              size={"icon"}
              disabled={shouldChatActive || createMessageLoading}
              loading={createMessageLoading}
            >
              <SendHorizontalIcon strokeWidth={1.4} />
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChatWindow;
