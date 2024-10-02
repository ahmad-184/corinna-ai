import { useSidebar } from "@/contexts/use-sidebar-context";
import CustomTooltip from "../custom/custom-tooltip";
import { cn } from "@/lib/utils";

type Props = {
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
  className?: string;
};

const MenuItem = ({ icon, label, onClick, className }: Props) => {
  const { expand } = useSidebar();

  return (
    <CustomTooltip content={label} side="right" showTooltip={!expand}>
      <div
        className={cn("flex items-center gap-3", className)}
        onClick={onClick}
      >
        {icon}
        {!!expand && (
          <p className="dark:text-zinc-300 fill-mode-forwards animate-fade-in opacity-0 delay-300 transition-all ease-in-out">
            {label}
          </p>
        )}
      </div>
    </CustomTooltip>
  );
};

export default MenuItem;
