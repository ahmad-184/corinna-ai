import { validateUser } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import InfoBar from "@/components/info-bar";
import EmailMarketingWrapper from "./_components/email-marketing-wrapper";

export const revalidate = 60;

const Page = async () => {
  const user = await validateUser();

  return (
    <>
      <InfoBar user={user} />
      <PageWrapper className="gap-16">
        <Suspense
          fallback={
            <div className="w-full h-[280px] flex items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <EmailMarketingWrapper userId={user.id} />
        </Suspense>
      </PageWrapper>
    </>
  );
};

export default Page;
