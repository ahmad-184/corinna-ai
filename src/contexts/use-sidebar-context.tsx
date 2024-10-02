"use client";

import { logoutUser } from "@/actions/auth";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type ContextType = {
  expand: boolean;
  onExpand: () => void;
  page: string | undefined;
  onSignOut: () => void;
};

const Context = createContext<ContextType>({
  expand: false,
  onExpand: () => {},
  page: "",
  onSignOut: () => {},
});

export const useSidebar = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error(`useSidebar must be used within SidebarProvider`);
  }

  return context;
};

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const [expand, setExpand] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSmallScreen = Boolean(window.innerWidth <= 758);
      const expand_store = window.localStorage.getItem(
        "sidebar_expand"
      ) as string;
      setExpand(isSmallScreen ? false : JSON.parse(expand_store));
    }
  }, []);

  const onExpand = () => {
    if (window) window.localStorage.setItem("sidebar_expand", String(!expand));
    setExpand((prev) => !prev);
  };

  const onSignOut = async () => {
    await logoutUser();
  };

  const page = pathname;

  return (
    <Context.Provider
      value={{
        expand,
        onExpand,
        onSignOut,
        page,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default SidebarProvider;
