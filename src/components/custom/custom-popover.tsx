"use client";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface CustomPopoverProps {
  content?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
  onOpenChange?: (e: boolean) => void;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({
  content,
  children,
  onOpenChange,
  open,
  className,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className={cn("overflow-auto max-h-[95vh]", className)}>
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default CustomPopover;
