"use client";

import { Plans } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import CustomersTable from "./customers-table";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import { Button, buttonVariants } from "@/components/ui/button";
import CustomDialog from "@/components/custom/custom-dialog";
import CreateCampaignForm from "@/components/form/create-campaign-form";
import { PlusIcon } from "lucide-react";
import Campaign from "./campaign";
import { RadioGroup } from "@/components/ui/radio-group";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { addCustomersToCampaignAction } from "@/actions/marketings";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import BuyCreditsForm from "@/components/form/buy-credit-form";

type Props = {
  data: {
    customers: {
      id: string;
      email: string | null;
      Domain: {
        name: string;
      } | null;
    }[];
    subscription: {
      plan: Plans;
      credits: number;
      spent_credits: number;
    } | null;
    campaigns: {
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
    }[];
    domains: {
      id: string;
      name: string;
    }[];
  };
};

const EmailMarketing = ({ data }: Props) => {
  const [campaigns, setCampaigns] = useState<Props["data"]["campaigns"]>(
    data.campaigns || []
  );
  const [customers, setCustomers] = useState<Props["data"]["customers"]>(
    data.customers || []
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCampaignSelection, setActiveCampaignSelection] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const addAllIds = (e: boolean) => {
    if (e === true) return setSelectedIds(data.customers.map((e) => e.id));
    if (e === false) return setSelectedIds([]);
  };

  const {
    mutate: addCustomersToCampaign,
    isPending: addCustomersToCampaignLoading,
  } = useMutation({
    mutationFn: addCustomersToCampaignAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data && e.data.status === 200) {
        router.refresh();
        toast.success("Success");
        setSelectedIds([]);
        setSelectedCampaign("");
      }
    },
  });
  const onAddCustomersToCampaign = () => {
    if (!selectedIds.length || !selectedCampaign) return;
    addCustomersToCampaign({
      campaignId: selectedCampaign,
      customers: selectedIds,
    });
  };

  const addId = (id: string) => {
    if (selectedIds.some((e) => e === id))
      return setSelectedIds((prev) => prev.filter((e) => e !== id));
    setSelectedIds((prev) => [...prev, id]);
  };

  const filterByFilterSelection = useCallback(
    (domain_name: string) => {
      if (domain_name === "all" && data.customers.length)
        return setCustomers(data.customers);
      if (data.customers.length)
        return setCustomers(
          data.customers.filter((e) => e.Domain?.name === domain_name)
        );
    },
    [data.customers]
  );

  useEffect(() => {
    setCampaigns(data.campaigns);
    setCustomers(data.customers);
  }, [data]);

  useEffect(() => {
    if (!selectedIds.length) {
      setActiveCampaignSelection(false);
      setSelectedCampaign("");
    } else setActiveCampaignSelection(true);
  }, [selectedIds]);

  useEffect(() => {
    if (!data.customers.length) return setCustomers([]);
    const search = searchParams.get("search");
    if (!search) return setCustomers(data.customers);
    setCustomers(data.customers.filter((e) => e.email?.startsWith(search)));
  }, [data.customers]);

  const [parent] = useAutoAnimate();

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 flex-1 gap-5">
      <div className="lg:col-span-1 xl:col-span-1 order-last lg:order-first">
        <CustomersTable
          customers={customers}
          selectedIds={selectedIds}
          addId={addId}
          domains={data.domains}
          filterByFilterSelection={filterByFilterSelection}
          addAllIds={addAllIds}
        />
      </div>
      <div className="col-span-1 gap-5 flex flex-col h-full order-first lg:order-last">
        <div className="w-full flex items-center flex-wrap justify-end gap-3">
          <ButtonWithLoaderAndProgress
            disabled={
              !selectedIds.length ||
              !selectedCampaign ||
              addCustomersToCampaignLoading
                ? true
                : false
            }
            onClick={onAddCustomersToCampaign}
            loading={addCustomersToCampaignLoading}
          >
            <PlusIcon size={22} strokeWidth={1.4} />
            Add to campaign
          </ButtonWithLoaderAndProgress>
          <CustomDialog
            open={openModal}
            onOpenChange={setOpenModal}
            header="Create new campaign"
            description="Add your customers and create a marketing campaign."
            content={<CreateCampaignForm onOpenModal={setOpenModal} />}
          >
            <Button variant={"outline"} className="flex items-center gap-3">
              <PlusIcon size={22} strokeWidth={1.4} />
              New campaign
            </Button>
          </CustomDialog>
          <CustomDialog
            header="Buy Credits"
            description="Need more credits? buy."
            content={<BuyCreditsForm />}
          >
            <div
              className={buttonVariants({
                variant: "outline",
                className: "cursor-pointer",
              })}
            >
              <p className="text-muted-foreground text-sm select-none font-font-semibold">
                {(data.subscription?.credits || 0) -
                  (data.subscription?.spent_credits || 0)}{" "}
                credits
              </p>
            </div>
          </CustomDialog>
        </div>
        <RadioGroup
          onValueChange={setSelectedCampaign}
          value={selectedCampaign}
        >
          <div className="w-full flex flex-col gap-3" ref={parent}>
            {!!campaigns.length &&
              campaigns.map((e) => (
                <Campaign
                  key={e.id}
                  data={e}
                  activeSelection={activeCampaignSelection}
                  selectedCampaign={selectedCampaign}
                />
              ))}
          </div>
        </RadioGroup>
        {!campaigns.length && (
          <div className="w-full h-[150px] text-center flex items-center justify-center">
            <p className="text-muted-foreground">No Campaigns</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailMarketing;
