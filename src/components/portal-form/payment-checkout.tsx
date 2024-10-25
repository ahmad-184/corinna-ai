import useStripeCustomer from "@/hooks/stripe/use-stripe-customer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Loader } from "../loader";
import { Card } from "../ui/card";
import Image from "next/image";
import CustomerPaymentForm from "./customer-payment-form";
import ButtonWithLoaderAndProgress from "../button-with-loader-and-progress-bar";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { createTransactionAction } from "@/actions/product";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type Props = {
  products: { name: string; image: string; price: number }[];
  stripeId: string;
  email: string;
  amount: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  isQuestions?: boolean;
  customer_id: string;
  domain_id: string;
};

const PaymentCheckout = ({
  amount,
  email,
  onNextStep,
  onPrevStep,
  products,
  stripeId,
  isQuestions,
  customer_id,
  domain_id,
}: Props) => {
  const { loading, secret } = useStripeCustomer({
    amount,
    stripeId,
    enabled: !!products.length && !!stripeId && !!email,
  });

  const StripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    {
      stripeAccount: stripeId,
    }
  );

  const { mutate: createTransaction, isPending: createTransactionLoading } =
    useMutation({
      mutationFn: createTransactionAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          toast.success("Success");
          onNextStep();
        }
      },
    });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!customer_id || !customer_id) return;
    createTransaction({ customer_id, domain_id, price: amount });
  };

  return (
    <Loader loading={loading}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5 justify-center">
        <div className="pb-4">
          <h1 className="font-bold text-4xl text-center">Payment</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="col-span-1 border-r-2 pr-5 flex gap-3 flex-col">
            <h2 className="text-3xl font-bold mb-2 text-orange">${amount}</h2>
            {products.map((e, i) => (
              <Card
                key={e.name + i}
                className="w-full flex gap-2 p-3 min-w-[300px]"
              >
                <div className="w-2/12 aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={e.image}
                    alt={e.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex justify-between">
                  <p className=" font-semibold text-muted-foreground">
                    {e.name}
                  </p>
                  <p className="text-xl font-bold">${e.price}</p>
                </div>
              </Card>
            ))}
            {!products.length ? (
              <div className="w-full">
                <p className="text-center text-muted-foreground">No products</p>
              </div>
            ) : null}
          </div>
          <div className="col-span-1 pl-5">
            {secret && StripePromise && (
              <>
                <h3 className="text-sm mb-3 text-muted-foreground dark:text-orange">
                  No need to fill form.
                </h3>
                <Elements
                  stripe={StripePromise}
                  options={{
                    clientSecret: secret,
                  }}
                >
                  <CustomerPaymentForm onNextStep={onNextStep} />
                </Elements>
              </>
            )}
          </div>
        </div>
        <div className="max-w-[400px] mx-auto flex mt-5 items-center justify-center gap-4">
          {!!isQuestions && (
            <Button variant={"outline"} onClick={onPrevStep}>
              Edit Questions?
            </Button>
          )}
          {!!products.length && (
            <ButtonWithLoaderAndProgress
              loading={createTransactionLoading}
              disabled={createTransactionLoading}
              type="submit"
              className="min-w-[200px]"
            >
              Pay
            </ButtonWithLoaderAndProgress>
          )}
        </div>
      </form>
    </Loader>
  );
};

export default PaymentCheckout;
