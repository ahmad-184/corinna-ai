"use client";

import { createProductAction } from "@/actions/product";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import UploadImage from "@/components/dropzone/upload-image";
import FormGeneration from "@/components/form-generation";
import Section from "@/components/section";
import { Form } from "@/components/ui/form";
import { createProductFormSchemaType } from "@/types";
import { createProductFormSchema } from "@/zod/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = { domain_id: string; refetchProducts: () => void };

const CreateProductForm = ({ domain_id, refetchProducts }: Props) => {
  const router = useRouter();
  const form = useForm<createProductFormSchemaType>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      image: "",
      name: "",
      price: "",
      domain_id,
    },
  });
  const { control, handleSubmit, setValue } = form;
  setValue("domain_id", domain_id);

  const { mutate: createProductMutate, isPending: createProductLoading } =
    useMutation({
      mutationFn: createProductAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          router.refresh();
          toast.success("Success");
          refetchProducts();
        }
      },
      retry: 3,
    });

  const onCreate = handleSubmit((values) => {
    createProductMutate({ ...values });
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onCreate}
        id="product-form"
        className="mt-3 w-full flex flex-col gap-4 py-10"
      >
        <FormGeneration
          id="name-1"
          inputType="input"
          control={control}
          name="name"
          placeholder="Your product name"
          type="text"
          label="Name"
          disabled={createProductLoading}
        />
        <div className="flex w-full justify-start gap-9">
          <UploadImage
            className="w-[80px] h-[80px]"
            getValue={(e) => setValue("image", e)}
          />
          <Section
            label="Product picture"
            message="Choose a picture of your product to show the customer."
          />
        </div>
        <FormGeneration
          id="price-2"
          inputType="input"
          control={control}
          name="price"
          placeholder="0.00"
          type="text"
          label="Price"
          disabled={createProductLoading}
        />
        <ButtonWithLoaderAndProgress
          form="product-form"
          loading={createProductLoading}
          disabled={createProductLoading}
        >
          Add Product
        </ButtonWithLoaderAndProgress>
      </form>
    </Form>
  );
};
export default CreateProductForm;
