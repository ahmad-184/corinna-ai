import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import OTPInput from "@/components/custom/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useResetPassword from "@/hooks/auth/use-reset-password";

const ResetPasswordVerifyOtpform = () => {
  const { isLoading, verify_otp_form_methods, verfiyOtp } = useResetPassword();
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
            Continue
          </ButtonWithLoaderAndProgress>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordVerifyOtpform;
