import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Plans } from "@prisma/client";

type Props = {
  title: string;
  description: string;
  price: string | number;
  payment: string;
  id: Plans;
  currentPlan: Plans;
};

const SubscriptionCard = ({
  description,
  id,
  payment,
  price,
  title,
  currentPlan,
}: Props) => {
  const disabled = Boolean(
    currentPlan === "PRO" && id === "STANDARD"
      ? true
      : currentPlan === "ULTIMATE" && (id === "STANDARD" || id === "PRO")
      ? true
      : false
  );

  return (
    <Label htmlFor={id}>
      <Card
        className={cn("w-full cursor-pointer", {
          "border-orange": payment === id,
          "opacity-60 cursor-not-allowed": disabled,
        })}
      >
        <CardContent className="flex justify-between p-2 relative">
          <div className="flex items-center gap-3">
            <Card
              className={cn(
                "flex justify-center p-3 border-none bg-orange/10",
                {
                  "bg-orange text-black": payment === id,
                }
              )}
            >
              <CardTitle>${price}</CardTitle>
            </Card>
            <div>
              <CardDescription className="font-bold">{title}</CardDescription>
              <CardDescription className="font-light">
                {description}
              </CardDescription>
            </div>
          </div>
          <div>
            <div className={cn("w-4")}>
              <RadioGroupItem
                className={cn("absolute top-3 right-3", {
                  "bg-orange dark:text-black border-orange": payment === id,
                })}
                id={id}
                value={id}
                disabled={disabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  );
};

export default SubscriptionCard;
