import { getCustomerResponsesAction } from "@/actions/customer";
import PortalForm from "@/components/portal-form";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

type Props = {
  params: {
    domain_id: string;
    customer_id: string;
  };
};

const Page = async ({ params }: Props) => {
  if (!params.customer_id || !params.domain_id) return notFound();
  const customerResponses = await getCustomerResponsesAction({
    customer_id: params.customer_id,
  });

  let totalPrice = 0;
  const connectedAccount = await db.domain.findUnique({
    where: {
      id: params.domain_id,
    },
    select: {
      User: {
        select: { stripeId: true },
      },
    },
  });

  const products = await db.product.findMany({
    where: { domainId: params.domain_id },
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
    },
  });

  for (const p of products) {
    totalPrice = totalPrice + p.price;
  }

  return (
    <PortalForm
      customer_id={params.customer_id}
      domain_id={params.domain_id}
      email={customerResponses?.data?.email || ""}
      stripe_id={connectedAccount?.User?.stripeId || ""}
      type="Payment"
      amount={totalPrice}
      products={products || []}
      questions={customerResponses.data?.questions || []}
    />
  );
};

export default Page;
