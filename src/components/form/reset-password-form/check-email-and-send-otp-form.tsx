import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { Form } from "@/components/ui/form";
import { CHECK_USER_EMAIL_FORM } from "@/constants/forms";
import useResetPassword from "@/hooks/auth/use-reset-password";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

const CheckEmailAndSendOtpForm = () => {
  const { send_otp_form_methods, sendOtp, isLoading } = useResetPassword();
  const { handleSubmit, control } = send_otp_form_methods;
  return (
    <Form {...send_otp_form_methods}>
      <form
        onSubmit={handleSubmit(sendOtp)}
        className="w-full flex flex-col gap-3"
      >
        <div className="flex flex-col gap-3 w-full">
          <div className="w-full">
            <Link
              href={"/sign-in"}
              className="text-sm underline flex items-center"
            >
              <ChevronLeftIcon size={19} strokeWidth={1.4} />
              Back
            </Link>
          </div>
          <h2 className="text-gravel md:text-4xl md:mb-1 font-bold text-lg">
            Enter your email
          </h2>
          <p className=" text-iridium text-sm font-medium">
            Please enter your email so we can send you the reset password code
          </p>
        </div>
        {CHECK_USER_EMAIL_FORM.map((e) => (
          <FormGeneration
            key={e.id}
            control={control}
            disabled={isLoading}
            {...e}
          />
        ))}
        <ButtonWithLoaderAndProgress disabled={isLoading} loading={isLoading}>
          Continue
        </ButtonWithLoaderAndProgress>
      </form>
    </Form>
  );
};

export default CheckEmailAndSendOtpForm;
