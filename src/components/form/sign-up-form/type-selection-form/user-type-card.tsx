import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";

type UserTypeCardProps = {
  value: "owner" | "student";
  title: string;
  description: string;
  userType: "owner" | "student" | "";
  setUserType: (value: "owner" | "student") => void;
};

const UserTypeCard = ({
  value,
  title,
  description,
  userType,
  setUserType,
}: UserTypeCardProps) => {
  return (
    <Label htmlFor={value}>
      <Card
        className={cn("relative w-full cursor-pointer", {
          "border-orange": value === userType,
        })}
        onClick={() => setUserType(value)}
      >
        <CardContent className="flex justify-between p-2">
          <div className="flex items-center gap-3">
            <Card
              className={cn("p-3", { "border-orange": value === userType })}
            >
              <UserIcon
                size={30}
                className={cn("text-gray-400", {
                  "!text-orange": value === userType,
                })}
              />
            </Card>
            <div>
              <CardDescription
                className={cn("font-bold text-gray-900", {
                  "!text-orange": value === userType,
                })}
              >
                {title}
              </CardDescription>
              <CardDescription className="font-medium text-sm">
                {description}
              </CardDescription>
            </div>
            {value === userType ? (
              <div
                className={
                  "absolute p-[6px] rounded-full bg-orange top-3 right-3"
                }
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Label>
  );
};

export default UserTypeCard;
