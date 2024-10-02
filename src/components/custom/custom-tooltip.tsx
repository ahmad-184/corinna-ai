import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const CustomTooltip = ({
  children,
  content,
  asChild,
  side,
  showTooltip = true,
}: {
  children: React.ReactNode;
  content: string | React.ReactNode;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  showTooltip?: boolean;
}) => {
  return (
    <>
      {showTooltip ? (
        <Tooltip>
          <TooltipTrigger {...(asChild && { asChild })} type="button">
            {children}
          </TooltipTrigger>
          <TooltipContent side={side}>{content}</TooltipContent>
        </Tooltip>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default CustomTooltip;
