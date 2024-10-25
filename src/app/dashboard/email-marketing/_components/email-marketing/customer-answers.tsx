"use client";

import { getCustomerQuestionsResponsesAction } from "@/actions/customer";
import CustomSheet from "@/components/custom/custom-sheet";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

type Props = {
  customerId: string;
};

const CustomerAnswers = ({ customerId }: Props) => {
  const { data } = useQuery({
    queryFn: () => getCustomerQuestionsResponsesAction({ customerId }),
    queryKey: [`answer-${customerId}`],
    enabled: !!customerId,
  });

  return (
    <CustomSheet
      title="Answers"
      description="Customer answers are stored by when your customers respond back to the questions that ask in questions form."
      content={
        <div className="flex w-full flex-col gap-3 mt-10">
          {data?.data?.map((e) => (
            <div key={e.id} className="w-full flex flex-col gap-1">
              <p className="text-sm font-semibold">{e.question}</p>
              <p className="text-sm text-muted-foreground dark:text-orange">
                {e.answered}
                {!e.answered && (
                  <span className="!text-muted-foreground">...</span>
                )}
              </p>
            </div>
          ))}
        </div>
      }
    >
      <div className={buttonVariants({ variant: "default" })}>View</div>
    </CustomSheet>
  );
};

export default CustomerAnswers;
