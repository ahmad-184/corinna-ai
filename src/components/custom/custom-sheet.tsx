import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type Props = {
  children: React.ReactNode;
  content?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};

const CustomSheet = ({
  children,
  content,
  description,
  title,
  className,
}: Props) => {
  return (
    <Sheet>
      <SheetTrigger className={cn("", className)}>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
};

export default CustomSheet;
