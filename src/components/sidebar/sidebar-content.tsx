"use client";

import { SIDE_BAR_MENU } from "@/constants/menu";
import { useSidebar } from "@/contexts/use-sidebar-context";
import { MenuLogo } from "@/icons/menu-logo";
import { cn } from "@/lib/utils";
import { LogOutIcon, MenuIcon, MonitorSmartphoneIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MenuItem from "./menu-item";
import DomainMenu from "./domain-menu";

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

const SidebarContent = ({ domains }: Props) => {
  const { expand, onExpand, page, onSignOut } = useSidebar();

  return (
    <div
      className={cn(
        "w-full h-full flex items-center flex-col gap-4 overflow-auto",
        {
          "px-2 py-3": !expand,
          "p-2 px-4": expand,
        }
      )}
    >
      {!expand ? <MenuLogo onClick={onExpand} /> : null}
      {expand ? (
        <div className="w-full flex items-center justify-between">
          <Image
            src={"/images/logo.png"}
            alt="website logo"
            width={1000}
            height={1000}
            className="w-[120px]"
          />
          <MenuIcon onClick={onExpand} className="cursor-pointer" />
        </div>
      ) : null}
      <div className={"flex flex-col w-full gap-3 pt-10"}>
        {!!expand && (
          <p className="text-xs text-gray-500 fill-mode-forwards animate-fade-in opacity-0 delay-200">
            MENU
          </p>
        )}
        <div className="flex flex-col gap-1 w-full">
          {SIDE_BAR_MENU.map((e) => (
            <Link href={e.path} key={e.path}>
              <div
                className={cn("rounded-xl p-2 flex justify-start", {
                  "bg-white dark:bg-zinc-950 [&_p]:!font-bold": e.path === page,
                  "justify-center": !expand,
                })}
              >
                <MenuItem label={e.label} icon={e.icon} />
              </div>
            </Link>
          ))}
          <DomainMenu domains={domains} />
        </div>
      </div>
      <div
        className={"flex flex-col w-full gap-3 pt-5 flex-1 justify-end pb-2"}
      >
        {!!expand && (
          <p className="text-xs text-gray-500 fill-mode-forwards animate-fade-in opacity-0 delay-300">
            OPTIONS
          </p>
        )}
        <MenuItem
          label="Sign out"
          className={cn("cursor-pointer", {
            "justify-center": !expand,
          })}
          icon={<LogOutIcon className="dark:text-muted-foreground" />}
          onClick={onSignOut}
        />
        <MenuItem
          label="Mobile app"
          className={cn("cursor-pointer", {
            "justify-center": !expand,
          })}
          icon={
            <MonitorSmartphoneIcon className="dark:text-muted-foreground" />
          }
        />
      </div>
    </div>
  );
};
export default SidebarContent;
