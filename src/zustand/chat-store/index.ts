import { ChatMessage, Role } from "@prisma/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { createStore } from "zustand/vanilla";

export type ChatType = {
  message: string;
  id: string;
  createdAt: Date;
  link: string | null;
  image: string | null;
  role: Role | null;
  chatRoomId: string | null;
  seen: boolean;
};

export type RoomsType = {
  id: string;
  email: string | null;
  domainId: string | null;
  chatRoom: {
    createdAt: Date;
    id: string;
    message: ChatType[];
  }[];
};

export type ChatState = {
  selected_domain: string | undefined;
  realtime: boolean;
  selected_chatroom: string | undefined;
  current_room: RoomsType | undefined;
  chats: ChatType[];
  rooms: RoomsType[];
  loading: boolean;
  channel: RealtimeChannel | null;
};

export type ChatActions = {
  setRealtime: (data: boolean) => void;
  setChatRoom: (data: string | undefined) => void;
  setRooms: (data: RoomsType[]) => void;
  setRoomLastMessage: (data: Omit<ChatMessage, "updatedAt">) => void;
  setCurrentRoom: (data: RoomsType | undefined) => void;
  setDomain: (data: string | undefined) => void;
  setChats: (data: ChatType[]) => void;
  setOneChat: (data: ChatType) => void;
  setLoading: (data: boolean) => void;
  setChannel: (data: RealtimeChannel | null) => void;
  setUnreadMessagesRead: () => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
  selected_domain: undefined,
  selected_chatroom: undefined,
  chats: [],
  rooms: [],
  current_room: undefined,
  loading: false,
  realtime: false,
  channel: null,
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setChatRoom: (data) =>
      set({
        selected_chatroom: data,
      }),
    setRooms: (data) =>
      set({
        rooms: data,
      }),
    setCurrentRoom: (data) =>
      set({
        current_room: data,
      }),
    setRoomLastMessage: (data) =>
      set((store) => ({
        rooms: store.rooms.map((room) => {
          if (room.chatRoom[0].id === data.chatRoomId) {
            const res = {
              ...room,
              chatRoom: [
                {
                  ...room.chatRoom[0],
                  message: [{ ...data }],
                },
              ],
            };
            return res;
          }

          return room;
        }),
      })),
    setDomain: (data) =>
      set({
        selected_domain: data,
      }),
    setRealtime: (data) =>
      set({
        realtime: data,
      }),
    setChats: (data) =>
      set({
        chats: data,
      }),
    setOneChat: (data) =>
      set((store) => ({
        chats: [...store.chats, { ...data }],
      })),
    setLoading: (data) =>
      set({
        loading: data,
      }),
    setChannel: (data) =>
      set({
        channel: data,
      }),
    setUnreadMessagesRead: () =>
      set((store) => ({
        chats: store.chats.map((e) => ({ ...e, seen: true })),
      })),
  }));
};
