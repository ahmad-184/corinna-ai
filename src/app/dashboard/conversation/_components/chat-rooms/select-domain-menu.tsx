"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChatStore } from "@/zustand/chat-store/chat-store-provider";
import { useEffect } from "react";

type Props = {
  domains_list:
    | {
        id: string;
        name: string;
      }[]
    | [];
};

const SelectDomainMenu = ({ domains_list }: Props) => {
  const setDomain = useChatStore((store) => store.setDomain);
  const selected_domain = useChatStore((store) => store.selected_domain);

  useEffect(() => {
    if (!selected_domain && domains_list[0]) setDomain(domains_list[0].id);
  }, [selected_domain]);

  return (
    <div className="w-full">
      <Select onValueChange={setDomain} defaultValue={domains_list[0]?.id}>
        <SelectTrigger className="h-12 w-full" type="button">
          <SelectValue
            className="w-full h-full"
            placeholder="Select a domain"
          />
        </SelectTrigger>
        <SelectContent>
          {domains_list.map((e, i) => (
            <SelectItem key={e.id} value={e.id}>
              {e.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDomainMenu;
