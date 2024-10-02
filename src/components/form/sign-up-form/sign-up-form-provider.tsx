"use client";

import AuthProvider from "@/contexts/use-auth-context";
import useSignUp from "@/hooks/auth/use-sign-up";
import { FormProvider } from "react-hook-form";

const SignUpFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { methods } = useSignUp();

  return (
    <AuthProvider>
      <FormProvider {...methods}>
        <>{children}</>
      </FormProvider>
    </AuthProvider>
  );
};

export default SignUpFormProvider;
