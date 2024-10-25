import { Plans } from "@prisma/client";

type Props = {
  customers: {
    id: string;
    email: string | null;
    Domain: {
      name: string;
    } | null;
  }[];
  subscription: {
    plan: Plans;
    credits: number;
  } | null;
  campaigns: {
    id: string;
    createdAt: Date;
    name: string;
    customers: string[];
  }[];
};

const useEmailMarketing = ({ campaigns, customers, subscription }: Props) => {
  return {};
};

export default useEmailMarketing;
