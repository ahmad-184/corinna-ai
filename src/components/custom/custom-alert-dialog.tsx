"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface CustomAlertDialogProps {
  header: string;
  description?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (e: boolean) => void;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  header,
  content,
  description,
  children,
  open,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="h-fit max-h-[95vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-gray-200">
            {header}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {content}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
