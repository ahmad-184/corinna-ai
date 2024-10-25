import { db } from "@/lib/db";
import AppointmentsTable from "./appointments-table";
import { Card, CardContent } from "@/components/ui/card";
import { fDateTimeHM } from "@/lib/format-time";
import { Separator } from "@/components/ui/separator";
import { isToday } from "date-fns";

type Props = { userId: string };

const AllAppointments = async ({ userId }: Props) => {
  const data = await db.bookings.findMany({
    where: {
      Customer: {
        Domain: { userId: userId },
      },
    },
    select: {
      id: true,
      createdAt: true,
      date: true,
      slot: true,
      domainId: true,
      email: true,
      Customer: {
        select: {
          Domain: {
            select: { name: true },
          },
        },
      },
    },
  });

  const todayAppointments = data.filter((e) => isToday(e.date));

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-3 flex-1 gap-5">
      <div className="xl:col-span-2">
        <AppointmentsTable appointments={data} />
      </div>
      <div className="col-span-1 gap-5 flex flex-col h-full">
        {!!todayAppointments.length &&
          todayAppointments.map((e, i) => (
            <Card key={e.id + i} className="rounded-xl overflow-hidden">
              <CardContent className="p-0 flex">
                <div className="w-4/12 max-w-[300px] text-xl dark:text-black bg-peach py-10 flex justify-center items-center font-bold">
                  {e.slot}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between md:justify-start gap-20 xl:gap-0 xl:justify-between w-full p-3">
                    <p className="text-sm">
                      <span className="text-xs text-muted-foreground">
                        Booked at
                      </span>{" "}
                      <br />
                      {fDateTimeHM(e.createdAt)}
                    </p>
                    <p className="text-sm">
                      <span className="text-xs text-muted-foreground">
                        Domain
                      </span>{" "}
                      <br />
                      {e.Customer?.Domain?.name}
                    </p>
                  </div>
                  <Separator orientation="horizontal" />
                  <div className="w-full flex items-center p-3 gap-2">
                    <div
                      className="text-zinc-400 bg-muted text-sm flex items-center justify-center
                     w-10 h-10 font-bold rounded-full select-none uppercase"
                    >
                      {e.email[0]}
                    </div>
                    <p className="text-sm">
                      <span>{e.email}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        {!todayAppointments.length && (
          <div className="w-full flex justify-center text-muted-foreground h-[200px] items-center">
            <p>No Appointments for Today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
