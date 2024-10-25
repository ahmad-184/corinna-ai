"use client";

import { ChatBot, HelpDesk, Plans } from "@prisma/client";
import ChatbotUi from "./chatbot-ui";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import Section from "@/components/section";
import UploadImage from "@/components/dropzone/upload-image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import FormGeneration from "@/components/form-generation";
import { useMemo } from "react";
import PremiumBadge from "@/icons/premium-badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import { cn } from "@/lib/utils";
import { BotIcon } from "@/icons/bot-icon";
import UploadButton from "@/components/dropzone/upload-button";
import Image from "next/image";
import { ChatBotSettingsFormSchema } from "@/zod/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateChatbotAction } from "@/actions/chat-bot";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChatBotSettingsFormSchemaType } from "@/types";
import { Input } from "@/components/ui/input";
import GenerateBusinessNameSuggestionsWithAI from "./generate-business-name-with-ai";

type Props = {
  chatbot: Omit<ChatBot, "createdAt" | "updatedAt" | "domainId">;
  helpdesk: Omit<HelpDesk, "createdAt" | "updatedAt" | "domainId">[];
  subscription: {
    plan: Plans;
  } | null;
};

const ChatbotSettings = ({ chatbot, helpdesk, subscription }: Props) => {
  const router = useRouter();
  const form = useForm<ChatBotSettingsFormSchemaType>({
    defaultValues: {
      id: chatbot.id,
      welcomeMessage: chatbot.welcomeMessage || "",
      helpdesk: chatbot.helpdesk,
      name: chatbot.name || "",
      icon: chatbot.icon || "",
      avatar: chatbot.avatar || "",
      company_name: chatbot.company_name || "Your Business Name",
      watermark: chatbot.watermark,
    },
    resolver: zodResolver(ChatBotSettingsFormSchema),
  });
  const { handleSubmit, watch, setValue, control } = form;
  const {
    avatar,
    company_name,
    helpdesk: showHelpdesk,
    icon,
    name,
    welcomeMessage,
    watermark,
  } = watch();

  const { mutate: updateChatbot } = useMutation({
    mutationFn: updateChatbotAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        router.refresh();
        toast.success("Success");
      }
    },
    retry: 3,
  });

  const onSubmit = handleSubmit((values) => {
    updateChatbot({ ...values });
  });

  const isLoading = useMemo(() => {
    return false;
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      <div className="w-full gap-1 flex flex-col">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-2xl">Chat Bot Settings</h2>
          {subscription?.plan === "PRO" || subscription?.plan === "ULTIMATE" ? (
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-700 rounded-full px-3 py-1 text-xs items-center font-bold">
              <PremiumBadge />
              Premium
            </div>
          ) : null}
        </div>
        <p className="text-sm font-light">
          Here you can customize chatbot settings
        </p>
      </div>
      <Card className="w-full lg:py-7 lg:pb-7 py-7 flex flex-col gap-5">
        <div className="w-full flex items-center justify-between lg:flex-row lg:gap-5 gap-7 flex-col">
          <CardContent className="pb-0 flex-1 w-full flex flex-col gap-4 order-last lg:order-start">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSubmit(e);
                }}
                id="chatbot-form"
                className="w-full"
              >
                <div className="w-full flex flex-col gap-1">
                  <Section label="Avatar" />
                  <div className="flex items-center flex-row gap-3 w-full justify-center">
                    <UploadImage
                      value={avatar || "/images/ai-bot.jpg"}
                      getValue={(url) => {
                        setValue("avatar", url);
                      }}
                      maxSize={1}
                      max_file={1}
                      with_preview
                      className="w-[100px] h-[100px]"
                    />
                    {!!avatar?.length && (
                      <Button
                        size={"icon"}
                        type="button"
                        onClick={() => setValue("avatar", "")}
                        variant={"secondary"}
                        className="rounded-full"
                      >
                        <TrashIcon size={22} />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <FormGeneration
                    name="name"
                    id="1"
                    control={control}
                    disabled={isLoading}
                    inputType="input"
                    placeholder="AI Assistant"
                    label={"Bot name"}
                    type="text"
                  />
                  <div className="w-full flex flex-col gap-1">
                    <FormField
                      control={control}
                      disabled={isLoading}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company name</FormLabel>
                          <div className="w-full flex gap-4 flex-row !mt-1 items-center">
                            <FormControl className="w-full flex-1">
                              <Input placeholder="Company name" {...field} />
                            </FormControl>
                            <GenerateBusinessNameSuggestionsWithAI
                              setSuggestedName={(e: string) =>
                                setValue("company_name", e)
                              }
                            />
                          </div>
                          <FormDescription className="!mt-[3px]">
                            You can use AI to suggest you some names based on
                            your company or business.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex flex-col">
                    <Section label="Icon" />
                    <div className="flex items-center flex-row lg:gap-7 gap-10 w-full justify-between h-full">
                      <div className="flex-1 flex flex-col gap-1 max-w-sm">
                        <UploadButton
                          getValue={(url) => setValue("icon", url)}
                          maxSize={1}
                          max_file={1}
                          value={icon}
                          label="Edit icon"
                        />
                        <p className="text-xs text-muted-foreground ml-1">
                          * Recommended size is 300*300, Size less than 1mb
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center relative justify-center overflow-hidden w-[70px] h-[70px] 
                             border cursor-pointer rounded-lg dark:bg-zinc-800 bg-gray-100"
                          >
                            {!!icon?.length && (
                              <Image
                                src={icon}
                                alt="bot icon"
                                fill
                                className="w-full h-full object-cover rounded-full"
                              />
                            )}
                            {!icon?.length && (
                              <div className="flex items-center justify-center w-full h-full rounded-full bg-orange">
                                <BotIcon />
                              </div>
                            )}
                          </div>
                          {!!icon?.length && (
                            <Button
                              size={"icon"}
                              type="button"
                              onClick={() => setValue("icon", "")}
                              variant={"secondary"}
                              className="rounded-full"
                            >
                              <TrashIcon size={22} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-3 mt-1 rounded-lg border p-3 shadow-sm">
                    <FormField
                      control={form.control}
                      name="helpdesk"
                      disabled={isLoading}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Help Desk</FormLabel>
                            <FormDescription>
                              You decide to show help desk section to users or
                              not
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="watermark"
                      disabled={isLoading}
                      render={({ field }) => (
                        <FormItem
                          className={cn(
                            "flex flex-row items-center justify-between"
                          )}
                        >
                          <div
                            className={cn("space-y-0.5", {
                              "opacity-60": subscription?.plan === "STANDARD",
                            })}
                          >
                            <FormLabel className="flex items-center gap-2">
                              Watermark{" "}
                              {subscription?.plan === "STANDARD" && (
                                <PremiumBadge />
                              )}
                            </FormLabel>
                            <FormDescription>
                              You can disable corinna ai watermark{" "}
                              {subscription?.plan === "STANDARD" &&
                                ", available only on premium plan"}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              disabled={subscription?.plan === "STANDARD"}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-0">
                    <Label htmlFor="4" className="text-sm font-medium">
                      Greeting message
                    </Label>
                    <FormGeneration
                      name="welcomeMessage"
                      id="4"
                      control={control}
                      disabled={isLoading}
                      inputType="textarea"
                      placeholder="Hey there, have a question? Text us here"
                      type="text"
                      rows={5}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardContent className="flex items-center justify-center pb-0 lg:w-fit w-full order-start lg:order-last">
            <ChatbotUi
              helpdesk={helpdesk}
              avatar={avatar || ""}
              company_name={company_name || ""}
              name={name}
              welcomeMessage={welcomeMessage || ""}
              showHelpdesk={showHelpdesk}
              watermark={watermark || false}
            />
          </CardContent>
        </div>
        <CardContent className="pb-0">
          <div className="w-full">
            <ButtonWithLoaderAndProgress
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-[150px]"
              form="chatbot-form"
            >
              Save
            </ButtonWithLoaderAndProgress>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotSettings;
