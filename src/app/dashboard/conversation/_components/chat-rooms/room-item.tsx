import { buttonVariants } from "@/components/ui/button";
import { UrgentIcon } from "@/icons/urgent-icon";
import { fDateTimeHM } from "@/lib/format-time";
import { isChatExpired } from "@/lib/use-cases";
import { cn } from "@/lib/utils";
import { RoomsType } from "@/zustand/chat-store";
import { ImageIcon, UserIcon } from "lucide-react";
import Markdown from "react-markdown";

type Props = {
  room: RoomsType;
  selected_chatroom: string | undefined;
  onFetchConversationData: (chatroom_id: string) => void;
};

const RoomItem = ({
  room,
  selected_chatroom,
  onFetchConversationData,
}: Props) => {
  const expired = isChatExpired(room.chatRoom[0]?.message[0]?.createdAt);
  const msg = room.chatRoom[0].message[0]?.message.includes("(complete)")
    ? room.chatRoom[0].message[0]?.message.replace("(complete)", "")
    : room.chatRoom[0].message[0]?.message.includes("complete")
    ? room.chatRoom[0].message[0]?.message.replace("complete", "")
    : room.chatRoom[0].message[0]?.message.includes("realtime")
    ? room.chatRoom[0].message[0]?.message.replace("realtime", "")
    : room.chatRoom[0].message[0]?.message.includes("(realtime)")
    ? room.chatRoom[0].message[0]?.message.replace("(realtime)", "")
    : room.chatRoom[0].message[0]?.message;

  return (
    <div
      className={buttonVariants({
        variant: "secondary",
        className: `w-full h-[66px] cursor-pointer ${
          selected_chatroom === room.chatRoom[0].id &&
          "!bg-orange/90 text-zinc-900"
        }`,
      })}
      onClick={() => onFetchConversationData(room.chatRoom[0].id)}
    >
      <div className="flex gap-2 flex-1">
        <div className="rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center h-9 w-9">
          <UserIcon
            size={22}
            className={cn({
              "text-orange": selected_chatroom === room.chatRoom[0].id,
            })}
          />
        </div>
        <div className="flex flex-col flex-1">
          <p className="text-sm font-medium truncate">{room.email}</p>
          <div className="flex items-center gap-1">
            {!!room.chatRoom[0].message[0]?.image?.length && (
              <p className="text-xs flex items-center font-light">
                <ImageIcon size={15} strokeWidth={1.3} />
                {!msg && "Image"}
              </p>
            )}
            <Markdown className="[&_p]:truncate max-w-[150px] text-xs font-normal">
              {msg ?? ""}
            </Markdown>
          </div>
        </div>
        <div className="flex flex-col gap-1 justify-start">
          <p className="text-xs font-light">
            {!!room.chatRoom[0].message[0]?.createdAt
              ? fDateTimeHM(room.chatRoom[0].message[0]?.createdAt)
              : fDateTimeHM(room.chatRoom[0].createdAt)}
          </p>
          <div className="flex justify-end">
            {!room.chatRoom[0].message[0]?.seen &&
              expired !== undefined &&
              !expired && <UrgentIcon />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoomItem;
