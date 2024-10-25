import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type Props = {};

const useStripe = () => {
  const { mutate: onStripeConnect, isPending: onStripeConnectLoading } =
    useMutation({
      mutationFn: () => axios.get("/api/stripe/connect"),
      onSuccess: (e) => {
        if (e) window.location.href = e.data.url;
      },
      onError: (e) => {
        console.log(e);
        toast.error(e.message);
      },
    });

  return { onStripeConnect, onStripeConnectLoading };
};

export default useStripe;
