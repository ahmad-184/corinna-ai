"use client";

import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import DataTable from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { fDate, fDateTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { isPast, isToday, isFuture } from "date-fns";
import { SearchIcon, Trash2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CustomAlertDialog from "@/components/custom/custom-alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { deleteManyAppointmentAction } from "@/actions/appointment";
import { toast } from "sonner";
import useSearch from "@/hooks/use-search";

type Props = {
  appointments: {
    id: string;
    date: Date;
    slot: string;
    email: string;
    domainId: string | null;
    createdAt: Date;
    Customer: {
      Domain: {
        name: string;
      } | null;
    } | null;
  }[];
};

type FilterType = "today" | "past" | "future" | "all";

const AppointmentsTable = ({ appointments }: Props) => {
  const [filter, setFilter] = useState<Props["appointments"] | []>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const { onChangeValue } = useSearch({ duration: 500, query: "search" });

  const {
    mutate: deleteAppointmentsMutate,
    isPending: deleteAppointmentsLoading,
  } = useMutation({
    mutationFn: deleteManyAppointmentAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data?.status === 200) {
        router.refresh();
        setOpenAlert(false);
        setSelectedIds([]);
        toast.success("Success");
      }
    },
    retry: 3,
  });

  const deleteAppointments = () => {
    if (!selectedIds.length) return;
    deleteAppointmentsMutate(selectedIds);
  };

  const addAllIds = (e: boolean) => {
    if (e === true) return setSelectedIds(filter.map((e) => e.id));
    if (e === false) return setSelectedIds([]);
  };

  const addId = (id: string) => {
    if (selectedIds.some((e) => e === id))
      return setSelectedIds((prev) => prev.filter((e) => e !== id));
    setSelectedIds((prev) => [...prev, id]);
  };

  const filterSearch = (email: string) => {
    if (!email) return setFilter(appointments);
    setFilter(appointments.filter((e) => e.email.startsWith(email)));
  };

  useEffect(() => {
    if (!appointments.length) return setFilter([]);
    const search = searchParams.get("search");
    filterSearch(search || "");
  }, [appointments]);

  const filterByFilterSelection = useCallback(
    (selected_filter: FilterType) => {
      if (selected_filter === "all" && appointments.length)
        return setFilter(appointments);
      if (selected_filter === "future" && appointments.length)
        return setFilter(appointments.filter((e) => isFuture(e.date)));
      if (selected_filter === "today" && appointments.length)
        return setFilter(appointments.filter((e) => isToday(e.date)));
      if (selected_filter === "past" && appointments.length)
        return setFilter(
          appointments.filter((e) => isPast(e.date) && !isToday(e.date))
        );
    },
    [appointments]
  );

  return (
    <div className="w-full flex flex-col gap-3 max-h-[500px]">
      <div className="flex w-full gap-20 justify-between">
        <div className="flex gap-5 items-center flex-1">
          {!!selectedIds.length && (
            <CustomAlertDialog
              open={openAlert}
              onOpenChange={setOpenAlert}
              header="Are you sure?"
              description="Appointments will permanently delete forever."
              content={
                <ButtonWithLoaderAndProgress
                  variant={"destructive"}
                  loading={deleteAppointmentsLoading}
                  disabled={deleteAppointmentsLoading}
                  onClick={deleteAppointments}
                >
                  Delete
                </ButtonWithLoaderAndProgress>
              }
            >
              <Button
                onClick={() => setOpenAlert(true)}
                className="flex items-center gap-1"
                size={"icon"}
              >
                <Trash2Icon size={22} strokeWidth={1.4} />
              </Button>
            </CustomAlertDialog>
          )}
          <Select
            onValueChange={(e: FilterType) => filterByFilterSelection(e)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All appointments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All appointments</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="future">Future</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="rounded-lg px-2 border w-full max-w-sm flex items-center">
            <SearchIcon size={22} strokeWidth={1.4} />
            <Input
              onChange={onChangeValue}
              defaultValue={searchParams.get("search") || ""}
              placeholder="Search for email..."
              className="max-w-sm border-none outline-none ring-0 focus-visible:ring-0"
            />
          </div>
        </div>
        <div></div>
      </div>
      <DataTable
        headers={[
          <div className="w-full h-full flex items-center">
            <Checkbox
              checked={
                filter.length == 0
                  ? false
                  : filter.length === selectedIds.length
              }
              onCheckedChange={addAllIds}
              className={cn(
                "data-[state=checked]:bg-orange border-black !text-black"
              )}
            />
          </div>,
          "Name",
          "Requested Time",
          "Booked Time",
          "Domain",
          "Status",
        ]}
      >
        {!!filter.length &&
          filter.map((e) => {
            return (
              <TableRow key={e.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={() => addId(e.id)}
                    defaultChecked={selectedIds.some((i) => i === e.id)}
                    checked={selectedIds.some((i) => i === e.id)}
                    className={cn(
                      "data-[state=checked]:bg-orange !text-black",
                      {
                        "border-black": selectedIds.some((i) => i === e.id),
                      }
                    )}
                  />
                </TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell className="text-sm flex gap-2 w-[180px]">
                  <div>{fDate(new Date(e.date))}</div>
                  <div className="uppercase">{e.slot}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm w-[130px]">
                    {fDateTime(new Date(e.createdAt))}
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  {e.Customer?.Domain?.name}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      isToday(e.date)
                        ? "default"
                        : isPast(e.date)
                        ? "destructive"
                        : "default"
                    }
                    className={cn({
                      "dark:bg-green-400 bg-green-500 hover:bg-green-600 dark:hover:bg-green-500":
                        isToday(e.date),
                    })}
                  >
                    {isToday(e.date)
                      ? "Today"
                      : isPast(e.date)
                      ? "Past"
                      : "Future"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
      </DataTable>
      {!filter.length && (
        <CardDescription className="w-full text-center">
          No Appointments
        </CardDescription>
      )}
    </div>
  );
};

export default AppointmentsTable;
