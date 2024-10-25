"use client";

import { upgradePlanAction } from "@/actions/stripe";
import { Plans } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SubscriptionCard from "./subscription-card";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import { RadioGroup } from "@/components/ui/radio-group";

type Props = {
  plan: Plans;
};

const SubscriptionPlanForm = ({ plan }: Props) => {
  const [payment, setPayment] = useState<Plans>(plan);

  const router = useRouter();

  const { mutate: upgradePlan, isPending: upgradePlanLoading } = useMutation({
    mutationFn: upgradePlanAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        toast.success("Success");
        router.refresh();
      }
    },
  });

  const onSubmit = () => {
    if (!payment) return;
    upgradePlan({ plan: payment });
  };

  useEffect(() => {
    setPayment(plan);
  }, [plan]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="w-full flex flex-col gap-3">
        <RadioGroup onValueChange={(e: Plans) => setPayment(e)} value={payment}>
          <SubscriptionCard
            title="STANDARD"
            description="Perfect if you’re just getting started with Corinna AI"
            price={0}
            id="STANDARD"
            payment={payment}
            currentPlan={plan}
          />
          <SubscriptionCard
            title="PRO"
            description="For serious agency owners"
            price={67}
            id="PRO"
            payment={payment}
            currentPlan={plan}
          />
          <SubscriptionCard
            title="ULTIMATE"
            description="The ultimate agency kit"
            price={97}
            id="ULTIMATE"
            payment={payment}
            currentPlan={plan}
          />
        </RadioGroup>
      </div>
      {plan !== "ULTIMATE" ? (
        <ButtonWithLoaderAndProgress
          loading={upgradePlanLoading}
          disabled={upgradePlanLoading || payment === plan}
          onClick={onSubmit}
        >
          Upgrade
        </ButtonWithLoaderAndProgress>
      ) : null}
    </div>
  );
};

export default SubscriptionPlanForm;
