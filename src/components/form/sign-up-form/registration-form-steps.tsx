import { useAuthContext } from "@/contexts/use-auth-context";
import TypeSelectionForm from "./type-selection-form";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/spinner";

const AccountDetailsForm = dynamic(() => import("./account-details-form"), {
  ssr: false,
  loading: () => <Spinner />,
});

const VerifyOtpform = dynamic(() => import("./verify-otp-form"), {
  ssr: false,
  loading: () => <Spinner />,
});

const RegistrationFormSteps = () => {
  const { currentStep } = useAuthContext();

  switch (currentStep) {
    case 1:
      return <TypeSelectionForm />;
    case 2:
      return <AccountDetailsForm />;
    case 3:
      return <VerifyOtpform />;
    default:
      return <></>;
  }
};

export default RegistrationFormSteps;
