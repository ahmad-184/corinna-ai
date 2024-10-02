import { useForm } from "react-hook-form";
import useUpload from "../use-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDomainSettingFormSchema } from "@/zod/domain";
import { useDomainSettingFormSchemaType } from "@/types";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  deleteDomainAction,
  updateDomainSettingsAction,
} from "@/actions/domain";

type Props = {
  defaultValues: useDomainSettingFormSchemaType;
  domain_id: string;
  chatbot_id: string;
};

const useDomainSetting = ({ defaultValues, domain_id, chatbot_id }: Props) => {
  const router = useRouter();

  const form = useForm<useDomainSettingFormSchemaType>({
    resolver: zodResolver(useDomainSettingFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const { mutate: updateSettings, isPending: updateSettingPending } =
    useMutation({
      mutationFn: async (data: useDomainSettingFormSchemaType) => {
        const res = await updateDomainSettingsAction({
          chatbot_id,
          domain_id,
          data: {
            name: data.name,
            welcomeMessage: data.welcomeMessage,
            chatbot_icon: data?.chatbot_icon || "",
            domain_icon: data?.domain_icon || "",
          },
        });
        return res;
      },
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          if (e.data.domain.data?.name !== defaultValues.name)
            router.push(`/dashboard/settings/${e.data.domain.data?.name}`);
          router.refresh();
          toast.success("Settings updated");
        }
      },
      retry: 3,
    });

  const { mutate: deleteDomain, isPending: deleteDomainPending } = useMutation({
    mutationFn: deleteDomainAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        router.push(`/dashboard`);
        router.refresh();
        toast.success("Domain deleted");
      }
    },
    retry: 3,
  });

  const onUpdateDomainSettings = (values: useDomainSettingFormSchemaType) => {
    if (!chatbot_id || !domain_id) return;
    updateSettings(values);
  };

  const onDeleteDomain = () => {
    if (!domain_id) return;
    deleteDomain({ id: domain_id });
  };

  const isLoading = useMemo(() => {
    if (updateSettingPending || deleteDomainPending) return true;
    else return false;
  }, [updateSettingPending, deleteDomainPending]);

  return {
    form,
    onDeleteDomain,
    onUpdateDomainSettings,
    isLoading,
  };
};

export default useDomainSetting;
