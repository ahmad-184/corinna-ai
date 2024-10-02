import { getUserSubscriptionPlan } from "@/actions/user";
import Section from "@/components/section";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { pricingCards } from "@/constants/pricing";
import { UserType } from "@/types";
import { CircleCheckBig, PlusIcon } from "lucide-react";

type Props = {
  user: UserType;
};

const BillingSetting = async ({ user }: Props) => {
  const { data: subscription_plan } = await getUserSubscriptionPlan({
    user_id: user.id,
  });

  if (!subscription_plan) throw new Error("User subscription plan not found.");

  const planFeatures = pricingCards.find(
    (e) => e.title.toUpperCase() === subscription_plan.plan
  );

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-5 lg:gap-10 gap-6">
      <div className="lg:col-span-1">
        <Section
          label="Billing settings"
          message="Add payment information, upgrade and modify your plan."
        />
      </div>
      <div className="lg:col-span-2 flex justify-start lg:justify-center">
        <Card className="border-dashed max-w-xl bg-cream dark:bg-zinc-800 border-zinc-400 w-full cursor-pointer h-[270px] flex justify-center items-center">
          <CardContent className="flex gap-2 items-center">
            <div className="rounded-full border-2 dark:border-muted-foreground p-1">
              <PlusIcon className="text-muted-foreground" />
            </div>
            <CardDescription className="font-semibold">
              Upgrade Plan
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <h3 className="text-xl font-semibold mb-2">Current Plan</h3>
        <p className="text-sm font-semibold mb-1">{subscription_plan.plan}</p>
        <p className="text-sm font-light">
          {subscription_plan.plan === "PRO"
            ? "Start growing your business today"
            : subscription_plan.plan === "ULTIMATE"
            ? "The ultimate growth plan that sets you up for success"
            : "Perfect if you're just getting started with Corinna AI"}
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {planFeatures?.features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <CircleCheckBig size={22} />
              <p className="text-sm">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingSetting;
