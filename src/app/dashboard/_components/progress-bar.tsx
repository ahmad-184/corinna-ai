import { Progress } from "@/components/ui/progress";

type Props = { label: string; end: number; credits: number };

const ProgressBar = ({ credits, end, label }: Props) => {
  return (
    <div className="flex flex-col w-full md:w-7/12 gap-1">
      <h2 className="font-semibold">{label}</h2>
      <div className="flex flex-col">
        <div className="flex justify-between text-sm">
          <p>{credits}</p>
          <p>{end}</p>
        </div>
        <Progress value={(credits / end) * 100} className="w-full" />
      </div>
    </div>
  );
};

export default ProgressBar;
