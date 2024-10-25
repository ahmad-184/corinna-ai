import { validateUser } from "@/actions/auth";
import PageWrapper from "@/components/page-wrapper";
import { Fragment } from "react";
import { ChatStoreProvider } from "@/zustand/chat-store/chat-store-provider";
import ChatRoomMenu from "./_components/chat-rooms";
import ChatWindow from "./_components/chat-window";
import { getMenuRoomsDataAction } from "@/actions/conversation";

export const revalidate = 60;

const Page = async () => {
  await validateUser();

  const data = await getMenuRoomsDataAction({});

  if (data.error) return null;

  return (
    <Fragment>
      <ChatStoreProvider>
        <PageWrapper className="gap-16 py-0">
          <div
            className="grid grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-hidden w-full"
            style={{ height: "calc(100vh - 24px)" }}
          >
            <div className="col-span-1 lg:col-span-1 overflow-y-auto">
              <ChatRoomMenu data={data.data} />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <ChatWindow />
            </div>
          </div>
        </PageWrapper>
      </ChatStoreProvider>
    </Fragment>
  );
};

export default Page;
