import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { USER_LOGIN_FORM } from "@/constants/forms";
import useSignIn from "@/hooks/auth/use-sign-in";
import Link from "next/link";
import { FormProvider } from "react-hook-form";

const SignInForm = () => {
  const { methods, signIn, isLoading } = useSignIn();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(signIn)}
        className="w-full flex flex-col gap-3"
      >
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-gravel md:text-4xl md:mb-1 font-bold text-lg">
            Login
          </h2>
          <p className=" text-iridium text-sm font-medium">
            Please enter your email and password.
          </p>
        </div>
        <div className="w-full flex flex-col gap-1">
          {USER_LOGIN_FORM.map((e) => (
            <FormGeneration
              key={e.id}
              control={methods.control}
              disabled={isLoading}
              {...e}
            />
          ))}
          <p className="text-xs">
            <Link href={"/reset-password"} className="underline font-medium">
              Forgot your password?{" "}
            </Link>
          </p>
        </div>
        <ButtonWithLoaderAndProgress disabled={isLoading} loading={isLoading}>
          Continue
        </ButtonWithLoaderAndProgress>
        <div className="text-center w-full">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href={"/sign-up"} className="underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignInForm;
