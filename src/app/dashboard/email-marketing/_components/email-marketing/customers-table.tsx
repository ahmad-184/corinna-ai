import DataTable from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
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
import useSearch from "@/hooks/use-search";
import { SearchIcon } from "lucide-react";
import CustomerAnswers from "./customer-answers";
import { cn } from "@/lib/utils";

type Props = {
  customers: {
    id: string;
    email: string | null;
    Domain: {
      name: string;
    } | null;
  }[];
  selectedIds: string[];
  addId: (ids: string) => void;
  domains: {
    id: string;
    name: string;
  }[];
  filterByFilterSelection: (domain_name: string) => void;
  addAllIds: (e: boolean) => void;
};

const CustomersTable = ({
  customers,
  selectedIds,
  addId,
  domains,
  filterByFilterSelection,
  addAllIds,
}: Props) => {
  const { onChangeValue, value } = useSearch({
    duration: 500,
    query: "search",
  });

  return (
    <div className="w-full flex flex-col max-h-[500px]">
      <div className="w-full flex gap-3 mb-3">
        <Select
          onValueChange={(e) => filterByFilterSelection(e)}
          defaultValue="all"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All domains" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All domains</SelectItem>
              {domains.map((e) => (
                <SelectItem key={e.id} value={e.name}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="rounded-lg px-2 border w-full max-w-sm flex items-center">
          <SearchIcon size={22} strokeWidth={1.4} />
          <Input
            onChange={onChangeValue}
            defaultValue={value || ""}
            placeholder="Search for email..."
            className="max-w-sm border-none outline-none ring-0 focus-visible:ring-0"
          />
        </div>
      </div>
      <DataTable
        headers={[
          <div className="w-full h-full flex items-center">
            <Checkbox
              checked={
                customers.length == 0
                  ? false
                  : customers.length === selectedIds.length
              }
              onCheckedChange={addAllIds}
              className={cn(
                "data-[state=checked]:bg-orange border-black !text-black"
              )}
            />
          </div>,
          "Email",
          "Answers",
          "Domain",
        ]}
      >
        {!!customers.length &&
          customers.map((e) => {
            return (
              <TableRow key={e.id}>
                <TableCell>
                  <Checkbox
                    defaultChecked={selectedIds.some((i) => i === e.id)}
                    checked={selectedIds.some((i) => i === e.id)}
                    onCheckedChange={() => addId(e.id)}
                    className={cn(
                      "data-[state=checked]:bg-orange !text-black",
                      {
                        "border-black": selectedIds.some((i) => i === e.id),
                      }
                    )}
                  />
                </TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>
                  <CustomerAnswers customerId={e.id} />
                </TableCell>
                <TableCell className="text-right">{e.Domain?.name}</TableCell>
              </TableRow>
            );
          })}
      </DataTable>
      {!customers.length && (
        <CardDescription className="w-full text-center py-3 bg-zinc-50 dark:bg-zinc-800/45">
          No Customers
        </CardDescription>
      )}
    </div>
  );
};

export default CustomersTable;
