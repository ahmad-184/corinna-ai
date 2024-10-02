"use client";

import { HeadphonesIcon, StarIcon, TrashIcon } from "lucide-react";
import { Card } from "../ui/card";
import BreadCrumb from "./bread-crumb";
import CustomAvatar from "../custom/custom-avatar";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { UserType } from "@/types";

interface Props {
  user: UserType;
}

const InfoBar = ({ user }: Props) => {
  return (
    <div className="w-full flex justify-between items-center py-1 mb-6">
      <BreadCrumb />
      <div className="flex gap-3 items-center">
        <div>
          <Card className="rounded-xl flex gap-3 py-3 px-4 text-ghost">
            <TrashIcon />
            <StarIcon />
          </Card>
        </div>
        <Avatar>
          <AvatarFallback className="bg-orange text-white">
            <HeadphonesIcon />
          </AvatarFallback>
        </Avatar>
        <CustomAvatar user={user} />
      </div>
    </div>
  );
};

export default InfoBar;
