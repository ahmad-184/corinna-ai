"use client";

import {
  createCampaignAction,
  updateEmailTemplateAction,
} from "@/actions/marketings";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { Form } from "@/components/ui/form";
import {
  CreateCampaignFormSchemaType,
  UpdateEmailTemplateFormSchemaType,
} from "@/types";
import {
  CreateCampaignFormSchema,
  UpdateEmailTemplateFormSchema,
} from "@/zod/marketing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  onOpenModal?: (e: boolean) => void;
  campaignId: string;
  emailTemplate: string;
};

const UpdateEmailTemplateForm = ({
  onOpenModal,
  campaignId,
  emailTemplate,
}: Props) => {
  const form = useForm<UpdateEmailTemplateFormSchemaType>({
    resolver: zodResolver(UpdateEmailTemplateFormSchema),
    defaultValues: {
      campaignId,
      emailTemplate,
    },
  });
  const { control, handleSubmit, setValue } = form;

  const router = useRouter();

  const { mutate: updateTemplate, isPending: updateTemplateLoading } =
    useMutation({
      mutationFn: updateEmailTemplateAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          if (onOpenModal) onOpenModal(false);
          router.refresh();
          toast.success("Success");
        }
      },
    });

  const onSubmit = handleSubmit((values) => {
    updateTemplate({
      campaignId: values.campaignId,
      emailTemplate: JSON.stringify(values.emailTemplate),
    });
  });

  useEffect(() => {
    setValue("campaignId", campaignId);
  }, [campaignId]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <div className="w-full flex flex-col gap-0">
          <p className="text-sm font-medium">Message</p>
          <FormGeneration
            control={control}
            name="emailTemplate"
            placeholder="Template"
            id="email_template"
            inputType="textarea"
            type="text"
            rows={6}
            disabled={updateTemplateLoading}
          />
        </div>
        <ButtonWithLoaderAndProgress
          disabled={updateTemplateLoading}
          loading={updateTemplateLoading}
          type="submit"
        >
          Update
        </ButtonWithLoaderAndProgress>
      </form>
    </Form>
  );
};

export default UpdateEmailTemplateForm;
