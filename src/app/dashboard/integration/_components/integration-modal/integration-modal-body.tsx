import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import StripeConnect from "./connections/stripe-connect";

type Props = {
  type: "stripe";
  connections: { stripe: boolean };
};

const stripe_access = [
  "Payment and bank information",
  "Products and services you sell",
  "Business and tax information",
  "Create and update Products",
];

const IntegrationModalBody = ({ type, connections }: Props) => {
  switch (type) {
    case "stripe":
      return (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Stripe would like to access</h2>
          {stripe_access.map((e, i) => (
            <div
              key={i}
              className="flex gap-2 dark:text-platinum items-center pl-3"
            >
              <CheckCircle2Icon size={20} />
              <p className="text-sm">{e}</p>
            </div>
          ))}
          <div className="flex justify-between pl-3 mt-5">
            <Button variant={"outline"}>Learn more</Button>
            <StripeConnect connected={connections["stripe"]} />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default IntegrationModalBody;
