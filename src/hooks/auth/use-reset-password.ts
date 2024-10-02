"use client";

import {
  resetPasswordUserAction,
  sendForgotPasswordOtpUserAction,
  verifyOtpAction,
} from "@/actions/auth";
import { useAuthContext } from "@/contexts/use-auth-context";
import {
  emailSchemaType,
  resetPasswordFormSchemaType,
  verifyOtpFormSchemaType,
} from "@/types";
import {
  emailSchema,
  resetPasswordFormSchema,
  verifyOtpFormSchema,
} from "@/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const useResetPassword = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setCurrentStep } = useAuthContext();
  const reset_password_form_methods = useForm<resetPasswordFormSchemaType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
      userId: "",
    },
    mode: "onBlur",
  });

  const send_otp_form_methods = useForm<emailSchemaType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
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

  const { mutate: sendOtpMutate, isPending: sendOtpLoading } = useMutation({
    mutationFn: sendForgotPasswordOtpUserAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        window.localStorage.setItem("user_id", e.data);
        toast.success("6 digits code sent to your email.");
        setCurrentStep(2);
      }
    },
    retry: 3,
  });

  const { mutate: verifyOtpMutate, isPending: verifyOptLoading } = useMutation({
    mutationFn: verifyOtpAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        window.localStorage.setItem("user_id", e.data);
        setCurrentStep(3);
      }
    },
    retry: 3,
  });

  const { mutate: resetPasswordMutate, isPending: resetPasswordLoading } =
    useMutation({
      mutationFn: resetPasswordUserAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          window.localStorage.removeItem("user_id");
          toast.success("Your password changed successully.");
          if (pathname.startsWith("/reset-password")) router.push("/sign-in");
        }
      },
      retry: 3,
    });

  const sendOtp = (data: emailSchemaType) => {
    sendOtpMutate({ email: data.email });
  };

  const verfiyOtp = (data: verifyOtpFormSchemaType) => {
    verifyOtpMutate(data);
  };

  const resetPassword = (data: resetPasswordFormSchemaType) => {
    resetPasswordMutate(data);
  };

  const isLoading = useMemo(() => {
    if (sendOtpLoading || resetPasswordLoading || verifyOptLoading) return true;
    else return false;
  }, [sendOtpLoading, resetPasswordLoading, verifyOptLoading]);

  return {
    reset_password_form_methods,
    verify_otp_form_methods,
    send_otp_form_methods,
    isLoading,
    resetPassword,
    sendOtp,
    verfiyOtp,
  };
};

export default useResetPassword;
