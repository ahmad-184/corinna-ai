import { validateUser } from "@/actions/auth";
import { getPaymentConnectedAction } from "@/actions/stripe";
import InfoBar from "@/components/info-bar";
import PageWrapper from "@/components/page-wrapper";
import IntegrationList from "./_components/integration-list";

export const revalidate = 60;

const Page = async () => {
  const user = await validateUser();

  const isSripeConnected = await getPaymentConnectedAction({});

  const connections = {
    stripe: isSripeConnected.data?.stripeId ? true : false,
  };

  return (
    <>
      <InfoBar user={user} />
      <PageWrapper>
        <IntegrationList connections={connections} />
      </PageWrapper>
    </>
  );
};

export default Page;
