"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDomainFormSchema } from "@/zod/domain";
import { createDomainFormSchemaType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createDomainAction } from "@/actions/domain";
import { useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useDomain = () => {
  const router = useRouter();

  const form = useForm<createDomainFormSchemaType>({
    resolver: zodResolver(createDomainFormSchema),
    defaultValues: {
      name: "",
      image: "",
    },
    mode: "onChange",
  });

  const { mutate: createDomain, isPending: createDomainPending } = useMutation({
    mutationFn: createDomainAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        router.refresh();
        form.reset();
        toast.success("New domain added");
      }
    },
    retry: 3,
  });

  const onCreateDomain = async (values: createDomainFormSchemaType) => {
    createDomain(values);
  };

  const isLoading = useMemo(() => {
    if (createDomainPending) return true;
    else return false;
  }, [createDomainPending]);

  return {
    onCreateDomain,
    loading: isLoading,
    form,
  };
};

export default useDomain;
