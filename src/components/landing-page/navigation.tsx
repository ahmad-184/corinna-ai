"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { getCurrentUser } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const Navigation = (props: Props) => {
  const { data: user, isPending } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(),
  });

  return (
    <nav className="px-4 lg:px-8 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
      <div>
        <Link href={"/"}>
          <Image
            src={"/images/logo.png"}
            sizes="100vw"
            style={{ width: "20%", height: "auto" }}
            alt="website logo"
            width={0}
            height={0}
            className="!min-w-[130px]"
          />
        </Link>
      </div>
      <ul className="hidden md:flex flex-1 p-0 m-0 items-center gap-5 text-sm font-medium">
        <Link href={"/#"}>
          <li>Home</li>
        </Link>
        <Link href={"/#"}>
          <li>Pricing</li>
        </Link>
        <Link href={"/#"}>
          <li>News Room</li>
        </Link>
        <Link href={"/#"}>
          <li>Features</li>
        </Link>
        <Link href={"/#"}>
          <li>Contact us</li>
        </Link>
      </ul>
      {isPending ? (
        <Skeleton className="w-[150px] h-10 rounded-lg" />
      ) : (
        <Link href={!user?.id ? "/sign-in" : "/dashboard"}>
          <Button className="bg-orange text-black w-[150px] hover:bg-orange">
            {!user?.id ? "Free Trial" : "Dashboard"}
          </Button>
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
