import { validateUser } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import BillingSetting from "./_components/billing-setting";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import ThemeModeSetting from "./_components/them-mode-setting";
import ChangePasswordSetting from "./_components/change-password-setting";
import InfoBar from "@/components/info-bar";

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
          <BillingSetting user={user} />
        </Suspense>
        <ThemeModeSetting />
        <ChangePasswordSetting user={user} />
      </PageWrapper>
    </>
  );
};

export default Page;
