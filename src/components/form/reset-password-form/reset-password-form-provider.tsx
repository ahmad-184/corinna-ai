"use client";

import AuthProvider from "@/contexts/use-auth-context";
import { Fragment } from "react";

const ResetPasswordFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <Fragment>{children}</Fragment>
    </AuthProvider>
  );
};

export default ResetPasswordFormProvider;
