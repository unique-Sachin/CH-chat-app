import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: {},
    fetchChat: false,
    chatNotification: [],
  },
  reducers: {
    setChats(state, { payload }) {
      return {
        ...state,
        chats: payload,
      };
    },
    setSelectedChat(state, { payload }) {
      return {
        ...state,
        selectedChat: payload,
      };
    },
    setFetchChat(state, { payload }) {
      return {
        ...state,
        fetchChat: payload,
      };
    },
    SetChatNotification(state, { payload }) {
      return {
        ...state,
        chatNotification: payload,
      };
    },
  },
});
