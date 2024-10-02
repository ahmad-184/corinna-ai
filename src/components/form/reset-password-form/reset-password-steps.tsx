import { useAuthContext } from "@/contexts/use-auth-context";
import CheckEmailAndSendOtpForm from "./check-email-and-send-otp-form";
import { Spinner } from "@/components/spinner";
import dynamic from "next/dynamic";

const ResetPasswordVerifyOtpform = dynamic(
  () => import("./reset-password-verify-otp-form"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

const ResetPasswordForm = dynamic(() => import("./reset-password-form"), {
  ssr: false,
  loading: () => <Spinner />,
});

const ResetPasswordFormSteps = () => {
  const { currentStep } = useAuthContext();

  switch (currentStep) {
    case 1:
      return <CheckEmailAndSendOtpForm />;
    case 2:
      return <ResetPasswordVerifyOtpform />;
    case 3:
      return <ResetPasswordForm />;
    default:
      return <></>;
  }
};

export default ResetPasswordFormSteps;
