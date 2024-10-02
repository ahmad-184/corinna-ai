import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import OTPInput from "@/components/custom/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useSignUp from "@/hooks/auth/use-sign-up";
import Link from "next/link";

const VerifyOtpform = () => {
  const { isLoading, verfiyOtp, verify_otp_form_methods } = useSignUp();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = verify_otp_form_methods;
  setValue("userId", (window.localStorage.getItem("user_id") as string) || "");

  return (
    <Form {...verify_otp_form_methods}>
      <form onSubmit={handleSubmit(verfiyOtp)}>
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-gravel md:text-4xl md:mb-1 font-bold text-lg">
            Enter the code
          </h2>
          <p className=" text-iridium text-sm font-medium">
            Enter the one time password that sent to your email.
          </p>
          <FormField
            control={control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OTPInput maxLength={6} field={field} isLoading={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!errors.userId?.message && (
            <p className="text-destructive text-sm">{errors.userId.message}</p>
          )}
          <ButtonWithLoaderAndProgress disabled={isLoading} loading={isLoading}>
            Create an account
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
    </Form>
  );
};

export default VerifyOtpform;
