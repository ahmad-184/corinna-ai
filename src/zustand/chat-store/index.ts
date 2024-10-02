import { createStore } from "zustand/vanilla";

type ChatType = {
  message: string;
  id: string;
  role: "assistant" | "user" | null;
  createdAt: Date;
  seen: boolean;
};

export type ChatState = {
  realtime: boolean;
  chatRoom: string | undefined;
  chats: ChatType[];
  loading: boolean;
};

export type ChatActions = {
  setRealtime: (data: boolean) => void;
  setChatRoom: (data: string | undefined) => void;
  setChats: (data: ChatType[]) => void;
  setLoading: (data: boolean) => void;
};

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
  chatRoom: undefined,
  chats: [],
  loading: false,
  realtime: false,
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set) => ({
    ...initState,
    setChatRoom: (data) =>
      set({
        chatRoom: data,
      }),
    setRealtime: (data) =>
      set({
        realtime: data,
      }),
    setChats: (data) =>
      set({
        chats: data,
      }),
    setLoading: (data) =>
      set({
        loading: data,
      }),
  }));
};
