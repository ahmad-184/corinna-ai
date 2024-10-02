"use client";

import { signUpFormSchemaType, verifyOtpFormSchemaType } from "@/types";
import { signUpFormSchema, verifyOtpFormSchema } from "@/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { registerUserAction, verifyOtpAction } from "@/actions/auth";
import { useAuthContext } from "@/contexts/use-auth-context";
import { toast } from "sonner";
import { useMemo } from "react";

const useSignUp = () => {
  const router = useRouter();
  const methods = useForm<signUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      passwordConfirmation: "",
      type: undefined,
    },
    mode: "onBlur",
  });

  const verify_otp_form_methods = useForm<verifyOtpFormSchemaType>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: {
      otp: "",
      userId: "",
    },
    mode: "onBlur",
  });

  const { setCurrentStep } = useAuthContext();

  const { mutate: registerMutate, isPending: signUpMutateLoading } =
    useMutation({
      mutationFn: registerUserAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          window.localStorage.setItem("user_id", e.data.id);
          setCurrentStep(3);
        }
      },
      retry: 3,
    });

  const { mutate: verifyOtpMutate, isPending: verifyOptLoading } = useMutation({
    mutationFn: verifyOtpAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        window.localStorage.removeItem("user_id");
        router.push("/sign-in");
        toast.success("Registration was successfull", {
          description: "Now you can login to your dashboard",
        });
      }
    },
    retry: 3,
  });

  const isLoading = useMemo(() => {
    if (signUpMutateLoading || verifyOptLoading) return true;
    else return false;
  }, [verifyOptLoading, signUpMutateLoading]);

  const register = (data: signUpFormSchemaType) => {
    registerMutate({ ...data });
  };

  const verfiyOtp = (data: verifyOtpFormSchemaType) => {
    verifyOtpMutate({ ...data });
  };

  return {
    methods,
    register,
    isLoading,
    verfiyOtp,
    verify_otp_form_methods,
  };
};

export default useSignUp;
