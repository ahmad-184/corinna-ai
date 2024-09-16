import { useAuthContext } from "@/contexts/use-auth-context";
import TypeSelectionForm from "./type-selection-form";

const RegistrationFormStep = () => {
  const { currentStep } = useAuthContext();

  switch (currentStep) {
    case 1:
      return <TypeSelectionForm />;
    default:
      return <></>;
  }
};

export default RegistrationFormStep;
