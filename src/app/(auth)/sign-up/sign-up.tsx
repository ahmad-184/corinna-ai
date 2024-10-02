"use client";

import HighlightBar from "@/components/form/highlight-bar";
import RegistrationFormSteps from "@/components/form/sign-up-form/registration-form-steps";
import SignUpFormProvider from "@/components/form/sign-up-form/sign-up-form-provider";

const SignUp = () => {
  return (
    <SignUpFormProvider>
      <div className="flex flex-col gap-3 mb-10">
        <RegistrationFormSteps />
      </div>
      <HighlightBar />
    </SignUpFormProvider>
  );
};

export default SignUp;
