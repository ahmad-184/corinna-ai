import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { USER_REGISTRATION_FORM } from "@/constants/forms";
import useSignUp from "@/hooks/auth/use-sign-up";
import { signUpFormSchemaType } from "@/types";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

const AccountDetailsForm = () => {
  const { control, handleSubmit } = useFormContext<signUpFormSchemaType>();
  const { isLoading, register } = useSignUp();

  return (
    <form onSubmit={handleSubmit(register)}>
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-gravel md:text-4xl md:mb-1 font-bold text-lg">
          Account details
        </h2>
        <p className=" text-iridium text-sm font-medium">
          Please enter your email and password.
        </p>
        <div className="w-full flex flex-col gap-1">
          {USER_REGISTRATION_FORM.map((e) => (
            <FormGeneration
              key={e.id}
              control={control}
              disabled={isLoading}
              {...e}
            />
          ))}
        </div>
        <ButtonWithLoaderAndProgress disabled={isLoading} loading={isLoading}>
          Continue
        </ButtonWithLoaderAndProgress>
        <div className="text-center w-full">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default AccountDetailsForm;
