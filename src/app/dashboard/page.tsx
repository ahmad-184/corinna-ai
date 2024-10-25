import { validateUser } from "@/actions/auth";
import InfoBar from "@/components/info-bar";
import PageWrapper from "@/components/page-wrapper";
import Dashboard from "./_components/dashboard";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

export const revalidate = 60;

type Props = {};

const Page = async ({}: Props) => {
  const user = await validateUser();

  return (
    <>
      <InfoBar user={user} />
      <PageWrapper className="gap-16">
        <Suspense
          fallback={
            <div className="w-full h-[250px] flex items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <Dashboard />
        </Suspense>
      </PageWrapper>
    </>
  );
};

export default Page;
