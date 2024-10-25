import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDomainSettingFormSchema } from "@/zod/domain";
import { useDomainSettingFormSchemaType } from "@/types";
import { useMemo } from "react";
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
};

const useDomainSetting = ({ defaultValues, domain_id }: Props) => {
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
          id: domain_id,
          data: {
            domain_name: data.domain_name,
            icon: data?.icon || "",
          },
        });
        return res;
      },
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          if (e.data.data?.name !== defaultValues.domain_name)
            router.push(`/dashboard/settings/${e.data.data?.name}`);
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
    if (!domain_id) return;
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
