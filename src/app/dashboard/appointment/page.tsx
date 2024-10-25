import { validateUser } from "@/actions/auth";
import InfoBar from "@/components/info-bar";
import PageWrapper from "@/components/page-wrapper";
import AllAppointments from "./_components/all-appointments";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

export const revalidate = 60;

const Page = async () => {
  const user = await validateUser();

  return (
    <>
      <InfoBar user={user} />
      <PageWrapper>
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center h-[400px]">
              <Spinner />
            </div>
          }
        >
          <AllAppointments userId={user.id} />
        </Suspense>
      </PageWrapper>
    </>
  );
};

export default Page;
