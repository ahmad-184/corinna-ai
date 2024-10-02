import { deleteFilterQuestionAction } from "@/actions/domain";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import { FilterQuestions } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

type Props = {
  refetchData: () => void;
  index: number;
  item: Omit<FilterQuestions, "domainId">;
};

const FilterQuestionItem = ({ refetchData, index, item }: Props) => {
  const {
    mutate: deleteFilterQuestion,
    isPending: deleteFilterQuestionLoading,
  } = useMutation({
    mutationFn: deleteFilterQuestionAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        refetchData();
      }
    },
    retry: 3,
  });

  const onDeleteFilterQuestion = (id: string) => {
    deleteFilterQuestion({ id });
  };

  return (
    <div className="flex items-center w-full gap-6">
      <p className="text-sm font-medium flex-1">
        {index + 1}: {item.question}
      </p>
      <ButtonWithLoaderAndProgress
        size={"icon"}
        loading={deleteFilterQuestionLoading}
        disabled={deleteFilterQuestionLoading}
        variant={"ghost"}
        className="h-fit w-fit p-1"
        onClick={() => onDeleteFilterQuestion(item.id)}
      >
        <TrashIcon size={20} />
      </ButtonWithLoaderAndProgress>
    </div>
  );
};

export default FilterQuestionItem;
