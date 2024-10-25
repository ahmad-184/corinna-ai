import { getAllDomainBookingsAction } from "@/actions/appointment";
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
  const allDomainBookings = await getAllDomainBookingsAction({
    domain_id: params.domain_id,
  });

  return (
    <PortalForm
      customer_id={params.customer_id}
      domain_id={params.domain_id}
      email={customerResponses?.data?.email || ""}
      questions={customerResponses.data?.questions || []}
      stripe_id=""
      type="Appointment"
      bookings={allDomainBookings.data}
    />
  );
};

export default Page;
