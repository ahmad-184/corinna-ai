import { CustomerResponses } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import FormGeneration from "../form-generation";
import ButtonWithLoaderAndProgress from "../button-with-loader-and-progress-bar";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateCustomerResponsesAction } from "@/actions/customer";
import { toast } from "sonner";

type Props = {
  questions: Omit<
    CustomerResponses,
    "createdAt" | "updatedAt" | "customerId"
  >[];
  onNextStep: () => void;
};

const CutsomerQuestionsForm = ({ questions, onNextStep }: Props) => {
  const form = useForm<{ [k: string]: string | null }>({
    defaultValues: {},
  });
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    let q: { [id: string]: string | null } = {};
    questions.forEach((e) => {
      q[e.id] = e.answered;
    });
    reset({ ...q });
  }, [questions]);

  const {
    mutate: saveQuestionResponses,
    isPending: saveQuestionResponsesLoading,
  } = useMutation({
    mutationFn: updateCustomerResponsesAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data && e.data.status === 200) {
        onNextStep();
      }
    },
  });

  const onSaveQuestionResponses = handleSubmit((values) => {
    saveQuestionResponses({ questions: values });
  });

  return (
    <div className="w-full max-w-[400px]">
      <Form {...form}>
        <form
          className="w-full flex flex-col gap-4"
          id="questions-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSaveQuestionResponses(e);
          }}
        >
          <div className="w-full">
            <h3 className="font-bold text-xl dark:text-orange">
              Dear Customer
            </h3>
            <p className="text-muted-foreground text-sm">
              Before continuing, we would appreciate it if you could answer a
              few questions. We can use your answers to improve our service.
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            {questions.map((e) => (
              <FormGeneration
                type="text"
                inputType="input"
                control={control}
                id={e.id}
                disabled={false}
                name={e.id}
                form="questions-form"
                label={e.question}
                placeholder="..."
                key={e.id}
                input_classname="dark:text-orange"
              />
            ))}
          </div>
          <ButtonWithLoaderAndProgress
            loading={saveQuestionResponsesLoading}
            disabled={saveQuestionResponsesLoading}
            type="submit"
            form="questions-form"
          >
            Next
          </ButtonWithLoaderAndProgress>
        </form>
      </Form>
    </div>
  );
};

export default CutsomerQuestionsForm;
