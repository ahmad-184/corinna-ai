import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Props = {
  headers: (string | React.ReactNode)[];
  children: React.ReactNode;
  header_classname?: string;
};

const DataTable = ({ headers, children, header_classname }: Props) => {
  return (
    <Table className="rounded-t-xl overflow-hidden">
      <TableHeader className={cn("bg-orange", header_classname)}>
        <TableRow>
          {headers.map((e, i) => (
            <TableHead
              key={i}
              className={cn(
                "!text-black",
                i + 1 === headers.length && "text-right"
              )}
            >
              {e}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="bg-zinc-50 dark:bg-zinc-800/45">
        {children}
      </TableBody>
    </Table>
  );
};
export default DataTable;
