import { createSlice } from "@reduxjs/toolkit";

const ActionSlice = createSlice({
  name: "Auth",
  initialState: {
    token: "",
    pushToken: "",
    userData: {},
    guestChatData: {},
    chatsData: {},
    storedUsers: {},
    messagesData: {},
    loadRemoveUsers: 0,
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    updateDataState: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    setStoreGuestChat: (state, action) => {
      state.guestChatData = action.payload;
    },
    setChatsData: (state, action) => {
      // nó bị lỗi gì mà chỉ đọc chứ ko ghi được ấy nên phải dùng cách này để copy lại object r ghi vào
      state.chatsData = { ...action.payload };
    },

    setStoredUsers: (state, action) => {
      const newUsers = action.payload;
      state.storedUsers[newUsers.userId] = newUsers;
    },
    setChatMessages: (state, action) => {
      const { chatId, messagesData } = action.payload;
      state.messagesData[chatId] = messagesData;
    },
    setLoadRemoveUsers: (state, action) => {
      state.loadRemoveUsers = action.payload;
    },
    setPushToken: (state, action) => {
      state.pushToken = action.payload;
    },
  },
});

export const {
  authenticate,
  updateDataState,
  setStoreGuestChat,
  setChatsData,
  setStoredUsers,
  setChatMessages,
  setLoadRemoveUsers,
  setPushToken,
} = ActionSlice.actions;

export default ActionSlice.reducer;
