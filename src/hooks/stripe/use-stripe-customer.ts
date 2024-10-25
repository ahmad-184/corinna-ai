import { createCustomerPaymentIntentSecretAction } from "@/actions/stripe";
import { useQuery } from "@tanstack/react-query";

type Props = {
  stripeId: string;
  amount: number;
  enabled: boolean;
};

const useStripeCustomer = ({ amount, stripeId, enabled }: Props) => {
  const { data, isLoading } = useQuery({
    queryFn: () =>
      createCustomerPaymentIntentSecretAction({ amount, stripeId }),
    queryKey: [],
    enabled: enabled,
  });

  return {
    secret: data?.data?.secret || "",
    loading: isLoading,
  };
};

export default useStripeCustomer;
