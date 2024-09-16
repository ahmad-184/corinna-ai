"use client";

import { CircleAlertIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  alertVariants,
} from "../ui/alert";
import { VariantProps } from "class-variance-authority";

interface CustomAlertProps extends VariantProps<typeof alertVariants> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  variant,
  title,
  description,
  children,
}) => {
  return (
    <Alert variant={variant || "default"}>
      <CircleAlertIcon className="w-4 h-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {children}
    </Alert>
  );
};

export default CustomAlert;
