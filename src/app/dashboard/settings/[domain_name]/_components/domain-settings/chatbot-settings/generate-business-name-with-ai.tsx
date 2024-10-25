"use client";

import { generateBusinessNameSuggestion } from "@/actions/chat-bot";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import CustomTooltip from "@/components/custom/custom-tooltip";
import FormGeneration from "@/components/form-generation";
import { buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateBusinessNameWithAiFormSchema } from "@/zod/domain";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ClipboardIcon, SparklesIcon, WandSparklesIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  setSuggestedName: (e: string) => void;
};

const GenerateBusinessNameSuggestionsWithAI = ({ setSuggestedName }: Props) => {
  const [parent] = useAutoAnimate();

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const form = useForm({
    defaultValues: {
      input: "",
    },
    resolver: zodResolver(generateBusinessNameWithAiFormSchema),
    mode: "onChange",
  });

  const { handleSubmit, control } = form;

  const { mutate: generate, isPending: generatePending } = useMutation({
    mutationFn: generateBusinessNameSuggestion,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        setSuggestions(e.data);
      }
    },
    retry: 3,
  });

  const onSubmit = handleSubmit((values) => {
    generate({ ...values });
  });

  const isLoading = useMemo(() => {
    if (generatePending) return true;
    else return false;
  }, [generatePending]);

  return (
    <Popover>
      <CustomTooltip content={"Generate with AI "}>
        <PopoverTrigger type="button" asChild>
          <div className={buttonVariants({ variant: "default", size: "icon" })}>
            <WandSparklesIcon size={22} strokeWidth={1.4} />
          </div>
        </PopoverTrigger>
      </CustomTooltip>
      <PopoverContent className="w-[360px]">
        <div className="w-full">
          <Form {...form}>
            <form
              id="generate-form"
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onSubmit(e);
              }}
              className="w-full flex flex-col gap-3"
            >
              <div className="w-full flex flex-col">
                <h3 className="text-lg font-semibold flex items-center gap-1">
                  AI suggestion
                </h3>
                <p className="text-muted-foreground text-sm">
                  Give an explanation about your company or business
                </p>
                <FormGeneration
                  type="text"
                  inputType="textarea"
                  control={control}
                  id="1"
                  disabled={isLoading}
                  name="input"
                  placeholder="Type here..."
                  description=""
                  rows={4}
                />
              </div>
              <div ref={parent}>
                {!!suggestions.length && !generatePending && (
                  <div className="w-full flex flex-col gap-2 text-sm mb-2">
                    {suggestions.map((e, i) => (
                      <div
                        className="w-full p-y-1 cursor-pointer group flex gap-5 justify-between items-center"
                        onClick={() => {
                          window.navigator.clipboard.writeText(e);
                          toast.success("Copied and replaced", {
                            duration: 2000,
                          });
                          setSuggestedName(e);
                        }}
                      >
                        <p className="text-sm">{e}</p>
                        <ClipboardIcon
                          size={15}
                          className="text-muted-foreground invisible group-hover:visible"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <ButtonWithLoaderAndProgress
                loading={isLoading}
                disabled={isLoading}
                className="font-medium flex gap-1 items-center"
                form="generate-form"
              >
                <SparklesIcon size={17} strokeWidth={1.4} />
                Generate
              </ButtonWithLoaderAndProgress>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GenerateBusinessNameSuggestionsWithAI;
