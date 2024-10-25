import { validateUser } from "@/actions/auth";
import PersonIcon from "@/icons/person-icon";
import { db } from "@/lib/db";
import DashboardCard from "./dashboard-card";
import { DollarSignIcon, FlagIcon } from "lucide-react";
import CalIcon from "@/icons/cal-icon";
import PlanUsage from "./plan-usage";
import { TransactionsIcon } from "@/icons/transactions-icon";
import { Separator } from "@/components/ui/separator";

type Props = {};

const Dashboard = async ({}: Props) => {
  const user = await validateUser();

  const clients = await db.customer.count({
    where: { Domain: { userId: user.id } },
  });

  const transactions = await db.transaction.findMany({
    where: { Domain: { userId: user.id } },
    select: {
      id: true,
      price: true,
      Domain: {
        select: { name: true },
      },
    },
  });
  const totalSales = transactions.reduce((total, next) => {
    return total + Number(next.price);
  }, 0);

  const appointments = await db.bookings.count({
    where: { Customer: { Domain: { userId: user.id } } },
  });

  const subscription = await db.billings.findUnique({
    where: { userId: user.id },
  });

  const domains_count = await db.domain.count({ where: { userId: user.id } });

  const products = await db.product.findMany({
    where: {
      Domain: {
        userId: user.id,
      },
    },
  });
  const total_products_price = products.reduce((total, next) => {
    return total + Number(next.price);
  }, 0);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex flex-col lg:flex-row justify-between gap-5 mb-2">
        <DashboardCard
          value={clients}
          title="Potential Clients"
          icon={<PersonIcon />}
        />
        <DashboardCard
          value={total_products_price * clients || 0}
          title="Pipeline Value"
          sales
          icon={<FlagIcon color="#636363" size={22} strokeWidth={1.5} />}
        />
        <DashboardCard
          value={appointments || 0}
          title="Appointments"
          icon={<CalIcon />}
        />
        <DashboardCard
          value={totalSales || 0}
          title="Total Sales"
          sales
          icon={<DollarSignIcon color="#636363" size={22} strokeWidth={1.5} />}
        />
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2">
        <div>
          <div>
            <h2 className="font-bold text-2xl">Plan Usage</h2>
            <p className="tex-sm font-light text-muted-foreground">
              A detailed overview of your metrics, usage, customers and more.
            </p>
          </div>
          <PlanUsage
            plan={subscription?.plan || "STANDARD"}
            credits={subscription?.credits || 0}
            spent_credits={subscription?.spent_credits || 0}
            clients={clients || 0}
            domains={domains_count}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-between items-start mb-5">
            <div className="flex gap-3 items-center">
              <TransactionsIcon />
              <p className="text-sm">Recent Transactions</p>
            </div>
            <p className="text-sm hover:underline cursor-pointer">See more</p>
          </div>
          <Separator />
          {!transactions.length && (
            <div className="mt-5 w-full text-center">
              <p className="text-muted-foreground">No Transactions</p>
            </div>
          )}
          {!!transactions.length &&
            transactions.slice(0, 5).map(
              (e) =>
                !!e && (
                  <div
                    key={e.id}
                    className="flex gap-3 w-full justify-between items-center border-b-2 py-5"
                  >
                    <p className="font-bold uppercase">{e.Domain.name}</p>
                    <p className="font-bold text-xl">${e.price}</p>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
