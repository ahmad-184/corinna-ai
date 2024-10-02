import { validateUser } from "@/actions/auth";
import InfoBar from "@/components/info-bar";
import PageWrapper from "@/components/page-wrapper";

export const revalidate = 60;

type Props = {};

const Page = async (props: Props) => {
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
