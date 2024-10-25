"use client";

import CustomAvatar from "@/components/custom/custom-avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailIcon from "@/icons/email-icon";
import HelpDeskIcon from "@/icons/help-desk-icon";
import { fDateTimeHM } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { HelpDesk } from "@prisma/client";
import { Link2Icon, SendHorizontalIcon } from "lucide-react";
import { Fragment } from "react";

type Props = {
  helpdesk: Omit<HelpDesk, "createdAt" | "updatedAt" | "domainId">[];
  avatar: string;
  company_name: string;
  name: string;
  welcomeMessage: string;
  showHelpdesk: boolean;
  watermark: boolean;
};

const ChatbotUi = ({
  helpdesk,
  avatar,
  company_name,
  name,
  welcomeMessage,
  showHelpdesk,
  watermark,
}: Props) => {
  const mockChats: {
    date: Date;
    role: "user" | "assistant";
    message: string;
    link?: string;
  }[] = [
    {
      date: new Date(Date.now()),
      role: "assistant",
      message: welcomeMessage || "",
    },
    {
      date: new Date(Date.now()),
      role: "user",
      message: "Hi there, Im interested in your products",
    },
    {
      date: new Date(Date.now()),
      role: "assistant",
      message: "Sure, wich one you want to buy?",
    },
    {
      date: new Date(Date.now()),
      role: "user",
      message: "I want to book an appoinment.",
    },
    {
      date: new Date(Date.now()),
      role: "assistant",
      message: "Sure, here is your link.",
      link: "http://localhost:3000/dashboard",
    },
  ];

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
      <section className="bg-white shadow-xl w-[400px] h-[550px] rounded-2xl overflow-hidden">
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
                  <h3 className="text-lg font-bold">{name}</h3>
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
              <div className="flex-col flex border-t border-zinc-200 w-full h-full">
                <div
                  className={cn("w-full !h-[357px] py-5 overflow-auto", {
                    "!h-[390px]": watermark,
                  })}
                >
                  <div className="w-full h-full px-2 flex flex-col gap-3">
                    {mockChats.map((c, i) => (
                      <div
                        className={cn("flex gap-2", {
                          "justify-end": c.role === "user",
                          "justify-start": c.role === "assistant",
                          "pb-5": mockChats.length - 1 === i,
                        })}
                        key={i}
                      >
                        {c.role === "assistant" && (
                          <CustomAvatar
                            user={{ avatar: "/images/ai-bot.jpg" }}
                            className="!w-7 !h-7 self-end "
                          />
                        )}
                        <div
                          className={cn("p-3 max-w-[81%] flex flex-col gap-2", {
                            "rounded-2xl rounded-ee-none bg-orange/40":
                              c.role === "user",
                            "rounded-2xl rounded-bl-none bg-zinc-100":
                              c.role === "assistant",
                          })}
                        >
                          <p className="text-xs">
                            {fDateTimeHM(new Date(c.date))}
                          </p>
                          <p className="text-sm font-medium">{c.message}</p>
                          {!!c.link && (
                            <a
                              href={c.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-sm text-blue-500"
                            >
                              your link
                            </a>
                          )}
                        </div>
                        {c.role === "user" && (
                          <div className="!w-7 !h-7 self-end rounded-full text-[10px] font-bold flex items-center justify-center bg-orange/40">
                            US
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full p-0 px-2 bg-zinc-100 flex items-center">
                  <Input
                    name="message"
                    placeholder="Type your message"
                    type="text"
                    className="!ring-0 !border-none !outline-none !shadow-none h-12 placeholder:text-xs"
                  />
                  <Button
                    type="button"
                    className="!w-fit px-1 !bg-transparent !text-black !shadow-none !border-none"
                  >
                    <Link2Icon strokeWidth={1.4} />
                  </Button>
                  <Button
                    type="button"
                    className="!bg-transparent !shadow-none !border-none !text-black"
                  >
                    <SendHorizontalIcon strokeWidth={1.4} />
                  </Button>
                </div>
              </div>
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
};

export default ChatbotUi;
