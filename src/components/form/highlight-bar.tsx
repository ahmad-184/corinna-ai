import { useAuthContext } from "@/contexts/use-auth-context";
import { cn } from "@/lib/utils";

const HighlightBar = () => {
  const { currentStep, setCurrentStep } = useAuthContext();

  return (
    <div className="grid grid-cols-3 gap-3">
      <div
        onClick={() => {
          if (currentStep === 2) setCurrentStep(1);
          if (currentStep === 3) setCurrentStep(2);
        }}
        className={cn(
          "bg-platinum rounded-full h-2 col-span-1 cursor-pointer",
          {
            "bg-orange": currentStep == 1,
          }
        )}
      />
      <div
        onClick={() => {
          if (currentStep === 3) setCurrentStep(2);
        }}
        className={cn(
          "bg-platinum rounded-full h-2 col-span-1 cursor-pointer",
          {
            "bg-orange": currentStep == 2,
          }
        )}
      />
      <div
        className={cn(
          "bg-platinum rounded-full h-2 col-span-1 cursor-pointer",
          {
            "bg-orange": currentStep == 3,
          }
        )}
      />
    </div>
  );
};

export default HighlightBar;
