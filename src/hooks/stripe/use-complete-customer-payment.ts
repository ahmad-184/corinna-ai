"use client";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onNext: () => void;
};

const useCompleteCustomerPayment = ({ onNext }: Props) => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const onMakePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setLoading(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/",
        },
        redirect: "if_required",
      });

      if (error) return toast.error("Failed to complete payment");

      if (paymentIntent) {
        toast.success("Payment completed");
        onNext();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to complete payment");
    } finally {
      setLoading(false);
    }
  };

  return {
    onMakePayment,
    loading,
  };
};

export default useCompleteCustomerPayment;
