"use client";

import { getDomainProductsAction } from "@/actions/product";
import CustomSheet from "@/components/custom/custom-sheet";
import CreateProductForm from "@/components/form/create-product-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import ProductsTable from "./products-table";

type Props = {
  domain_id: string;
};

const Products = ({ domain_id }: Props) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => getDomainProductsAction({ domain_id }),
    queryKey: [`products-${domain_id}`],
    enabled: isIntersecting && domain_id ? true : false,
  });

  return (
    <div className="w-full flex flex-col gap-5" ref={ref}>
      <div className="w-full flex flex-col gap-2">
        <h2 className="font-bold text-2xl">Products</h2>
        <p className="text-sm font-light">
          Add products to your store and set them live to accept payments from
          customers.
        </p>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex gap-3 justify-start h-fit mb-4">
          <TabsTrigger value="all" className="p-2 px-4">
            All products
          </TabsTrigger>
          <TabsTrigger value="live" className="p-2 px-4">
            Live
          </TabsTrigger>
          <TabsTrigger value="deactivated" className="p-2 px-4">
            Deactivated
          </TabsTrigger>
          <div className="flex-1 flex justify-end">
            <CustomSheet
              title="Add a product"
              description="Add products to your store and set them live to accept payments from
          customers."
              content={
                <CreateProductForm
                  domain_id={domain_id}
                  refetchProducts={refetch}
                />
              }
              className="flex items-center gap-2 bg-orange px-4 h-8 text-black font-semibold rounded-lg text-sm"
            >
              <PlusIcon size={20} />
              <p>Add Product</p>
            </CustomSheet>
          </div>
        </TabsList>
        <TabsContent value="all">
          <ProductsTable
            isFetching={isLoading}
            products={data?.data || []}
            filter_type="all"
          />
        </TabsContent>
        <TabsContent value="live">
          <ProductsTable
            products={data?.data || []}
            filter_type="live"
            isFetching={isLoading}
          />
        </TabsContent>
        <TabsContent value="deactivated">
          <ProductsTable
            products={data?.data || []}
            filter_type="deactivated"
            isFetching={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;
