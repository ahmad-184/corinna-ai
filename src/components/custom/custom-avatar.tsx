import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

interface CustomAvatarProps {
  user: Partial<User>;
  className?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  user,
  className,
  onClick,
  width,
  height,
}) => {
  const fallbackName = user?.fullname
    ?.split(" ")
    .map((e) => e.split(""))
    .map((e) => e[0])
    .join("");
  return (
    <Avatar className={cn("relative", className)} onClick={onClick}>
      {/* {user?.avatar ? ( */}
      <Image
        src={
          user.avatar ||
          "https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2Fpreview.png%3Fsize%3D144%26seed%3D1723502897887%26initials%3DAD%26isSquare%3Dtrue%26bgType%3Dmarble%26bgColor%3D4797ff%26fgType%3Dsilhouette%26fgColor%3DFFFFFF%26type%3Duser&w=96&q=75"
        }
        alt={`${user?.fullname} profile`}
        fill
        sizes="100"
        className="object-cover w-full h-full"
      />
      {/* ) : (
         <AvatarFallback className="uppercase select-none w-full h-full absolute bg-primary/80">
           {fallbackName}
         </AvatarFallback>
      )} */}
    </Avatar>
  );
};

export default CustomAvatar;
