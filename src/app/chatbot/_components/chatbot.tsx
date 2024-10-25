"use client";

import CustomAvatar from "@/components/custom/custom-avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailIcon from "@/icons/email-icon";
import HelpDeskIcon from "@/icons/help-desk-icon";
import { fDateTimeHM } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { ChatsStateType } from "@/types";
import { HelpDesk } from "@prisma/client";
import { Link2Icon, SendHorizontalIcon } from "lucide-react";
import { forwardRef, Fragment, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RealtimeStateType } from "./ai-cahbot";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";

type Props = {
  helpdesk: Omit<HelpDesk, "createdAt" | "updatedAt" | "domainId">[];
  avatar: string;
  company_name: string;
  name: string;
  showHelpdesk: boolean;
  watermark: boolean;
  chats: ChatsStateType;
  onSubmit: () => void;
  form: UseFormReturn;
  isTyping: boolean;
  isOpen: boolean;
  isLoading: boolean;
  isRealtime: RealtimeStateType;
};

const Chatbot = forwardRef<HTMLInputElement | null, Props>(
  (
    {
      helpdesk,
      avatar,
      company_name,
      name,
      showHelpdesk,
      watermark,
      chats,
      onSubmit,
      form,
      isTyping,
      isOpen,
      isRealtime,
      isLoading,
    },
    ref
  ) => {
    const messageWindowRef = useRef<HTMLDivElement | null>(null);
    const textInputRef = useRef<HTMLInputElement | null>(null);

    const [parent] = useAutoAnimate();

    const { ref: registerTextInputRef, ...InputRegisterProps } =
      form.register("message");

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

    useEffect(() => {
      if (textInputRef.current && isOpen) {
        textInputRef.current.focus();
        console.log("opened");
      }
    }, [textInputRef.current, isOpen]);

    return (
      <Fragment>
        <style jsx>
          {`
            ::-webkit-scrollbar {
              display: none;
            }
            ::-webkit-scrollbar-thumb {
              display: none;
            }
          `}
        </style>
        <section className="bg-white fade-in-animate shadow-xl w-full h-full rounded-2xl overflow-hidden">
          <Tabs defaultValue="chat" className="w-full h-full">
            <div className="w-full h-full flex flex-col gap-2 text-black">
              <div className="px-3 pt-3">
                <div className="w-full flex gap-2 items-center">
                  <CustomAvatar
                    className="w-[92px] h-[92px]"
                    user={{
                      avatar: avatar || "/images/ai-bot.jpg",
                    }}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{name}</h3>
                      {!!isRealtime && (
                        <div>
                          <Image
                            src={"/images/tech-support.gif"}
                            alt="support team"
                            width={25}
                            height={25}
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium">{company_name}</p>
                    <div>
                      <TabsList className="w-fit h-fit bg-transparent flex items-center gap-2 p-0 mt-2">
                        <TabsTrigger
                          value="chat"
                          className="flex items-center gap-2 px-4 py-2 text-black 
                        data-[state=active]:bg-zinc-100 data-[state=active]:text-black data-[state=active]:shadow-none"
                        >
                          <EmailIcon /> Chat
                        </TabsTrigger>
                        {!!showHelpdesk && (
                          <TabsTrigger
                            value="helpdesk"
                            className="flex items-center gap-2 px-4 py-2 text-black 
                        data-[state=active]:bg-zinc-100 data-[state=active]:text-black data-[state=active]:shadow-none"
                          >
                            <HelpDeskIcon /> Help Desk
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </div>
                  </div>
                </div>
              </div>
              <TabsContent value="chat" className="flex-1 w-full mt-0">
                <Form {...form}>
                  <form onSubmit={onSubmit} className="w-full h-full">
                    <div className="flex-col flex border-t border-zinc-200 w-full h-full">
                      <div
                        ref={messageWindowRef}
                        className={cn("w-full !h-[357px] pt-5 overflow-auto", {
                          "!h-[390px]": watermark,
                        })}
                      >
                        <div
                          className="w-full h-fit px-2 flex flex-col gap-3"
                          ref={parent}
                        >
                          {chats.map((c, i) => {
                            const msg = c?.message?.includes("(complete)")
                              ? c?.message?.replace("(complete)", "")
                              : c?.message?.includes("complete")
                              ? c?.message?.replace("complete", "")
                              : c?.message?.includes("realtime")
                              ? c?.message?.replace("realtime", "")
                              : c?.message?.includes("(realtime)")
                              ? c?.message?.replace("(realtime)", "")
                              : c?.message;

                            return (
                              <div
                                className={cn("flex gap-2", {
                                  "justify-end": c?.role === "user",
                                  "justify-start": c?.role === "assistant",
                                  "pb-2": chats?.length - 1 === i,
                                })}
                                key={i}
                              >
                                {c?.role === "assistant" && (
                                  <CustomAvatar
                                    user={{ avatar: "/images/ai-bot.jpg" }}
                                    className="!w-7 !h-7 self-end "
                                  />
                                )}
                                <div
                                  className={cn(
                                    "p-3 max-w-[81%] min-w-[40%] flex flex-col gap-2",
                                    {
                                      "rounded-2xl rounded-ee-none bg-orange/40":
                                        c?.role === "user",
                                      "rounded-2xl rounded-bl-none bg-zinc-100":
                                        c?.role === "assistant",
                                    }
                                  )}
                                >
                                  <p className="text-xs">
                                    {fDateTimeHM(new Date(c?.createdAt))}
                                  </p>
                                  <div>
                                    {!!c.image?.length && (
                                      <div className="relative w-full mb-2 h-[250px] rounded-md overflow-hidden">
                                        <Image
                                          width={250}
                                          height={250}
                                          src={c.image}
                                          alt="image"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <p className="text-sm break-words inline-block [&_a]:text-blue-400">
                                      {c.role === "assistant" ? (
                                        <Markdown remarkPlugins={[remarkGfm]}>
                                          {msg}
                                        </Markdown>
                                      ) : (
                                        msg
                                      )}
                                      {!!c?.link && (
                                        <a
                                          href={c?.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="underline text-sm text-blue-500"
                                        >
                                          your link
                                        </a>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                {c?.role === "user" && (
                                  <div className="!w-7 !h-7 self-end rounded-full text-[10px] font-bold flex items-center justify-center bg-orange/40">
                                    US
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {!!isTyping && (
                            <div className="w-full flex items-center justify-star">
                              <div className="self-start flex items-end gap-3 pb-2">
                                <CustomAvatar
                                  className="w-7 h-7"
                                  user={{
                                    avatar: avatar || "/images/ai-bot.jpg",
                                  }}
                                />
                                <div className="chat-bubble">
                                  <div className="typing">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full p-0 px-2 bg-zinc-100 flex items-center">
                        <Input
                          placeholder="Type your message"
                          type="text"
                          {...InputRegisterProps}
                          ref={(ref) => {
                            registerTextInputRef(ref);
                            textInputRef.current = ref;
                          }}
                          className="!ring-0 !border-none !outline-none !shadow-none h-12 placeholder:text-xs"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            // @ts-ignore
                            if (ref?.current) {
                              // @ts-ignore
                              ref.current.click();
                            }
                          }}
                          className="!w-fit px-1 !bg-transparent !text-black !shadow-none !border-none"
                        >
                          <input type="file" ref={ref} hidden />
                          <Link2Icon strokeWidth={1.4} />
                        </Button>
                        <ButtonWithLoaderAndProgress
                          loading={isLoading}
                          disabled={isLoading}
                          type="submit"
                          className="!bg-transparent !shadow-none !border-none !text-black"
                        >
                          <SendHorizontalIcon strokeWidth={1.4} />
                        </ButtonWithLoaderAndProgress>
                      </div>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="helpdesk" className="flex-1 w-full mt-0">
                <div className="px-4 py-5 border-t border-zinc-200 w-full h-full">
                  <div className="w-full !h-[357px] overflow-auto">
                    <div className="w-full mb-3">
                      <h2 className="text-lg font-bold">Help Desk</h2>
                      <p className="text-sm font-light text-zinc-500">
                        Browse from a list of questions people usually ask.
                      </p>
                    </div>
                    <Accordion type="single" collapsible>
                      {helpdesk.map((e, i) => (
                        <AccordionItem
                          value={`item-${i}`}
                          key={e.id}
                          className="border-zinc-200 border-b-0 py-0"
                        >
                          <AccordionTrigger className="py-2">
                            {i + 1}: {e.question}
                          </AccordionTrigger>
                          <AccordionContent>{e.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </TabsContent>
              {!watermark && (
                <div className="w-full pb-2 flex items-center justify-center">
                  <p className="text-zinc-400 text-xs font-light select-none">
                    Powered by Corinna AI
                  </p>
                </div>
              )}
            </div>
          </Tabs>
        </section>
      </Fragment>
    );
  }
);

export default Chatbot;
