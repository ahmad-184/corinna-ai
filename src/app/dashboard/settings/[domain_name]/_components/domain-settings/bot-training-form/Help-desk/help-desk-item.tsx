import { deleteHelpDeskQuestionAction } from "@/actions/domain";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpDesk } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

type Props = {
  index: number;
  refetchData: () => void;
  item: Omit<HelpDesk, "domainId">;
};

const HelpDeskItem = ({ index, item, refetchData }: Props) => {
  const { mutate: deleteHelpdesk, isPending: deleteHelpdeskLoading } =
    useMutation({
      mutationFn: deleteHelpDeskQuestionAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          refetchData();
        }
      },
      retry: 3,
    });

  const onDeleteHelpdesk = (id: string) => {
    deleteHelpdesk({ id });
  };

  return (
    <>
      <div className="flex items-center gap-7">
        <AccordionItem className="flex-1" value={`item-${index}`} key={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
        <ButtonWithLoaderAndProgress
          size={"icon"}
          loading={deleteHelpdeskLoading}
          disabled={deleteHelpdeskLoading}
          variant={"ghost"}
          className="h-fit w-fit p-1"
          onClick={() => onDeleteHelpdesk(item.id)}
        >
          <TrashIcon size={20} />
        </ButtonWithLoaderAndProgress>
      </div>
    </>
  );
};

export default HelpDeskItem;
