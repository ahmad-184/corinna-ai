import { useAuthContext } from "@/contexts/use-auth-context";
import { useFormContext } from "react-hook-form";
import UserTypeCard from "./user-type-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TypeSelectionForm = () => {
  const { register, getValues } = useFormContext();
  const { setCurrentStep } = useAuthContext();
  const [selectedType, setSelectedType] = useState<"owner" | "student" | "">(
    getValues().type || ""
  );

  const handleNextStep = () => {
    if (
      selectedType === "" ||
      (selectedType !== "owner" && selectedType !== "student")
    )
      return;
    setCurrentStep(2);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="text-gravel md:text-4xl md:mb-1 font-bold text-lg">
        Create an account
      </h2>
      <p className=" text-iridium text-sm font-medium">
        Tell us abount yourself! What do you do? Let's tailor your
        <br /> experience so it best suits you.
      </p>
      <UserTypeCard
        value="owner"
        title="I own a business"
        description="Setting up my account for company"
        userType={selectedType}
        setUserType={(e) => setSelectedType(e)}
        register={register}
      />
      <UserTypeCard
        value="student"
        title="I'm a student"
        description="Looking to learn the tool"
        userType={selectedType}
        setUserType={(e) => setSelectedType(e)}
        register={register}
      />
      <Button onClick={handleNextStep}>Continue</Button>
      <div className="text-center w-full">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href={"/sign-in"} className="underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TypeSelectionForm;
