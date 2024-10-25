"use client";

import FormGeneration from "@/components/form-generation";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import useDomainSetting from "@/hooks/domain/use-domain-setting";
import { Plans } from "@prisma/client";
import Section from "@/components/section";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import UploadImage from "@/components/dropzone/upload-image";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import CustomAlertDialog from "@/components/custom/custom-alert-dialog";

type Props = {
  domain: {
    id: string;
    name: string;
    icon: string;
    chatBot: {
      id: string;
      icon: string | null;
      welcomeMessage: string | null;
    } | null;
  };
  subscription: {
    plan: Plans;
  } | null;
};

const DomainSettingsForm = ({ domain, subscription }: Props) => {
  const { form, isLoading, onDeleteDomain, onUpdateDomainSettings } =
    useDomainSetting({
      domain_id: domain.id || "",
      defaultValues: {
        domain_name: domain.name || "",
        icon: domain.icon || "",
      },
    });

  const { handleSubmit, control, setValue, watch } = form;
  const icon = watch().icon;

  return (
    <Form {...form}>
      <form
        name="domain-form"
        onSubmit={handleSubmit(onUpdateDomainSettings)}
        className="w-full flex flex-col gap-5"
      >
        <div className="w-full flex flex-col gap-10">
          <div className="w-full flex flex-col gap-3">
            <h2 className="font-bold text-2xl">Domain Settings</h2>
            <Separator orientation="horizontal" />
            <div className="flex w-full flex-col lg:flex-row items-start gap-3 lg:gap-10 mt-5 mb-2">
              <div className="w-full max-w-xs order-first lg:order-last">
                <FormGeneration
                  name="domain_name"
                  id="1"
                  control={control}
                  disabled={isLoading}
                  inputType="input"
                  placeholder="mydomain.com"
                  label={"Domain name"}
                  type="text"
                />
              </div>
              <div className="max-w-sm w-full flex-1 flex flex-col gap-1 order-last lg:order-first">
                <Section
                  label="Domain icon"
                  // message="Change your domain icon"
                />
                <div>
                  <div className="flex items-center gap-2 py-1">
                    <UploadImage
                      getValue={(url) => setValue("icon", url)}
                      maxSize={1}
                      max_file={1}
                      value={icon || "http://localhost:3000/images/domain.png"}
                      className="w-[80px] h-[80px] rounded-lg"
                    />
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
                  <p className="text-xs text-muted-foreground ml-1 mt-1">
                    * Recommended size is 300*300, Size less than 1mb
                  </p>
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
                variant={"destructive"}
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
      </form>
    </Form>
  );
};

export default DomainSettingsForm;
