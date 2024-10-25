import { PaymentElement } from "@stripe/react-stripe-js";
// import ButtonWithLoaderAndProgress from "../button-with-loader-and-progress-bar";
// import useCompleteCustomerPayment from "@/hooks/stripe/use-complete-customer-payment";

type Props = {
  onNextStep: () => void;
};

const CustomerPaymentForm = ({ onNextStep }: Props) => {
  // const { loading, onMakePayment } = useCompleteCustomerPayment({
  //   onNext: onNextStep,
  // });

  return (
    <div className="flex flex-col">
      <PaymentElement />
    </div>
  );
};
export default CustomerPaymentForm;
