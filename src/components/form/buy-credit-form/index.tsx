"use client";

import { increaseCreditAction } from "@/actions/stripe";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ADD_CREDIT_FORM } from "@/constants/forms";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {};

const BuyCreditsForm = ({}: Props) => {
  const [credit, setCredit] = useState("100");

  const router = useRouter();

  const { mutate: upgradePlan, isPending: upgradePlanLoading } = useMutation({
    mutationFn: increaseCreditAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        toast.success("Success");
        router.refresh();
      }
    },
  });

  const onSubmit = () => {
    if (!credit) return;
    upgradePlan({ credit });
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="w-full flex flex-col gap-3">
        <RadioGroup onValueChange={(e: string) => setCredit(e)} value={credit}>
          {ADD_CREDIT_FORM.map((e, i) => (
            <Label htmlFor={`credit-${e.id}`} key={e.id + i}>
              <Card
                className={cn("w-full cursor-pointer", {
                  "border-orange": credit === e.value,
                })}
              >
                <CardContent className="flex justify-between p-2 relative">
                  <div className="flex items-center gap-3">
                    <Card
                      className={cn(
                        "flex justify-center p-3 border-none bg-orange/10",
                        {
                          "bg-orange text-black": credit === e.value,
                        }
                      )}
                    >
                      <CardTitle>${e.price}</CardTitle>
                    </Card>
                    <div>
                      <CardDescription className="font-bold">
                        {e.title}
                      </CardDescription>
                      <CardDescription className="font-light">
                        {e.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div>
                    <div className={cn("w-4")}>
                      <RadioGroupItem
                        className={cn("absolute top-3 right-3", {
                          "bg-orange dark:text-black border-orange":
                            credit === e.value,
                        })}
                        id={`credit-${e.id}`}
                        value={e.value}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          ))}
        </RadioGroup>
      </div>
      <ButtonWithLoaderAndProgress
        loading={upgradePlanLoading}
        disabled={upgradePlanLoading}
        onClick={onSubmit}
      >
        Add
      </ButtonWithLoaderAndProgress>
    </div>
  );
};

export default BuyCreditsForm;
