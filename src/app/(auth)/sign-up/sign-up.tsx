"use client";

import RegistrationFormStep from "@/components/form/sign-up-form/registration-form-step";
import SignUpFormProvider from "@/components/form/sign-up-form/sign-up-form-provider";

const SignUp = () => {
  return (
    <SignUpFormProvider>
      <div className="flex flex-col gap-3">
        <RegistrationFormStep />
      </div>
    </SignUpFormProvider>
  );
};

export default SignUp;
