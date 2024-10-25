import { db } from "@/lib/db";
import EmailMarketing from "./email-marketing";

type Props = {
  userId: string;
};

const EmailMarketingWrapper = async ({ userId }: Props) => {
  const customers = await db.customer.findMany({
    where: {
      Domain: {
        userId,
      },
    },
    select: {
      id: true,
      email: true,
      Domain: {
        select: { name: true },
      },
    },
  });
  const subscription = await db.billings.findUnique({
    where: { userId },
    select: { plan: true, credits: true, spent_credits: true },
  });
  const campaigns = await db.campaign.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      template: true,
      Customer: {
        select: {
          id: true,
          email: true,
          Domain: {
            select: { name: true },
          },
        },
      },
    },
  });
  const domains = await db.domain.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <EmailMarketing
      data={{
        customers,
        subscription,
        campaigns,
        domains,
      }}
    />
  );
};

export default EmailMarketingWrapper;
