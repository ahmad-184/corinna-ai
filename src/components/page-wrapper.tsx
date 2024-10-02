import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PageWrapper = ({ children, ...props }: Props) => {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-1 w-full gap-10 flex-col pb-10",
        props.className
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
