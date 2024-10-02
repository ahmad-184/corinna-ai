"use client";

import { useSidebar } from "@/contexts/use-sidebar-context";
import useDomain from "@/hooks/domain/use-domain";
import { cn } from "@/lib/utils";
import CustomDrawer from "../custom/custom-drawer";
import { PlusIcon, TrashIcon } from "lucide-react";
import FormGeneration from "../form-generation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import ButtonWithLoaderAndProgress from "../button-with-loader-and-progress-bar";
import Link from "next/link";
import Image from "next/image";
import CustomTooltip from "../custom/custom-tooltip";
import UploadButton from "../dropzone/upload-button";
import { Button } from "../ui/button";

type Props = {
  domains:
    | {
        name: string;
        id: string;
        icon: string;
        customer: {
          chatRoom: {
            id: string;
            live: boolean;
          }[];
        }[];
      }[]
    | null
    | undefined;
};
const DomainMenu = ({ domains }: Props) => {
  const { form, loading, onCreateDomain } = useDomain();
  const { expand, page } = useSidebar();

  const { setValue, watch } = form;
  const image = watch().image;

  return (
    <div
      className={cn("w-full flex flex-col gap-3 justify-center mt-1", {
        "!justify-start mt-3": expand,
      })}
    >
      <div
        className={cn("flex w-full justify-between items-center", {
          "!justify-center": !expand,
        })}
      >
        {!!expand && (
          <p className="text-xs text-gray-500 fill-mode-forwards animate-fade-in opacity-0 delay-200">
            DOMAINS
          </p>
        )}
        <CustomDrawer
          title="Add your business domain"
          description="add in your domain address to integrate your chatbot"
          content={
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onCreateDomain)}
                className="flex w-full flex-col gap-3 max-w-md"
              >
                <FormGeneration
                  control={form.control}
                  disabled={loading}
                  name="name"
                  type="text"
                  label="Domain"
                  placeholder="mydomain.com"
                  inputType="input"
                  id="1"
                />
                <FormField
                  disabled={loading}
                  control={form.control}
                  name={"image"}
                  render={({ field }) => (
                    <FormItem>
                      <div className="w-full flex gap-4 items-center">
                        <FormControl>
                          <UploadButton
                            getValue={(url) => setValue("image", url)}
                            maxSize={1}
                            max_file={1}
                            value={field.value}
                          />
                        </FormControl>
                        {!!image && (
                          <Button
                            size={"icon"}
                            variant={"secondary"}
                            onClick={() => setValue("image", "")}
                          >
                            <TrashIcon />
                          </Button>
                        )}
                      </div>
                      <FormDescription className="text-xs text-muted-foreground my-0">
                        * Only JPG, JPEG, SVG & PNG are accepted file formats,
                        Size less than 1mb
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ButtonWithLoaderAndProgress
                  disabled={loading}
                  loading={loading}
                >
                  Add Domain
                </ButtonWithLoaderAndProgress>
              </form>
            </Form>
          }
        >
          <CustomTooltip asChild content="Add Domain" side="right">
            <div className="cursor-pointer flex justify-center p-[2px] text-gray-500 rounded-full border-2">
              <PlusIcon size={expand ? 19 : 23} />
            </div>
          </CustomTooltip>
        </CustomDrawer>
      </div>
      <div className="flex flex-col gap-2 text-iridium dark:text-zinc-300 font-medium">
        {!!domains?.length &&
          domains.map((e) => (
            <CustomTooltip
              key={e.name}
              content={e.name}
              side="right"
              showTooltip={!expand}
            >
              <Link
                href={`/dashboard/settings/${e.name.split(".")[0]}`}
                className={cn(
                  "flex truncate gap-3 items-center py-2 px-1 hover:bg-white dark:hover:bg-zinc-950 rounded-lg transition-all duration-100 ease-in-out cursor-pointer",
                  {
                    "!justify-center": !expand,
                    "!bg-white dark:!bg-zinc-950 font-bold":
                      e.name.split(".")[0] === page?.split("/")[3],
                  }
                )}
              >
                <Image
                  src={e.icon || "/images/domain.png"}
                  alt={`${e.name} logo`}
                  width={30}
                  height={30}
                  className={cn("rounded-sm object-cover w-[25px] h-[25px]")}
                />
                {!!expand && <p className="text-sm truncate">{e.name}</p>}
              </Link>
            </CustomTooltip>
          ))}
      </div>
    </div>
  );
};
export default DomainMenu;
