"use client";

import { signInUserAction } from "@/actions/auth";
import { signInFormSchemaType } from "@/types";
import { signInFormSchema } from "@/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const useSignIn = () => {
  const router = useRouter();
  const methods = useForm<signInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const { mutate: signInMutate, isPending: isLoading } = useMutation({
    mutationFn: signInUserAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        toast.success("Success", {
          description: "Wellcome to dashbaord",
        });
        router.push("/dashboard");
      }
    },
    retry: 3,
  });

  const signIn = (data: signInFormSchemaType) => {
    signInMutate(data);
  };

  return {
    methods,
    isLoading,
    signIn,
  };
};

export default useSignIn;
