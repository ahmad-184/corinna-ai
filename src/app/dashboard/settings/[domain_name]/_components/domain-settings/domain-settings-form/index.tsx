"use client";

import FormGeneration from "@/components/form-generation";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import useDomainSetting from "@/hooks/domain/use-domain-setting";
import { Plans } from "@prisma/client";
import CodeSnippet from "./code-snippet";
import PremiumBadge from "@/icons/premium-badge";
import EditChatbotIcon from "./edit-chatbot-icon";
import Image from "next/image";
import Section from "@/components/section";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import UploadImage from "@/components/dropzone/upload-image";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import CustomAlertDialog from "@/components/custom/custom-alert-dialog";

type Props = {
  data: {
    domains: {
      id: string;
      name: string;
      icon: string;
      chatBot: {
        id: string;
        icon: string | null;
        welcomeMessage: string | null;
      } | null;
    }[];
    subscription: {
      plan: Plans;
    } | null;
  } | null;
};

const DomainSettingsForm = ({ data }: Props) => {
  const { form, isLoading, onDeleteDomain, onUpdateDomainSettings } =
    useDomainSetting({
      chatbot_id: data?.domains[0]?.chatBot?.id || "",
      domain_id: data?.domains[0]?.id || "",
      defaultValues: {
        name: data?.domains[0]?.name || "",
        welcomeMessage: data?.domains[0]?.chatBot?.welcomeMessage || "",
        domain_icon: data?.domains[0]?.icon || "",
        chatbot_icon: data?.domains[0]?.chatBot?.icon || "",
      },
    });

  const { handleSubmit, control, setValue, watch } = form;
  const chatbot_icon = watch().chatbot_icon;
  const domain_icon = watch().domain_icon;

  return (
    <Form {...form}>
      <form
        name="domain-form"
        onSubmit={handleSubmit(onUpdateDomainSettings)}
        className="w-full"
      >
        <div className="w-full flex flex-col gap-10">
          <div className="w-full flex flex-col gap-3">
            <h2 className="font-bold text-2xl">Domain Settings</h2>
            <Separator orientation="horizontal" />
            <div className="flex w-full flex-col md:flex-row items-start gap-3 md:gap-14 mt-5 mb-2">
              <div className="w-full max-w-xs mb-3">
                <FormGeneration
                  name="name"
                  id="1"
                  control={control}
                  disabled={isLoading}
                  inputType="input"
                  placeholder="mydomain.com"
                  label={"Domain name"}
                  type="text"
                />
              </div>
              <div className="max-w-sm w-full flex-1 flex flex-col gap-2">
                <Section
                  label="Domain icon"
                  message="Change your domain icon"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <UploadImage
                      getValue={(url) => setValue("domain_icon", url)}
                      maxSize={1}
                      max_file={1}
                      value={
                        domain_icon || "http://localhost:3000/images/domain.png"
                      }
                      className="w-[60px] h-[60px] rounded-lg"
                    />
                    {!!domain_icon?.length && (
                      <Button
                        size={"icon"}
                        type="button"
                        onClick={() => setValue("domain_icon", "")}
                        variant={"secondary"}
                      >
                        <TrashIcon size={22} />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground ml-1 mt-1">
                    * Recommended size is 300*300, Size less than 1mb
                  </p>
                </div>
              </div>
            </div>
            <CodeSnippet id={data?.domains[0]?.chatBot?.id!} />
            <div className="w-full flex flex-col gap-3 mt-7">
              <div className="flex items-center gap-4">
                <h2 className="font-bold text-2xl">Chatbot Settings</h2>
                {data?.subscription?.plan === "PRO" ||
                data?.subscription?.plan === "ULTIMATE" ? (
                  <div className="flex gap-1 bg-zinc-100 rounded-full px-3 py-1 text-xs items-center font-bold">
                    <PremiumBadge />
                    Premium
                  </div>
                ) : null}
              </div>
              <Separator orientation="horizontal" />
              <div className="grid grid-cols-1 md:grid-cols-2 mt-6">
                <div className="col-span-1 order-last md:order-first md:col-span-1 flex flex-col justify-center gap-5">
                  <EditChatbotIcon
                    icon={chatbot_icon}
                    getValue={(url) => {
                      setValue("chatbot_icon", url);
                    }}
                  />
                  <div className="w-full flex flex-col gap-3 pb-10">
                    <Section
                      label="Greeting message"
                      message="Customize your welcome message"
                    />
                    <div className="max-w-md mb-3">
                      <FormGeneration
                        name="welcomeMessage"
                        id="2"
                        control={control}
                        disabled={isLoading}
                        inputType="textarea"
                        placeholder="Hey there, have a question? Text us here"
                        type="text"
                        rows={5}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-1 order-first md:order-last flex w-full items-center justify-center">
                  <Image
                    src={"/images/bot-ui.png"}
                    alt="chatbot icon"
                    width={500}
                    height={500}
                    className="max-w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex gap-4">
          <ButtonWithLoaderAndProgress
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            className="w-[150px]"
          >
            Save
          </ButtonWithLoaderAndProgress>
          <CustomAlertDialog
            header="Are you sure?"
            description="This action can not be undon, by delete domain all the related data will permanently deleted forever."
            content={
              <ButtonWithLoaderAndProgress
                loading={isLoading}
                disabled={isLoading}
                onClick={onDeleteDomain}
              >
                I understand, delete anyway
              </ButtonWithLoaderAndProgress>
            }
          >
            <ButtonWithLoaderAndProgress
              type="button"
              loading={isLoading}
              disabled={isLoading}
              className="w-[150px]"
              variant={"destructive"}
            >
              Delete Domain
            </ButtonWithLoaderAndProgress>
          </CustomAlertDialog>
        </div>
        <br />
        <Separator orientation="horizontal" />
      </form>
    </Form>
  );
};

export default DomainSettingsForm;
