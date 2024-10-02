import type { VariantProps } from "class-variance-authority";
import { Loader } from "./loader";
import { Button, buttonVariants } from "./ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  isUploading?: boolean;
  progress?: number;
  loaderColor?: string;
}

const ButtonWithLoaderAndProgress: React.FC<Props> = ({
  loading,
  isUploading,
  progress,
  children,
  className,
  loaderColor,
  ...props
}) => {
  return (
    <Button
      className={cn("disabled:opacity-100", className, {
        "opacity-50": isUploading || loading,
      })}
      {...props}
    >
      <Loader loading={(!isUploading && loading) || false} noPadding>
        {isUploading ? (
          <div className="flex w-full items-center gap-1">
            <small className="text-muted dark:text-zinc-100">{progress}%</small>
            <Progress value={progress} className="flex-grow" />
          </div>
        ) : null}
        {!isUploading && !loading ? children : null}
      </Loader>
    </Button>
  );
};

export default ButtonWithLoaderAndProgress;
