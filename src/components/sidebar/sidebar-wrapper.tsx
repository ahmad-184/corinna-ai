"use client";

import { useSidebar } from "@/contexts/use-sidebar-context";
import { cn } from "@/lib/utils";

type Props = { children: React.ReactNode };

const SidebarWrapper = ({ children }: Props) => {
  const { expand } = useSidebar();

  return (
    <div
      className={cn(
        "bg-cream dark:bg-zinc-900 h-full overflow-x-hidden transition-all duration-200 fill-mode-forwards relative",
        {
          "md:!w-[300px] !max-w-[60px] md:!max-w-[300px]": expand,
          "!w-[60px] !max-w-[60px]": !expand,
        }
      )}
    >
      {children}
    </div>
  );
};

export default SidebarWrapper;
