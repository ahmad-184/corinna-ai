"use client";

import { createCampaignAction } from "@/actions/marketings";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { Form } from "@/components/ui/form";
import { CreateCampaignFormSchemaType } from "@/types";
import { CreateCampaignFormSchema } from "@/zod/marketing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  onOpenModal?: (e: boolean) => void;
};

const CreateCampaignForm = ({ onOpenModal }: Props) => {
  const form = useForm<CreateCampaignFormSchemaType>({
    resolver: zodResolver(CreateCampaignFormSchema),
    defaultValues: {
      name: "",
    },
  });
  const { control, handleSubmit } = form;

  const router = useRouter();

  const { mutate: createCampaignm, isPending: createCampaignLoading } =
    useMutation({
      mutationFn: createCampaignAction,
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
    createCampaignm(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <FormGeneration
          control={control}
          name="name"
          placeholder="Your campaign name"
          id="campaign_name"
          inputType="input"
          type="text"
          disabled={createCampaignLoading}
        />
        <ButtonWithLoaderAndProgress
          disabled={createCampaignLoading}
          loading={createCampaignLoading}
          type="submit"
        >
          Create Campaign
        </ButtonWithLoaderAndProgress>
      </form>
    </Form>
  );
};

export default CreateCampaignForm;
