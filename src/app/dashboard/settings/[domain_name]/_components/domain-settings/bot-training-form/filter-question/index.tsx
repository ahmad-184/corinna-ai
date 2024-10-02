"use client";

import {
  createFilterQuestionAction,
  deleteFilterQuestionAction,
  getAllFilterQuestionsAction,
} from "@/actions/domain";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { Loader } from "@/components/loader";
import Section from "@/components/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { filterQuetionFormSchemaType } from "@/types";
import { filterQuetionFormSchema } from "@/zod/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FilterQuestionItem from "./filter-question-item";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

type Props = { domain_id: string };

const FilterQuestion = ({ domain_id }: Props) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  const form = useForm<filterQuetionFormSchemaType>({
    defaultValues: {
      question: "",
    },
    resolver: zodResolver(filterQuetionFormSchema),
  });

  const { handleSubmit, control, reset } = form;

  const {
    data,
    refetch,
    isLoading: fetchingData,
  } = useQuery({
    queryKey: ["filter-questions"],
    queryFn: () => getAllFilterQuestionsAction({ domainId: domain_id }),
    enabled: isIntersecting,
  });

  const {
    mutate: createFilterQuestion,
    isPending: createFilterQuestionLoading,
  } = useMutation({
    mutationFn: createFilterQuestionAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        refetch();
        reset();
      }
    },
    retry: 3,
  });

  const onCreateFilterQuestion = handleSubmit((values) => {
    if (!domain_id) return;
    createFilterQuestion({ ...values, domainId: domain_id });
  });

  const isLoading = useMemo(() => {
    if (createFilterQuestionLoading) return true;
    else return false;
  }, [createFilterQuestionLoading]);

  return (
    <Card className="w-full grid grid-cols-1 lg:grid-cols-2" ref={ref}>
      <CardContent className="p-6 border-r-[1px]">
        <CardTitle>Questions Bot Should Ask</CardTitle>
        <Form {...form}>
          <form
            onSubmit={onCreateFilterQuestion}
            className="flex flex-col gap-6 mt-10"
          >
            <div className="flex flex-col gap-1">
              <Section
                label="Question"
                message="Add a question that you want your chatbot to ask."
              />
              <FormGeneration
                inputType="input"
                type="text"
                id="1"
                placeholder="Type your question"
                name="question"
                control={control}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Section
                label="Answer to question"
                message="The answer for the question."
              />
              <FormGeneration
                inputType="textarea"
                id="1"
                placeholder="Type your question"
                name="answered"
                control={control}
                disabled={true}
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
          <div className="flex flex-col gap-4 w-full">
            {!!data?.data?.length &&
              data.data.map((e, i) => (
                <FilterQuestionItem
                  key={e.id}
                  index={i}
                  item={e}
                  refetchData={refetch}
                />
              ))}
          </div>
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

export default FilterQuestion;
