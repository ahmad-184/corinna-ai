"use client";

import HighlightBar from "@/components/form/highlight-bar";
import ResetPasswordFormProvider from "@/components/form/reset-password-form/reset-password-form-provider";
import ResetPasswordFormStep from "@/components/form/reset-password-form/reset-password-steps";

const ResetPassword = () => {
  return (
    <ResetPasswordFormProvider>
      <div className="flex flex-col gap-3 mb-10">
        <ResetPasswordFormStep />
      </div>
      <HighlightBar />
    </ResetPasswordFormProvider>
  );
};

export default ResetPassword;
