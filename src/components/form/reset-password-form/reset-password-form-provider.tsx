"use client";

import AuthProvider from "@/contexts/use-auth-context";

const ResetPasswordFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <>{children}</>
    </AuthProvider>
  );
};

export default ResetPasswordFormProvider;
