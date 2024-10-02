import { validateUser } from "@/actions/auth";
import InfoBar from "@/components/info-bar";
import PageWrapper from "@/components/page-wrapper";
import { Spinner } from "@/components/spinner";
import { Suspense } from "react";
import DomainSettings from "./_components/domain-settings";

export const revalidate = 60;

type Props = { params: { domain_name: string } };

const Page = async ({ params }: Props) => {
  const user = await validateUser();

  return (
    <>
      <InfoBar user={user} />
      <PageWrapper className="gap-16">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <DomainSettings domain={params.domain_name} />
        </Suspense>
      </PageWrapper>
    </>
  );
};

export default Page;
