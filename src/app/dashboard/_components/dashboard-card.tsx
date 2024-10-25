type Props = {
  value: number;
  title: string;
  icon: React.ReactNode;
  sales?: boolean;
};

const DashboardCard = ({ icon, title, value, sales }: Props) => {
  return (
    <div className="bg-muted border flex-1 rounded-lg flex flex-col gap-3 px-10 pr-5 py-10 md:pl-10">
      <div className="flex gap-3">
        <div>{icon}</div>
        <h2 className="font-bold text-xl break-normal truncate">{title}</h2>
      </div>
      <p className="font-bold text-4xl">
        {!!sales && "$"}
        {value}
      </p>
    </div>
  );
};

export default DashboardCard;
