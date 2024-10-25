"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface CustomDialogProps {
  header: string;
  description?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (e: boolean) => void;
  className?: string;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  header,
  content,
  description,
  children,
  onOpenChange,
  open,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("overflow-auto max-h-[95vh]", className)}>
        <DialogHeader>
          <DialogTitle className="dark:text-gray-200">{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
