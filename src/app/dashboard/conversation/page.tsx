import { validateUser } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import InfoBar from "@/components/info-bar";

export const revalidate = 60;

const Page = async () => {
  const user = await validateUser();

  return (
    <>
      <InfoBar user={user} />
      <PageWrapper className="gap-16">
        <></>
      </PageWrapper>
    </>
  );
};

export default Page;
