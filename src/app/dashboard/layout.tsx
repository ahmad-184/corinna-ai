import { validateUser } from "@/actions/auth";
import Sidebar from "@/components/sidebar";
import SidebarProvider from "@/contexts/use-sidebar-context";
import { ChatStoreProvider } from "@/zustand/chat-store/chat-store-provider";

type Props = { children: React.ReactNode };

const Layout = async ({ children }: Props) => {
  await validateUser();

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <ChatStoreProvider>
        <SidebarProvider>
          <Sidebar />
        </SidebarProvider>
        <div className="w-full h-full overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto relative px-4 md:px-9 py-3 flex flex-col gap-2">
            {children}
          </div>
        </div>
      </ChatStoreProvider>
    </div>
  );
};

export default Layout;
