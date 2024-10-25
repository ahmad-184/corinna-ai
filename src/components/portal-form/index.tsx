"use client";

import { CustomerResponses } from "@prisma/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import CutsomerQuestionsForm from "./customer-questions-form";
import BookAppointmentForm from "./book-appointment-form";
import ThankYou from "./thank-you";
import PaymentCheckout from "./payment-checkout";
import { PortalFormType } from "@/types";

type Props = {
  questions?:
    | Omit<CustomerResponses, "createdAt" | "updatedAt" | "customerId">[]
    | null
    | undefined;
  type: PortalFormType;
  customer_id: string;
  domain_id: string;
  email: string;
  bookings?: { date: Date; slot: string }[] | null | undefined;
  products?: { name: string; image: string; price: number }[] | undefined;
  amount?: number;
  stripe_id: string;
};

const PortalForm = ({
  customer_id,
  domain_id,
  email,
  questions,
  stripe_id,
  type,
  amount,
  bookings,
  products,
}: Props) => {
  const [step, setStep] = useState<number | undefined>(undefined);

  const onNextStep = () => {
    setStep(step !== undefined ? step + 1 : undefined);
  };
  const onPrevStep = () => {
    setStep(step !== undefined ? step - 1 : undefined);
  };

  useEffect(() => {
    if (questions?.length && questions.some((e) => !e.answered))
      return setStep(1);
    else setStep(2);
  }, [questions]);

  return (
    <div className="h-full flex flex-col gap-10 justify-center items-center">
      {step === 1 && !!questions?.length ? (
        <CutsomerQuestionsForm
          questions={questions || []}
          onNextStep={onNextStep}
        />
      ) : null}
      {step === 2 && type === "Appointment" ? (
        <BookAppointmentForm
          customer_id={customer_id}
          domain_id={domain_id}
          email={email}
          onNextStep={onNextStep}
          onPrevStep={onPrevStep}
          bookings={bookings}
          isQuestions={!!questions?.length}
        />
      ) : null}
      {step === 3 && <ThankYou />}
      {step === 2 && type === "Payment" ? (
        <PaymentCheckout
          customer_id={customer_id}
          domain_id={domain_id}
          products={products || []}
          stripeId={stripe_id}
          email={email}
          amount={amount || 0}
          onNextStep={onNextStep}
          onPrevStep={onPrevStep}
          isQuestions={!!questions?.length}
        />
      ) : null}
      {step !== 1 && step !== 2 ? null : (
        <div className={cn("w-full flex justify-center pb-3", {})}>
          <div className="w-[400px] grid grid-cols-2 gap-3">
            <div
              className={cn("bg-platinum rounded-full h-2 col-span-1", {
                "bg-orange": step == 1,
              })}
            />
            <div
              className={cn("bg-platinum rounded-full h-2 col-span-1", {
                "bg-orange": step == 2,
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalForm;
