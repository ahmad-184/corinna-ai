"use client";

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
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  header,
  content,
  description,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-auto max-h-[95vh]">
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
