import { Spinner } from "@/components/spinner";
import DataTable from "@/components/table/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { fDateTimeP } from "@/lib/format-time";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  products: Product[];
  filter_type: "all" | "live" | "deactivated";
  isFetching: boolean;
};

const ProductsTable = ({ products, filter_type, isFetching }: Props) => {
  const [filteredProducts, setFilteredProducts] = useState<Props["products"]>(
    []
  );

  useEffect(() => {
    if (!products.length) return;
    if (filter_type === "all") setFilteredProducts(products);
    if (filter_type === "live") setFilteredProducts(products);
    if (filter_type === "deactivated") setFilteredProducts(products);
  }, [products, filter_type]);

  if (isFetching)
    return (
      <div className="w-full flex justify-center py-4">
        <Spinner noPadding />
      </div>
    );

  if (!products.length)
    return (
      <div className="w-full py-4 text-center text-muted-foreground">
        <p>No Products</p>
      </div>
    );

  return (
    <DataTable headers={["Featured Image", "Name", "Pricing", "Created"]}>
      {products.map((e, i) => (
        <TableRow key={e.id}>
          <TableCell>
            <Image
              className="w-12 h-12 object-cover rounded-md"
              width={40}
              height={40}
              src={e.image}
              alt={e.name}
            />
          </TableCell>
          <TableCell>{e.name}</TableCell>
          <TableCell>${e.price}</TableCell>
          <TableCell className="text-right">
            {fDateTimeP(e.createdAt)}
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
};

export default ProductsTable;
