"use client";

import {
  createHelpDeskQuestionAction,
  deleteHelpDeskQuestionAction,
  getAllHelDeskQuestionsAction,
} from "@/actions/domain";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { Loader } from "@/components/loader";
import Section from "@/components/section";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { helpDeskFormSchemaType } from "@/types";
import { helpDeskFormSchema } from "@/zod/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import HelpDeskItem from "./help-desk-item";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

type Props = { domain_id: string };

const HelpDesk = ({ domain_id }: Props) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  const form = useForm<helpDeskFormSchemaType>({
    defaultValues: {
      question: "",
      answer: "",
    },
    resolver: zodResolver(helpDeskFormSchema),
  });

  const { handleSubmit, control, reset } = form;

  const {
    data,
    refetch,
    isLoading: fetchingData,
  } = useQuery({
    queryKey: ["helpdesk-questions"],
    queryFn: () => getAllHelDeskQuestionsAction({ domainId: domain_id }),
    enabled: isIntersecting,
  });

  const { mutate: createHelpdesk, isPending: createHelpdeskLoading } =
    useMutation({
      mutationFn: createHelpDeskQuestionAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          refetch();
          reset();
        }
      },
      retry: 3,
    });

  const onCreateHelpdesk = handleSubmit((values) => {
    createHelpdesk({ ...values, domain_id });
  });

  const isLoading = useMemo(() => {
    if (createHelpdeskLoading) return true;
    else return false;
  }, [createHelpdeskLoading]);

  return (
    <Card className="w-full grid grid-cols-1 lg:grid-cols-2" ref={ref}>
      <CardContent className="p-6 border-r-[1px]">
        <CardTitle>Help Desk</CardTitle>
        <Form {...form}>
          <form
            onSubmit={onCreateHelpdesk}
            className="flex flex-col gap-6 mt-10"
          >
            <div className="flex flex-col gap-1">
              <Section
                label="Question"
                message="Add a question that you believe is frequently asked."
              />
              <FormGeneration
                inputType="input"
                type="text"
                placeholder="Type your question"
                control={control}
                disabled={isLoading}
                name="question"
                id="1"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Section
                label="Answer"
                message="The answer for the question above."
              />
              <FormGeneration
                inputType="textarea"
                placeholder="Type your answer"
                control={control}
                disabled={isLoading}
                name="answer"
                id="2"
                rows={4}
              />
            </div>
            <ButtonWithLoaderAndProgress
              className="bg-orange text-black font-medium h-9 hover:bg-orange/80"
              loading={isLoading}
              disabled={isLoading}
            >
              Create
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </CardContent>
      <CardContent className="p-6 overflow-y-auto">
        <Loader loading={fetchingData}>
          <Accordion defaultValue={"item-0"} type="single" collapsible={true}>
            {!!data?.data?.length &&
              data.data.map((e, i) => (
                <HelpDeskItem
                  key={e.id}
                  item={e}
                  refetchData={refetch}
                  index={i}
                />
              ))}
          </Accordion>
          {!data?.data?.length && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-center text-muted-foreground font-medium">
                No Question to show
              </p>
            </div>
          )}
        </Loader>
      </CardContent>
    </Card>
  );
};

export default HelpDesk;
