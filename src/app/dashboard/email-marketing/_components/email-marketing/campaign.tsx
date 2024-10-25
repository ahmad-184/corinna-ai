"use client";

import {
  deleteCampaignAction,
  removeCustomerCampaignAction,
  sendEmailMarketingAction,
} from "@/actions/marketings";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import CustomDialog from "@/components/custom/custom-dialog";
import UpdateEmailTemplateForm from "@/components/form/update-email-template";
import DataTable from "@/components/table/data-table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import CalIcon from "@/icons/cal-icon";
import EmailIcon from "@/icons/email-icon";
import PersonIcon from "@/icons/person-icon";
import { fDate } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { EllipsisIcon, Trash, Trash2Icon, TypeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  data: {
    id: string;
    createdAt: Date;
    name: string;
    template: string | null;
    Customer: {
      id: string;
      email: string | null;
      Domain: {
        name: string;
      } | null;
    }[];
  };
  activeSelection: boolean;
  selectedCampaign: string;
};

const Campaign = ({ data, activeSelection, selectedCampaign }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<
    Props["data"]["Customer"]
  >(data.Customer);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const router = useRouter();

  const { mutate: sendEmailMarketing, isPending: sendEmailMarketingLoading } =
    useMutation({
      mutationFn: sendEmailMarketingAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data && e.data.status === 200) {
          router.refresh();
          toast.success("Success");
        }
      },
    });

  const onSendEmailMarketing = () => {
    if (!data.id || !data.Customer.length) return;
    sendEmailMarketing({ campaignId: data.id });
  };

  const {
    mutate: removeCustomerCampaign,
    isPending: removeCustomerCampaignLoading,
  } = useMutation({
    mutationFn: removeCustomerCampaignAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data && e.data.status === 200) {
        router.refresh();
        toast.success("Success");
        setSelectedIds([]);
      }
    },
  });

  const { mutate: deleteCampaign, isPending: deleteCampaignLoading } =
    useMutation({
      mutationFn: deleteCampaignAction,
      onSuccess: (e) => {
        if (e.error) toast.error("Error", { description: e.error });
        if (e.data) {
          router.refresh();
          toast.success("Success");
          setSelectedIds([]);
        }
      },
    });

  const onRemoveCustomersCampaign = () => {
    if (!selectedIds.length) return;
    removeCustomerCampaign({
      campaignId: data.id,
      customers: selectedIds,
    });
  };

  const onRemoveAllCustomersCampaign = () => {
    removeCustomerCampaign({
      campaignId: data.id,
      customers: data.Customer.map((e) => e.id),
    });
  };

  const onDeleteCampaign = () => {
    deleteCampaign({
      campaign_id: data.id,
    });
  };

  const debouncedSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const filtered = data.Customer.filter((e) =>
        e.email?.startsWith(event.target.value)
      );
      setFilteredCustomers(filtered);
      setSearchQuery(event.target.value);
    },
    500
  );

  const addAllIds = (e: boolean) => {
    if (e === true) return setSelectedIds(data.Customer.map((e) => e.id));
    if (e === false) return setSelectedIds([]);
  };
  const addId = (id: string) => {
    if (selectedIds.some((e) => e === id))
      return setSelectedIds((prev) => prev.filter((e) => e !== id));
    setSelectedIds((prev) => [...prev, id]);
  };

  useEffect(() => {
    if (searchQuery)
      return setFilteredCustomers(
        data.Customer.filter((e) => e.email?.startsWith(searchQuery))
      );
    setFilteredCustomers(data.Customer);
  }, [data.Customer]);

  return (
    <Label htmlFor={data.id}>
      <Card
        className={cn({
          "cursor-pointer": activeSelection,
          "ring-1 dark:ring-zinc-300 ring-zinc-900 bg-orange/5":
            selectedCampaign === data.id && activeSelection,
        })}
      >
        <CardContent className="py-4 px-0 flex flex-col gap-3">
          {!!activeSelection && (
            <div className="w-full justify-end flex items-center px-5">
              <RadioGroupItem
                value={data.id}
                id={data.id}
                className="bg-orange dark:text-black border-orange"
              />
            </div>
          )}
          <div className="text-muted-foreground w-full flex justify-between px-5">
            <div className="flex items-center gap-2 text-sm">
              <CalIcon />
              Created {fDate(data.createdAt)}
            </div>
            <div className="flex gap-3 items-center">
              <CustomDialog
                header="Customers"
                description="Manage your customer that added to this campaign."
                content={
                  <div className="w-full flex flex-col gap-3">
                    <Input
                      placeholder="Search for email..."
                      onChange={debouncedSearch}
                      defaultValue={searchQuery}
                      type="text"
                    />
                    <div className="w-full flex gap-3 justify-start">
                      {!!data.Customer.length && (
                        <ButtonWithLoaderAndProgress
                          onClick={onRemoveAllCustomersCampaign}
                          variant={"outline"}
                          className="gap-1"
                          disabled={removeCustomerCampaignLoading}
                          loading={removeCustomerCampaignLoading}
                        >
                          Remove All
                        </ButtonWithLoaderAndProgress>
                      )}
                      {!!selectedIds.length && (
                        <ButtonWithLoaderAndProgress
                          size={"icon"}
                          variant={"destructive"}
                          onClick={onRemoveCustomersCampaign}
                          disabled={removeCustomerCampaignLoading}
                          loading={removeCustomerCampaignLoading}
                        >
                          <Trash2Icon strokeWidth={1.4} size={20} />
                        </ButtonWithLoaderAndProgress>
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-3 max-h-[500px]">
                      <DataTable
                        headers={[
                          <div className="w-full h-full flex items-center">
                            <Checkbox
                              checked={
                                data.Customer.length == 0
                                  ? false
                                  : data.Customer.length === selectedIds.length
                              }
                              onCheckedChange={addAllIds}
                              className={cn(
                                "data-[state=checked]:bg-orange border-black !text-black"
                              )}
                            />
                          </div>,
                          "Email",
                          "Domain",
                        ]}
                      >
                        {!!filteredCustomers.length &&
                          filteredCustomers.map((e) => {
                            return (
                              <TableRow key={e.id}>
                                <TableCell>
                                  <Checkbox
                                    defaultChecked={selectedIds.some(
                                      (i) => i === e.id
                                    )}
                                    checked={selectedIds.some(
                                      (i) => i === e.id
                                    )}
                                    onCheckedChange={() => addId(e.id)}
                                    className={cn(
                                      "data-[state=checked]:bg-orange !text-black",
                                      {
                                        "border-black": selectedIds.some(
                                          (i) => i === e.id
                                        ),
                                      }
                                    )}
                                  />
                                </TableCell>
                                <TableCell>{e.email}</TableCell>
                                <TableCell className="text-right">
                                  {e.Domain?.name}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </DataTable>
                      {!filteredCustomers.length && (
                        <p className="text-center text-sm text-muted-foreground">
                          No Customer Added
                        </p>
                      )}
                    </div>
                  </div>
                }
              >
                <div className="flex items-center gap-2 text-sm hover:text-orange cursor-pointer">
                  <PersonIcon />
                  {data.Customer.length} customers added
                </div>
              </CustomDialog>
              <AlertDialog>
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger type="button" asChild>
                      <div className="cursor-pointer">
                        <EllipsisIcon
                          size={22}
                          className="text-muted-foreground"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DialogTrigger asChild>
                          <DropdownMenuItem className="flex items-center gap-2 w-full">
                            <TypeIcon size={20} strokeWidth={1.4} />
                            Edit
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="flex items-center gap-2 hover:!bg-red-400 dark:hover:!bg-red-700">
                            <Trash size={20} strokeWidth={1.4} />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent className={cn("overflow-auto max-h-[95vh]")}>
                    <DialogHeader>
                      <DialogTitle className="dark:text-gray-200">
                        Edit Email
                      </DialogTitle>
                      <DialogDescription>
                        This email will be sent to campaign members.
                      </DialogDescription>
                    </DialogHeader>
                    <UpdateEmailTemplateForm
                      campaignId={data.id}
                      emailTemplate={
                        data.template ? JSON.parse(data.template) : ""
                      }
                    />
                  </DialogContent>
                </Dialog>

                <AlertDialogContent
                  className={cn("overflow-auto max-h-[95vh]")}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-gray-200">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      By doing this, campaing and all the related data will
                      permanently delete forever.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <ButtonWithLoaderAndProgress
                      variant={"destructive"}
                      loading={deleteCampaignLoading}
                      disabled={deleteCampaignLoading}
                      onClick={onDeleteCampaign}
                    >
                      Delete
                    </ButtonWithLoaderAndProgress>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <Separator orientation="horizontal" className="mb-3" />
          <div className="w-full flex justify-between items-start gap-10 px-5">
            <p className="text-2xl font-semibold">{data.name}</p>
            <div className="flex gap-3 items-center">
              <ButtonWithLoaderAndProgress
                loading={sendEmailMarketingLoading}
                disabled={sendEmailMarketingLoading || !data.Customer.length}
                onClick={onSendEmailMarketing}
                className="gap-2"
              >
                <EmailIcon /> Send Email
              </ButtonWithLoaderAndProgress>
            </div>
          </div>
        </CardContent>
      </Card>
    </Label>
  );
};

export default Campaign;
