"use client";

import { signUpFormSchemaType } from "@/types";
import { signUpFormSchema } from "@/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { registerUserAction, verifyEmailAction } from "@/actions/auth";
import { useAuthContext } from "@/contexts/use-auth-context";
import { toast } from "sonner";
import { useMemo, useState } from "react";

const useSignUp = () => {
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const methods = useForm<signUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      passwordConfirmation: "",
      type: "owner",
    },
    mode: "onChange",
  });

  const { setCurrentStep } = useAuthContext();

  const { mutate: signUpMutate, isPending: signUpMutateLoading } = useMutation({
    mutationFn: registerUserAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        setCurrentStep(3);
        setUserId(e.data.id);
        window.localStorage.setItem("user_id", e.data.id);
      }
    },
    retry: 3,
  });

  const { mutate: verifyOtpMutate, isPending: verifyOptLoading } = useMutation({
    mutationFn: verifyEmailAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        router.push("/sign-in");
        toast.success("Registration was successfull", {
          description: "Now you can sign in to your account",
        });
      }
    },
    retry: 3,
  });

  const isLoading = useMemo(() => {
    if (signUpMutateLoading || verifyOptLoading) return true;
    else return false;
  }, [verifyOptLoading, signUpMutateLoading]);

  const signUp = (data: signUpFormSchemaType) => {
    signUpMutate({ ...data });
  };

  const verfiyOtp = () => {
    const savedUserId = window.localStorage.getItem("user_id") as string;
    if (userId || (savedUserId && otp))
      verifyOtpMutate({ userId: userId || savedUserId, otp });
  };

  return {
    methods,
    signUp,
    isLoading,
    verfiyOtp,
    otp,
    setOtp,
  };
};

export default useSignUp;
